"""
test_url_jd.py — Integration test: feed a real job URL into deconstruct_jd
and verify the StrategyGate will receive real extracted data.
"""
import asyncio
import sys
from dotenv import load_dotenv
load_dotenv()

from lumina_core import deconstruct_jd, map_to_agent_state

# Use a publicly-accessible Greenhouse job posting
TEST_URL = sys.argv[1] if len(sys.argv) > 1 else "https://job-boards.greenhouse.io/cloudflare/jobs/6569352"

async def main():
    print(f"=== URL JD Integration Test ===")
    print(f"Input: {TEST_URL}")
    result = await deconstruct_jd(TEST_URL)
    state = map_to_agent_state(result, {})
    print(f"Title    : {state['jd_title']}")
    print(f"Company  : {state['jd_company']}")
    print(f"Skills   : {state['jd_skills'][:6]}")
    print(f"Grade    : {state['jd_grade_score']}")
    print(f"Source   : {state['jd_source']}")
    print(f"Keywords : {state['jd_keywords'][:5]}")
    print("=== PASSED ===")

asyncio.run(main())
