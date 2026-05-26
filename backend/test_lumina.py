import asyncio
import os
import sys
from dotenv import load_dotenv

# Add backend dir to path
sys.path.insert(0, ".")
load_dotenv()  # Loads GROQ_API_KEY from .env

from lumina_core import deconstruct_jd, map_to_agent_state

TEST_JD = """
Senior AI Engineer - Anthropic (San Francisco, CA / Hybrid)

We are hiring a Senior AI Engineer to work on our LLM evaluation and agentic systems.
Responsibilities include building RAG pipelines, fine-tuning LLMs with RLHF, and deploying
agentic workflows using LangGraph and FastAPI.

Requirements: 5+ years Python, PyTorch, LangChain, LangGraph, Kubernetes, PostgreSQL.
Compensation: 250,000 - 400,000 USD + equity. 3 days in-office required.
"""

async def main():
    print("=== Running Lumina deconstruct_jd integration test ===")
    result = await deconstruct_jd(TEST_JD)
    state = {}
    state = map_to_agent_state(result, state)
    print(f"Title    : {state['jd_title']}")
    print(f"Company  : {state['jd_company']}")
    print(f"Skills   : {state['jd_skills'][:5]}")
    print(f"Grade    : {state['jd_grade_score']}")
    print(f"Source   : {state['jd_source']}")
    print("=== PASSED ===")

asyncio.run(main())
