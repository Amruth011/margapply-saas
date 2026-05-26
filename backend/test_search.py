import asyncio
import sys
import json
sys.path.insert(0, ".")

async def test_crawler():
    print("=== TESTING JOB FINDER PLAYWRIGHT CRAWLER ===")
    from search_agent import find_bengaluru_jobs
    
    results = await find_bengaluru_jobs()
    print("Crawler results count:", len(results))
    print(json.dumps(results, indent=2))
    
    assert len(results) == 5, "Should return exactly 5 job results"
    for r in results:
        assert "title" in r, "Each job must have a title"
        assert "company" in r, "Each job must have a company"
        assert "url" in r, "Each job must have a URL"
        assert "score" in r, "Each job must have a match score"
        
    print("=== ALL CRAWLER TESTS PASSED ===")

if __name__ == "__main__":
    asyncio.run(test_crawler())
