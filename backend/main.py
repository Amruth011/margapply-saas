from fastapi import FastAPI

app = FastAPI(
    title="MargApply Core Engine",
    description="Backend services for MargApply production SaaS",
    version="1.0.0",
)

@app.get("/")
async def health_check():
    return {"status": "MargApply Core Engine Online"}
