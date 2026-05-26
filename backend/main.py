from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import random

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

@app.get("/")
async def health_check():
    return {"status": "MargApply Core Engine Online"}

strategy_approval_event = None

@app.on_event("startup")
async def startup_event():
    global strategy_approval_event
    strategy_approval_event = asyncio.Event()

@app.post("/approve-strategy")
async def approve_strategy():
    global strategy_approval_event
    if strategy_approval_event:
        strategy_approval_event.set()
    return {"status": "Strategy Approved"}

async def ingestion_node(state: dict):
    state["current_stage"] = "Ingestion"
    state["pipelineStage"] = "Ingestion" # Kept for frontend backwards compatibility
    state["status"] = "Parsing"
    return state

async def strategy_node(state: dict):
    state["current_stage"] = "Strategy"
    state["pipelineStage"] = "Strategy"
    state["status"] = "Awaiting_Approval"
    state["suggested_roles"] = [
        {"title": "Senior Frontend Engineer", "company": "Vercel", "score": 92},
        {"title": "Full Stack Developer", "company": "Stripe", "score": 88},
        {"title": "React Native Lead", "company": "Discord", "score": 85}
    ]
    return state

async def tailoring_node(state: dict):
    state["current_stage"] = "Tailoring"
    state["pipelineStage"] = "Tailoring"
    state["status"] = "Optimizing"
    return state

async def execution_node(state: dict):
    state["current_stage"] = "Submission"
    state["pipelineStage"] = "Submission"
    state["status"] = "Finalizing"
    
    # Simulate progression on successful submission
    if random.random() > 0.5:
        state["jobsHunted"] += 1
        state["matchScore"] = min(100, max(50, state["matchScore"] + random.randint(-2, 3)))
    if random.random() > 0.8:
        state["applicationSuccess"] = min(100, max(0, state["applicationSuccess"] + 1))
        
    return state

async def graph_runner(websocket: WebSocket):
    state = {
        "current_stage": "Ingestion",
        "pipelineStage": "Ingestion",
        "status": "Starting",
        "jobsHunted": 42,
        "matchScore": 85,
        "applicationSuccess": 12
    }
    
    nodes = [ingestion_node, strategy_node, tailoring_node, execution_node]
    
    try:
        while True:
            for node in nodes:
                # Update state via node logic
                state = await node(state)
                # Broadcast state to frontend
                await websocket.send_json(state)
                
                # Check if we need to pause for manual approval
                if state.get("status") == "Awaiting_Approval":
                    if strategy_approval_event:
                        await strategy_approval_event.wait()
                        strategy_approval_event.clear()
                    state["status"] = "Approved"
                    await websocket.send_json(state)
                
                # Cycle with a 2-second sleep
                await asyncio.sleep(2)
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"WebSocket connection error: {e}")

@app.websocket("/ws/agent-state")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    await graph_runner(websocket)
