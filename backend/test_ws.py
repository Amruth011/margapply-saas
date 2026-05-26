import asyncio
import websockets

async def test_ws():
    try:
        async with websockets.connect('ws://localhost:8000/ws/agent-state') as ws:
            msg = await ws.recv()
            print("Successfully received:", msg)
    except Exception as e:
        print("Failed:", e)

if __name__ == "__main__":
    asyncio.run(test_ws())
