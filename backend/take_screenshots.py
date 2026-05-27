"""
Take live screenshots of MargApply dashboard and the proof page.
"""
import asyncio
import sys
import os

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

ARTIFACTS_DIR = r"C:\Users\shara\.gemini\antigravity\brain\e8b973ab-d0e2-4082-9b4c-654cc7d9f9bd"

async def take_screenshots():
    from playwright.async_api import async_playwright

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        # ── Screenshot 1: MargApply Dashboard ─────────────────────────────────
        print("Loading MargApply dashboard...")
        await page.goto("http://localhost:3000/dashboard", timeout=20000, wait_until="networkidle")
        await asyncio.sleep(3)  # Let live data and animations settle
        dashboard_path = os.path.join(ARTIFACTS_DIR, "ss_dashboard.png")
        await page.screenshot(path=dashboard_path, full_page=True)
        print(f"Dashboard screenshot saved: {dashboard_path}")

        # ── Screenshot 2: Proof image (mock invoice) ───────────────────────────
        print("Loading proof screenshot (test-app-2)...")
        await page.goto("http://localhost:8000/storage/proofs/test-app-2.png", timeout=15000, wait_until="load")
        await asyncio.sleep(1)
        proof_invoice_path = os.path.join(ARTIFACTS_DIR, "ss_proof_invoice.png")
        await page.screenshot(path=proof_invoice_path, full_page=True)
        print(f"Proof invoice screenshot saved: {proof_invoice_path}")

        # ── Screenshot 3: Proof image (real URL overlay) ───────────────────────
        print("Loading proof screenshot (test-app-1 real URL)...")
        await page.goto("http://localhost:8000/storage/proofs/test-app-1.png", timeout=15000, wait_until="load")
        await asyncio.sleep(1)
        proof_real_path = os.path.join(ARTIFACTS_DIR, "ss_proof_real.png")
        await page.screenshot(path=proof_real_path, full_page=True)
        print(f"Proof real URL screenshot saved: {proof_real_path}")

        await browser.close()
        print("Done!")

asyncio.run(take_screenshots())
