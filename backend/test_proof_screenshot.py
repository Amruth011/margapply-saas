"""
Quick end-to-end test of the screenshot proof generation pipeline.
Directly calls _simulate_submission with a test role and checks:
1. Screenshot file is created in storage/proofs/
2. The URL returned is a valid /storage/proofs/... path
"""
import asyncio
import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
load_dotenv()

import asyncio

# Needed to avoid Windows SelectorEventLoop issues with Playwright
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

from main import _simulate_submission

async def run_test():
    print("\n=== TEST 1: Submission WITH a job URL (overlay on real page) ===")
    role = {"title": "Senior AI Engineer", "company": "Anthropic", "score": 92}
    jd_raw = {"apply_url": "https://www.anthropic.com/careers"}
    result = await _simulate_submission(role, jd_raw, "test-app-1")
    print(f"  Success: {result['success']}")
    print(f"  URL:     {result['url']}")
    print(f"  Error:   {result.get('error')}")
    screenshot_path = "storage/proofs/test-app-1.png"
    exists = os.path.exists(screenshot_path)
    size = os.path.getsize(screenshot_path) if exists else 0
    print(f"  Screenshot exists: {exists} | Size: {size} bytes")

    print("\n=== TEST 2: Submission WITHOUT a job URL (mock invoice template) ===")
    role2 = {"title": "ML Platform Engineer", "company": "Scale AI", "score": 85}
    result2 = await _simulate_submission(role2, None, "test-app-2")
    print(f"  Success: {result2['success']}")
    print(f"  URL:     {result2['url']}")
    print(f"  Error:   {result2.get('error')}")
    screenshot_path2 = "storage/proofs/test-app-2.png"
    exists2 = os.path.exists(screenshot_path2)
    size2 = os.path.getsize(screenshot_path2) if exists2 else 0
    print(f"  Screenshot exists: {exists2} | Size: {size2} bytes")

    print("\n=== SUMMARY ===")
    all_pass = result['url'].startswith('/storage') and exists and size > 1000 and result2['url'].startswith('/storage') and exists2 and size2 > 1000
    print("  ALL TESTS PASSED ✅" if all_pass else "  ⚠️  SOME TESTS FAILED - check output above")

asyncio.run(run_test())
