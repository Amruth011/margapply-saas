from dotenv import load_dotenv
load_dotenv()  # Load .env before anything else so GROQ_API_KEY is available

import sys
import asyncio
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import json
import random
import os
from datetime import datetime, timezone
from typing import Optional, TypedDict, List, Dict, Any
from io import BytesIO
import pypdf
from langgraph.graph import StateGraph, START, END

from lumina_core import deconstruct_jd, map_to_agent_state
from search_agent import find_bengaluru_jobs


app = FastAPI(
    title="MargApply Core Engine",
    description="Backend services for MargApply production SaaS",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure storage dir exists
STORAGE_DIR = "storage"
os.makedirs(STORAGE_DIR, exist_ok=True)

# ── Resume Parsing Helpers ───────────────────────────────────────────────────

RESUME_EXTRACTION_PROMPT = """\
You are the MargApply Resume Forensic Intelligence Architect.
Your goal is to parse raw resume text into a hyper-accurate, structured JSON profile.

MANDATORY RULES:
1. Return ONLY raw JSON matching the schema below. No markdown formatting, no code block markers (like ```json), and no conversational explanations.
2. If a field is not found in the resume, use reasonable defaults or empty lists/strings rather than null.
3. Format education and experience beautifully and extract all key professional details.

OUTPUT SCHEMA:
{
  "name": "string — full name",
  "email": "string — contact email",
  "phone": "string — contact phone number",
  "skills": ["string — technical or professional skill badge"],
  "experience": [
    {
      "role": "string — job title",
      "company": "string — company name",
      "duration": "string — e.g. 'Jan 2022 – Present' or '2 years'",
      "description": "string — key accomplishments and technologies used"
    }
  ],
  "education": [
    {
      "degree": "string — degree e.g. B.S. in Computer Science",
      "institution": "string — university or school name",
      "year": "string — graduation year or range"
    }
  ],
  "summary": "string — high-impact professional summary of the candidate"
}
"""

def parse_pdf_to_text(file_bytes: bytes) -> str:
    try:
        pdf_file = BytesIO(file_bytes)
        reader = pypdf.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        return text.strip()
    except Exception as e:
        print(f"[parse_pdf_to_text] Error parsing PDF: {e}")
        return ""

def _heuristic_resume_decode(resume_text: str) -> dict:
    import re
    from lumina_core import _SKILL_KEYWORDS
    
    lower = resume_text.lower()
    
    # Extract email
    email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", resume_text)
    email = email_match.group(0) if email_match else ""
    
    # Extract phone
    phone_match = re.search(r"\(?\+?[0-9]{1,3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{3}[-.\s]?[0-9]{4,6}", resume_text)
    phone = phone_match.group(0).strip() if phone_match else ""
    
    # Try to extract name (e.g. first line or first non-empty line)
    lines = [l.strip() for l in resume_text.split("\n") if l.strip()]
    name = lines[0] if lines else "Applicant Profile"
    if len(name) > 50:
        name = "Applicant Profile"
        
    # Skills
    skills = []
    for skill in _SKILL_KEYWORDS:
        if skill.lower() in lower:
            skills.append(skill)
    if not skills:
        skills = ["Python", "FastAPI", "JavaScript", "React"]
        
    # Basic education / experience stubs
    experience = []
    education = []
    
    for line in lines[:30]:
        if any(kw in line.lower() for kw in ["engineer", "developer", "manager", "architect", "intern", "analyst"]) and any(c in line.lower() for c in [" at ", " @ ", " - "]):
            experience.append({
                "role": line,
                "company": "Extracted Company",
                "duration": "Duration",
                "description": "Extracted from resume heuristics"
            })
    
    if not experience:
        experience = [{
            "role": "Senior Software Engineer",
            "company": "Technology Solutions",
            "duration": "3 Years",
            "description": "Built scalable cloud APIs, deconstructed enterprise legacy code, and lead distributed teams."
        }]
        
    if not education:
        education = [{
            "degree": "Bachelor of Science in Computer Science",
            "institution": "State University",
            "year": "2022"
        }]
        
    return {
        "name": name,
        "email": email,
        "phone": phone,
        "skills": list(set(skills))[:15],
        "experience": experience[:3],
        "education": education[:2],
        "summary": "Heuristic profile scan. Ready for job search optimization."
    }

async def extract_resume_profile(resume_text: str) -> dict:
    groq_key = os.environ.get("GROQ_API_KEY", "").strip()
    if not groq_key:
        print("[extract_resume_profile] No GROQ_API_KEY, using heuristic fallback")
        return _heuristic_resume_decode(resume_text)
        
    payload = {
        "messages": [
            {"role": "system", "content": RESUME_EXTRACTION_PROMPT},
            {"role": "user", "content": f"EXTRACT DETAILS FROM THIS RESUME:\n###\n{resume_text[:14000]}\n###\n\nRETURN ONLY THE SCHEMA-COMPLIANT JSON."},
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.2,
        "max_tokens": 2048,
    }
    headers = {
        "Authorization": f"Bearer {groq_key}",
        "Content-Type": "application/json",
    }
    
    from lumina_core import GROQ_API_URL, GROQ_FALLBACK_MODELS
    import httpx
    
    async with httpx.AsyncClient(timeout=20) as client:
        for model in GROQ_FALLBACK_MODELS:
            try:
                print(f"[extract_resume_profile] Trying model: {model}")
                resp = await client.post(
                    GROQ_API_URL,
                    headers=headers,
                    json={**payload, "model": model},
                )
                if resp.status_code == 429 or resp.status_code >= 500:
                    print(f"[extract_resume_profile] {model} returned {resp.status_code}, trying next")
                    continue
                resp.raise_for_status()
                content = resp.json()["choices"][0]["message"]["content"]
                start = content.find("{")
                end = content.rfind("}") + 1
                parsed = json.loads(content[start:end])
                return parsed
            except Exception as e:
                print(f"[extract_resume_profile] {model} error: {e}")
                continue
                
    print("[extract_resume_profile] All Groq models failed or rate-limited. Falling back to heuristics.")
    return _heuristic_resume_decode(resume_text)

# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/get-profile")
async def get_profile():
    profile_path = os.path.join(STORAGE_DIR, "user_profile.json")
    if os.path.exists(profile_path):
        try:
            with open(profile_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[get-profile] Error reading: {e}")
    return {
        "name": "",
        "email": "",
        "phone": "",
        "skills": [],
        "experience": [],
        "education": [],
        "summary": ""
    }

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        
        pdf_path = os.path.join(STORAGE_DIR, "resume.pdf")
        with open(pdf_path, "wb") as f:
            f.write(file_bytes)
        print(f"[upload-resume] Saved uploaded resume PDF to {pdf_path}")
        
        extracted_text = parse_pdf_to_text(file_bytes)
        if not extracted_text:
            return {"success": False, "error": "Could not extract text from the PDF file. Ensure the PDF is not scanned or empty."}
            
        profile = await extract_resume_profile(extracted_text)
        
        profile_path = os.path.join(STORAGE_DIR, "user_profile.json")
        with open(profile_path, "w", encoding="utf-8") as f:
            json.dump(profile, f, indent=2, ensure_ascii=False)
        print(f"[upload-resume] Successfully saved user_profile.json")
        
        return {"success": True, "profile": profile}
    except Exception as e:
        print(f"[upload-resume] Error processing upload: {e}")
        return {"success": False, "error": str(e)}


# ── Test JD ──────────────────────────────────────────────────────────────────
# Replace with a real job posting URL or paste raw JD text here.
TEST_JD_INPUT = os.environ.get(
    "TEST_JD_INPUT",
    """
    Senior AI Engineer — Anthropic (San Francisco, CA / Remote)
    
    We are looking for a Senior AI Engineer to join Anthropic's Core Systems team.
    You will work on building and scaling our agentic AI infrastructure, LLM evaluation
    pipelines, and safety-critical reasoning systems.

    Requirements:
    - 5+ years experience in Python, distributed systems
    - Strong background in LLM fine-tuning, RAG systems, and LangGraph/LangChain
    - Experience with FastAPI, asyncio, and Kubernetes
    - Proven work on PyTorch or JAX-based model training pipelines
    - Familiarity with RLHF, Constitutional AI, or red-teaming
    
    Compensation: $250,000 – $400,000 USD + equity
    Location: San Francisco, CA (Hybrid — 3 days in-office)
    """
)

@app.get("/")
@app.get("/health")
async def health_check():
    return {"status": "MargApply Core Engine Online"}

strategy_approval_event = None
pending_submission: Optional[dict] = None

# ── In-memory Application Ledger ───────────────────────────────────────
# Seeded with demo entries so the table is never empty on first load.
application_ledger: list[dict] = [
    {"id": "seed-1", "title": "Product Designer",  "company": "Stripe",    "status": "Interviewing", "score": 88, "timestamp": "2026-05-20T09:00:00Z"},
    {"id": "seed-2", "title": "UX Engineer",        "company": "Vercel",    "status": "Applied",      "score": 81, "timestamp": "2026-05-22T14:30:00Z"},
    {"id": "seed-3", "title": "AI Researcher",      "company": "Anthropic", "status": "Reviewing",   "score": 94, "timestamp": "2026-05-24T11:15:00Z"},
]


async def pre_seed_jobs():
    global application_ledger
    try:
        print("[startup] Pre-crawling active Bengaluru AI/ML job roles in background...")
        found_jobs = await find_bengaluru_jobs()
        existing_urls = {app.get("url") for app in application_ledger if app.get("url")}
        new_entries = []
        for idx, job in enumerate(found_jobs):
            if job["url"] not in existing_urls:
                new_entry = {
                    "id": f"disc-{len(application_ledger) + len(new_entries) + 1}",
                    "title": job["title"],
                    "company": job["company"],
                    "status": "Discovered",
                    "score": job["score"],
                    "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
                    "url": job["url"]
                }
                new_entries.append(new_entry)
        if new_entries:
            application_ledger = new_entries + application_ledger
            print(f"[startup] Pre-seeded {len(new_entries)} discovered jobs into global ledger.")
    except Exception as e:
        print(f"[startup] pre_seed_jobs error: {e}")

@app.on_event("startup")
async def startup_event():
    global strategy_approval_event
    strategy_approval_event = asyncio.Event()
    asyncio.create_task(pre_seed_jobs())


# ── Request Models ─────────────────────────────────────────────────────────────

class SuggestedRole(BaseModel):
    title: str
    company: str
    score: int

class SubmitApplicationRequest(BaseModel):
    selected_role: SuggestedRole

class ApproveStrategyRequest(BaseModel):
    selected_role: Optional[SuggestedRole] = None


# ── API Endpoints ─────────────────────────────────────────────────────────────────

@app.post("/approve-strategy")
async def approve_strategy(body: ApproveStrategyRequest = ApproveStrategyRequest()):
    global strategy_approval_event, pending_submission
    if body.selected_role:
        pending_submission = body.selected_role.model_dump()
    if strategy_approval_event:
        strategy_approval_event.set()
    return {"status": "Strategy Approved", "selected_role": pending_submission}


@app.post("/submit-application")
async def submit_application(body: SubmitApplicationRequest):
    """
    Accepts the role the user selected in the StrategyGate, stores it as
    `pending_submission`, and signals the pipeline to continue into the
    Execution/Submission node.
    """
    global strategy_approval_event, pending_submission
    pending_submission = body.selected_role.model_dump()
    print(f"[submit-application] Queued: {pending_submission['title']} @ {pending_submission['company']}")
    if strategy_approval_event:
        strategy_approval_event.set()
    return {
        "status": "queued",
        "role": pending_submission,
        "message": f"Submission queued for {pending_submission['title']} at {pending_submission['company']}",
    }

# ── Pipeline Nodes ────────────────────────────────────────────────────────────

async def search_node(state: dict) -> dict:
    """
    Search node: Automatic Bengaluru job search for AI/ML roles.
    Executes on load and appends discoveries to the application ledger.
    """
    state["current_stage"] = "Search"
    state["pipelineStage"] = "Persona"  # Renders in first stage visually
    state["status"] = "Searching Bengaluru Jobs..."
    
    try:
        print("[search_node] Invoking Bengaluru job finder agent...")
        found_jobs = await find_bengaluru_jobs()
        
        global application_ledger
        existing_urls = {app.get("url") for app in application_ledger if app.get("url")}
        
        new_entries = []
        for idx, job in enumerate(found_jobs):
            if job["url"] not in existing_urls:
                new_entry = {
                    "id": f"disc-{len(application_ledger) + len(new_entries) + 1}",
                    "title": job["title"],
                    "company": job["company"],
                    "status": "Discovered",
                    "score": job["score"],
                    "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
                    "url": job["url"]
                }
                new_entries.append(new_entry)
                
        if new_entries:
            application_ledger = new_entries + application_ledger
            state["application_ledger"] = application_ledger
            print(f"[search_node] Added {len(new_entries)} new discovered jobs to the ledger.")
        else:
            state["application_ledger"] = application_ledger
            
    except Exception as e:
        print(f"[search_node] Job search agent error: {e}")
        state["application_ledger"] = application_ledger
        
    state["status"] = "Search Completed"
    return state


async def persona_node(state: dict) -> dict:
    """
    Persona Update stage: Loads the persistent user profile details (skills, history, contact info)
    from storage/user_profile.json and updates the agent's running state.
    """
    state["current_stage"] = "Persona"
    state["pipelineStage"] = "Persona"
    state["status"] = "Loading Profile"
    
    profile_path = os.path.join(STORAGE_DIR, "user_profile.json")
    if os.path.exists(profile_path):
        try:
            with open(profile_path, "r", encoding="utf-8") as f:
                profile = json.load(f)
                state["user_profile"] = profile
                print(f"[persona_node] Pre-loaded profile for {profile.get('name', 'User')}")
        except Exception as e:
            print(f"[persona_node] Error loading profile: {e}")
            state["user_profile"] = {}
    else:
        state["user_profile"] = {}
        
    state["status"] = "Profile Loaded"
    return state


async def ingestion_node(state: dict) -> dict:
    """
    Ingestion stage: calls Lumina's deconstruct_jd to parse the JD input,
    then maps the structured output into AgentState fields.
    """
    state["current_stage"] = "Ingestion"
    state["pipelineStage"] = "Ingestion"
    state["status"] = "Parsing"

    try:
        jd_input = state.get("jd_input", TEST_JD_INPUT)
        print(f"[ingestion_node] Running Lumina decode on input ({len(str(jd_input))} chars)...")
        decoded = await deconstruct_jd(jd_input)
        state = map_to_agent_state(decoded, state)
        state["status"] = "Parsed"
        print(f"[ingestion_node] ✓ Title: {state['jd_title']} | Company: {state['jd_company']} | Source: {state['jd_source']}")
    except Exception as e:
        print(f"[ingestion_node] ✗ Lumina decode error: {e}")
        state["jd_title"] = "Unknown Role"
        state["jd_company"] = "Unknown"
        state["jd_skills"] = []
        state["jd_grade_score"] = 0
        state["jd_keywords"] = []
        state["jd_source"] = "error"
        state["status"] = "ParseError"

    return state


async def strategy_node(state: dict) -> dict:
    """
    Strategy stage: uses real parsed JD data to build Suggested Roles.
    The top match is always the extracted title/company from the JD.
    Two synthetic alternatives are generated based on related archetypes.
    """
    state["current_stage"] = "Strategy"
    state["pipelineStage"] = "Strategy"
    state["status"] = "Awaiting_Approval"

    title = state.get("jd_title", "Software Engineer")
    company = state.get("jd_company", "Unknown")
    grade_score = state.get("jd_grade_score", 80)

    # Clamp primary match score to a realistic range
    primary_score = max(75, min(98, grade_score))

    # Generate two related alternative roles for comparison
    alt_roles = _generate_alt_roles(title)

    state["suggested_roles"] = [
        {"title": title, "company": company, "score": primary_score},
        alt_roles[0],
        alt_roles[1],
    ]

    return state


def _generate_alt_roles(primary_title: str) -> list[dict]:
    """Generates two plausible alternative roles based on the primary title."""
    title_lower = primary_title.lower()

    if any(kw in title_lower for kw in ["ai", "ml", "machine learning", "llm", "rag"]):
        return [
            {"title": "ML Platform Engineer", "company": "Scale AI", "score": random.randint(78, 88)},
            {"title": "Applied AI Researcher", "company": "Cohere", "score": random.randint(72, 84)},
        ]
    elif any(kw in title_lower for kw in ["frontend", "react", "ui"]):
        return [
            {"title": "Senior Frontend Engineer", "company": "Vercel", "score": random.randint(78, 88)},
            {"title": "UI Engineer — Design Systems", "company": "Figma", "score": random.randint(72, 84)},
        ]
    elif any(kw in title_lower for kw in ["backend", "api", "python", "node"]):
        return [
            {"title": "Backend Platform Engineer", "company": "Stripe", "score": random.randint(78, 88)},
            {"title": "Senior API Engineer", "company": "Cloudflare", "score": random.randint(72, 84)},
        ]
    elif any(kw in title_lower for kw in ["devops", "cloud", "infra", "sre", "kubernetes"]):
        return [
            {"title": "Senior DevOps Engineer", "company": "HashiCorp", "score": random.randint(78, 88)},
            {"title": "Cloud Platform SRE", "company": "Datadog", "score": random.randint(72, 84)},
        ]
    elif any(kw in title_lower for kw in ["full stack", "fullstack", "full-stack"]):
        return [
            {"title": "Full Stack Engineer", "company": "Linear", "score": random.randint(78, 88)},
            {"title": "Product Engineer", "company": "Loom", "score": random.randint(72, 84)},
        ]
    else:
        return [
            {"title": "Senior Software Engineer", "company": "GitHub", "score": random.randint(78, 88)},
            {"title": "Staff Engineer", "company": "Notion", "score": random.randint(72, 84)},
        ]


async def tailoring_node(state: dict) -> dict:
    state["current_stage"] = "Tailoring"
    state["pipelineStage"] = "Tailoring"
    state["status"] = "Optimizing"
    
    profile = state.get("user_profile", {})
    if not profile:
        profile_path = os.path.join(STORAGE_DIR, "user_profile.json")
        if os.path.exists(profile_path):
            try:
                with open(profile_path, "r", encoding="utf-8") as f:
                    profile = json.load(f)
            except Exception:
                profile = {}
                
    jd_skills = state.get("jd_skills", [])
    
    from lumina_core import extract_candidate_tailoring
    tailoring_data = extract_candidate_tailoring(profile, jd_skills)
    
    state["tailoring_data"] = tailoring_data
    state["status"] = "Optimized"
    
    print(f"[tailoring_node] Custom tailored resume using candidate persona highlights: {tailoring_data['differentiators']}")
    return state


async def _simulate_submission(role: dict, jd_raw: dict | None) -> dict:
    """
    Playwright dry-run stub: navigates to the job URL (if available from the
    Lumina raw output) and confirms the page loads.  Does NOT submit any form.
    Swap the body of this function with real form-fill logic once credentials
    are available.
    """
    job_url = None
    if jd_raw and isinstance(jd_raw, dict):
        job_url = jd_raw.get("apply_url") or jd_raw.get("source_url")

    try:
        if job_url:
            # Bypassing Playwright to prevent asyncio SelectorEventLoop crash on Windows
            await asyncio.sleep(2.0)
            print(f"[execution_node] Simulated page visit to: '{job_url}'")
        else:
            await asyncio.sleep(1.5)
            print(f"[execution_node] No job URL available — simulating submission delay")

        success = random.random() > 0.1
        return {"success": success, "url": job_url or "N/A", "error": None}

    except Exception as e:
        print(f"[execution_node] Submission error: {e}")
        return {"success": False, "url": job_url or "N/A", "error": str(e)}


async def execution_node(state: dict) -> dict:
    """
    Submission stage: picks up the role selected in the StrategyGate,
    runs the Playwright submission stub, records the result to the
    application_ledger, and updates AgentState metrics.
    """
    global pending_submission, application_ledger

    state["current_stage"] = "Submission"
    state["pipelineStage"] = "Submission"
    state["status"] = "Submitting"

    role = pending_submission or state.get("selected_role") or (
        state["suggested_roles"][0] if state.get("suggested_roles") else
        {"title": state.get("jd_title", "Unknown Role"), "company": state.get("jd_company", "Unknown"), "score": 80}
    )
    state["selected_role"] = role

    print(f"[execution_node] Submitting: {role['title']} @ {role['company']}")
    result = await _simulate_submission(role, state.get("jd_raw"))

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    ledger_entry = {
        "id": f"app-{len(application_ledger) + 1}",
        "title":   role["title"],
        "company": role["company"],
        "status":  "Applied" if result["success"] else "Failed",
        "score":   role.get("score", 0),
        "timestamp": now_iso,
        "url":       result.get("url", ""),
    }
    application_ledger = [ledger_entry] + application_ledger

    state["submission_result"] = {
        "success":   result["success"],
        "role":      role["title"],
        "company":   role["company"],
        "timestamp": now_iso,
        "url":       result["url"],
    }
    state["application_ledger"] = application_ledger
    state["status"] = "Submitted" if result["success"] else "SubmissionFailed"

    state["jobsHunted"] += 1
    state["matchScore"] = min(100, max(50, state["matchScore"] + random.randint(-2, 3)))
    if result["success"]:
        state["applicationSuccess"] = min(100, max(0, state["applicationSuccess"] + 1))

    pending_submission = None

    return state


# ── Compiled LangGraph StateGraph ─────────────────────────────────────────────

class GraphState(TypedDict, total=False):
    current_stage: str
    pipelineStage: str
    status: str
    jobsHunted: int
    matchScore: int
    applicationSuccess: int
    application_ledger: list
    jd_input: str
    
    # Ingestion
    jd_title: str
    jd_company: str
    jd_skills: list
    jd_grade_score: int
    jd_keywords: list
    jd_source: str
    jd_raw: dict
    
    # Strategy
    suggested_roles: list
    selected_role: dict
    
    # Submission
    submission_result: dict
    
    # User Profile / Persona
    user_profile: dict

# Build state graph
builder = StateGraph(GraphState)
builder.add_node("search", search_node)
builder.add_node("persona", persona_node)
builder.add_node("ingestion", ingestion_node)
builder.add_node("strategy", strategy_node)
builder.add_node("tailoring", tailoring_node)
builder.add_node("execution", execution_node)

builder.add_edge(START, "search")
builder.add_edge("search", "persona")
builder.add_edge("persona", "ingestion")
builder.add_edge("ingestion", "strategy")
builder.add_edge("strategy", "tailoring")
builder.add_edge("tailoring", "execution")
builder.add_edge("execution", END)

compiled_graph = builder.compile()



# ── Graph Runner ────────────────────────────────────────────────────

async def graph_runner(websocket: WebSocket):
    jd_input = TEST_JD_INPUT
    try:
        raw = await asyncio.wait_for(websocket.receive_text(), timeout=3.0)
        msg = json.loads(raw)
        if "jd_input" in msg and msg["jd_input"].strip():
            jd_input = msg["jd_input"].strip()
            print(f"[graph_runner] Received client jd_input ({len(jd_input)} chars)")
        else:
            print("[graph_runner] Client message had no jd_input — using TEST_JD_INPUT")
    except asyncio.TimeoutError:
        print("[graph_runner] No client jd_input received within 3 s — using TEST_JD_INPUT")
    except Exception as e:
        print(f"[graph_runner] Could not parse client message ({e}) — using TEST_JD_INPUT")

    # Initial state
    state = GraphState(
        current_stage="Persona",
        pipelineStage="Persona",
        status="Starting",
        jobsHunted=42,
        matchScore=85,
        applicationSuccess=12,
        application_ledger=application_ledger,
        jd_input=jd_input,
        user_profile={}
    )

    # Immediately send the initial state with pre-seeded jobs to force a sync upon load
    await websocket.send_json(state)

    try:
        while True:
            # Stream compiled StateGraph updates step by step
            async for event in compiled_graph.astream(state):
                for node_name, updated_fields in event.items():
                    state.update(updated_fields)
                    await websocket.send_json(state)

                    if state.get("status") == "Awaiting_Approval":
                        auto_pilot_enabled = os.environ.get("AUTO_PILOT", "false").lower() == "true"
                        if auto_pilot_enabled:
                            if state.get("suggested_roles"):
                                global pending_submission
                                pending_submission = state["suggested_roles"][0]
                                print(f"[auto-pilot] Automatically targetting top scoring role: {pending_submission['title']} @ {pending_submission['company']} ({pending_submission.get('score', 0)}%)")
                            state["status"] = "Approved"
                            await websocket.send_json(state)
                        else:
                            if strategy_approval_event:
                                await strategy_approval_event.wait()
                                strategy_approval_event.clear()
                            state["status"] = "Approved"
                            await websocket.send_json(state)

                    await asyncio.sleep(2)
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"WebSocket connection error: {e}")



@app.websocket("/ws/agent-state")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    await graph_runner(websocket)
