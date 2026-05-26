"""
lumina_core.py — MargApply Ingestion Bridge
=============================================
Ports the Lumina JD Scanner's core deconstruct_jd logic into a native Python
module. Accepts raw JD text *or* a URL, calls Groq with the Lumina forensic
system prompt, and returns a structured dict compatible with AgentState.

Fallback: if the LLM call fails, a heuristic parser extracts the title,
top skills, and company from raw text so the pipeline never blocks.
"""

import os
import re
import json
import asyncio
from typing import Optional

import httpx

# ── Config ──────────────────────────────────────────────────────────────────
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_FALLBACK_MODELS = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
]

# System prompt ported verbatim from Lumina's decode-jd edge function
LUMINA_SYSTEM_PROMPT = """\
You are the Lumina Forensic Intelligence Architect.
Your goal is to deconstruct JDs into hyper-accurate data structures.

MANDATORY RULES:
1. ESTIMATION IS COMPULSORY: Never return 0, null, or empty for scores. Use market knowledge.
2. CURRENCY: India roles = INR, else USD.
3. Return ONLY raw JSON matching the schema below. No markdown, no explanation.

OUTPUT SCHEMA:
{
  "valid": true,
  "title": "string — exact job title",
  "company": "string — company name if mentioned, else 'Unknown'",
  "skills": [{"category": "string", "skill": "string", "importance": 90}],
  "requirements": {"education": ["string"], "experience": "string", "soft_skills": ["string"]},
  "grade": {"score": 85, "letter": "A", "summary": "string"},
  "logistics": {
    "salary_range": {"min": 0, "max": 0, "currency": "USD", "estimate": true, "note": "string"},
    "work_arrangement": {"remote_friendly": "yes/no/partial/unspecified"}
  },
  "red_flags": [{"phrase": "string", "intensity": 50, "note": "string"}],
  "resume_help": {"keywords": ["string"]}
}
"""

# ── URL → Text ───────────────────────────────────────────────────────────────

async def _fetch_url_text(url: str) -> str:
    """
    Fetches raw page text from a URL using Playwright for JS-heavy job boards
    (LinkedIn, Greenhouse, Lever, Workday, etc.), falling back to plain HTTP.
    """
    try:
        from playwright.async_api import async_playwright  # type: ignore
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.goto(url, timeout=20000, wait_until="domcontentloaded")
            # Wait a beat for JS-rendered content
            await asyncio.sleep(2)
            text = await page.inner_text("body")
            await browser.close()
            return text[:15000]
    except Exception as pw_err:
        print(f"[lumina_core] Playwright failed, falling back to httpx. Error: {str(pw_err).encode('ascii', 'replace').decode('ascii')}")
        try:
            async with httpx.AsyncClient(follow_redirects=True, timeout=15) as client:
                resp = await client.get(url, headers={"User-Agent": "Mozilla/5.0"})
                resp.raise_for_status()
                # Strip HTML tags with a simple regex
                raw = re.sub(r"<[^>]+>", " ", resp.text)
                raw = re.sub(r"\s+", " ", raw)
                return raw[:15000]
        except Exception as http_err:
            raise RuntimeError(f"Failed to fetch URL: {http_err}") from http_err


# ── Heuristic Fallback ───────────────────────────────────────────────────────

_TITLE_PATTERNS = [
    (r"(senior|lead|principal|staff)\s+(frontend|backend|full.?stack|software|ml|ai|data)\s+(engineer|developer|architect)", lambda m: m.group(0).title()),
    (r"(frontend|backend|full.?stack)\s+(engineer|developer)", lambda m: m.group(0).title()),
    (r"(machine learning|ml|ai|nlp|llm)\s+engineer", lambda m: m.group(0).title()),
    (r"(data scientist|data analyst|data engineer)", lambda m: m.group(0).title()),
    (r"(product manager|engineering manager|devops engineer|sre)", lambda m: m.group(0).title()),
]

_SKILL_KEYWORDS = [
    "Python", "TypeScript", "JavaScript", "React", "Next.js", "Node.js",
    "FastAPI", "Django", "Go", "Rust", "Java", "C#", "AWS", "GCP", "Azure",
    "Kubernetes", "Docker", "Terraform", "LangChain", "LangGraph", "RAG",
    "LLM", "PyTorch", "TensorFlow", "SQL", "PostgreSQL", "MongoDB", "Redis",
    "GraphQL", "REST", "gRPC", "Kafka", "Spark", "Airflow", "dbt",
]

def _heuristic_decode(jd_text: str) -> dict:
    lower = jd_text.lower()

    # Title
    title = "Software Engineer"
    for pattern, formatter in _TITLE_PATTERNS:
        m = re.search(pattern, lower)
        if m:
            title = formatter(re.search(pattern, jd_text, re.IGNORECASE))
            break

    # Company — look for "at <Company>" or "Company: X" patterns
    company = "Unknown"
    company_match = re.search(
        r"(?:at|@|company[:\s]+|join\s+)([A-Z][A-Za-z0-9&\s\-]{2,30}?)(?:\s*[\.,\n]|$)",
        jd_text
    )
    if company_match:
        company = company_match.group(1).strip()

    # Skills
    skills = []
    for skill in _SKILL_KEYWORDS:
        if skill.lower() in lower:
            skills.append({"category": "Technical", "skill": skill, "importance": 85})
    if not skills:
        skills = [{"category": "Technical", "skill": "Software Engineering", "importance": 80}]

    return {
        "valid": True,
        "title": title,
        "company": company,
        "skills": skills[:12],
        "requirements": {
            "education": [],
            "experience": "",
            "soft_skills": [],
        },
        "grade": {"score": 75, "letter": "B", "summary": "Heuristic scan — LLM unavailable."},
        "logistics": {
            "salary_range": {"min": 0, "max": 0, "currency": "USD", "estimate": True, "note": ""},
            "work_arrangement": {"remote_friendly": "unspecified"},
        },
        "red_flags": [],
        "resume_help": {"keywords": [s["skill"] for s in skills[:10]]},
        "_source": "heuristic",
    }


# ── LLM Decode ───────────────────────────────────────────────────────────────

async def _llm_decode(jd_text: str, groq_key: str) -> dict:
    user_msg = (
        f"ACT ON THIS JD:\n###\n{jd_text[:14000]}\n###\n\nRETURN ONLY RAW JSON MATCHING THE SCHEMA."
    )
    payload = {
        "messages": [
            {"role": "system", "content": LUMINA_SYSTEM_PROMPT},
            {"role": "user", "content": user_msg},
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.3,
        "max_tokens": 2048,
    }
    headers = {
        "Authorization": f"Bearer {groq_key}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=20) as client:
        for model in GROQ_FALLBACK_MODELS:
            try:
                print(f"[lumina_core] Trying model: {model}")
                resp = await client.post(
                    GROQ_API_URL,
                    headers=headers,
                    json={**payload, "model": model},
                )
                if resp.status_code == 429 or resp.status_code >= 500:
                    print(f"[lumina_core] {model} returned {resp.status_code}, trying next")
                    continue
                resp.raise_for_status()
                content = resp.json()["choices"][0]["message"]["content"]
                # Safely extract JSON block
                start = content.find("{")
                end = content.rfind("}") + 1
                parsed = json.loads(content[start:end])
                parsed["_source"] = "llm"
                parsed["_model"] = model
                return parsed
            except Exception as e:
                print(f"[lumina_core] {model} error: {e}")
                continue

    raise RuntimeError("All Groq models exhausted.")


# ── Public API ───────────────────────────────────────────────────────────────

async def deconstruct_jd(input_text: str) -> dict:
    """
    Core function: accepts a raw JD text OR a URL string.
    Returns a structured dict with at minimum:
      - title (str)
      - company (str)
      - skills (list of {category, skill, importance})
      - resume_help.keywords (list of str)
      - grade.score (int)
      - valid (bool)

    Falls back to heuristic parsing if LLM is unavailable.
    """
    jd_text = input_text.strip()

    # If input looks like a URL, scrape it first
    if re.match(r"https?://", jd_text):
        print(f"[lumina_core] Detected URL — scraping: {jd_text}")
        jd_text = await _fetch_url_text(jd_text)

    groq_key = os.environ.get("GROQ_API_KEY", "").strip()

    if groq_key:
        try:
            return await _llm_decode(jd_text, groq_key)
        except Exception as e:
            print(f"[lumina_core] LLM decode failed ({e}), falling back to heuristic")

    return _heuristic_decode(jd_text)


def map_to_agent_state(decoded: dict, state: dict) -> dict:
    """
    Maps Lumina DecodeResult fields into MargApply AgentState fields.
    This keeps a clean boundary between Lumina's schema and our pipeline state.
    """
    state["jd_title"] = decoded.get("title", "Unknown Role")
    state["jd_company"] = decoded.get("company", "Unknown")
    state["jd_skills"] = [s["skill"] for s in decoded.get("skills", [])[:10]]
    state["jd_grade_score"] = decoded.get("grade", {}).get("score", 0)
    state["jd_keywords"] = decoded.get("resume_help", {}).get("keywords", [])
    state["jd_source"] = decoded.get("_source", "unknown")
    state["jd_raw"] = decoded  # Preserve full output for later pipeline nodes
    return state


def extract_candidate_tailoring(profile: dict, jd_skills: list) -> dict:
    """
    Extracts candidate-specific matches and unique project highlights
    (e.g., B.Tech in AI & Data Science, Kannada NLP projects) that
    align with the target job's requested skills.
    """
    skills = profile.get("skills", [])
    experience = profile.get("experience", [])
    education = profile.get("education", [])
    
    # Identify unique differentiators from the profile text/education
    differentiators = []
    
    # Look for B.Tech in AI or specific degrees
    for edu in education:
        degree = str(edu.get("degree", ""))
        if any(kw in degree for kw in ["AI", "Data Science", "Computer", "Intelligence"]):
            differentiators.append("B.Tech in Artificial Intelligence & Data Science")
            
    # Look for Kannada NLP or NLP/AI projects in experience
    for exp in experience:
        desc = str(exp.get("description", ""))
        role = str(exp.get("role", ""))
        if any(kw in desc.lower() or kw in role.lower() for kw in ["kannada", "nlp", "translation"]):
            differentiators.append("Kannada Natural Language Processing (NLP) translation models")
            
    # Standard profile highlights if they aren't explicitly matched
    if "B.Tech in Artificial Intelligence & Data Science" not in differentiators:
        if any("b.tech" in str(edu.get("degree")).lower() or "bachelor" in str(edu.get("degree")).lower() for edu in education):
            differentiators.append("B.Tech in Artificial Intelligence & Data Science")
            
    if "Kannada Natural Language Processing (NLP) translation models" not in differentiators:
        if any("nlp" in str(exp.get("description")).lower() or "nlp" in str(exp.get("role")).lower() for exp in experience):
            differentiators.append("Kannada Natural Language Processing (NLP) translation models")

    # absolute fallback just in case profile has no experience/education
    if not differentiators:
        differentiators = [
            "B.Tech in Artificial Intelligence & Data Science",
            "Kannada Natural Language Processing (NLP) translation models"
        ]
        
    # Overlapping skills
    overlapping_skills = [s for s in skills if any(js.lower() in s.lower() or s.lower() in js.lower() for js in jd_skills)]
    if not overlapping_skills:
        overlapping_skills = skills[:4]
        
    return {
        "differentiators": list(set(differentiators))[:3],
        "matching_skills": list(set(overlapping_skills))[:8],
        "tailored_summary": f"Uniquely matching candidacy highlights: {', '.join(differentiators[:2])}."
    }

