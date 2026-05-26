import asyncio
import websockets
import json
import httpx

async def test_apply_flow():
    uri = "ws://localhost:8000/ws/agent-state"
    print("Connecting to WebSocket...")
    async with websockets.connect(uri) as websocket:
        print("Connected. Sending jd_input...")
        await websocket.send(json.dumps({"jd_input": "https://careers.google.com/jobs/results/12345"}))
        
        while True:
            try:
                message = await asyncio.wait_for(websocket.recv(), timeout=20.0)
                state = json.loads(message)
                print(f"Current Pipeline Stage: {state.get('pipelineStage')} | Status: {state.get('status')}")
                
                if state.get("status") == "Awaiting_Approval":
                    print("Reached Awaiting_Approval! Simulating user clicking 'Submit Application'...")
                    suggested_roles = state.get("suggested_roles", [])
                    if suggested_roles:
                        selected_role = suggested_roles[0]
                        print(f"Selecting role: {selected_role}")
                        
                        # Call HTTP POST to /submit-application
                        async with httpx.AsyncClient() as client:
                            resp = await client.post(
                                "http://localhost:8000/submit-application",
                                json={"selected_role": selected_role}
                            )
                            print(f"POST /submit-application response: {resp.status_code} - {resp.text}")
                    else:
                        print("No roles found to select!")
                        break
                        
                if state.get("status") in ["Submitted", "SubmissionFailed"]:
                    print("Execution finished!")
                    print("Latest Ledger Entry:")
                    ledger = state.get("application_ledger", [])
                    if ledger:
                        print(json.dumps(ledger[0], indent=2))
                    break
                    
            except asyncio.TimeoutError:
                print("Timeout waiting for websocket message.")
                break
            except Exception as e:
                print(f"Error: {e}")
                break

if __name__ == "__main__":
    asyncio.run(test_apply_flow())
