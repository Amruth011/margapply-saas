import asyncio
import httpx
from io import BytesIO
import pypdf
import os

async def main():
    print("=== TESTING RESUME ENDPOINTS ===")
    
    print("Creating dummy PDF...")
    from pypdf import PdfWriter
    writer = PdfWriter()
    page = writer.add_blank_page(width=72 * 8.5, height=72 * 11)
    
    pdf_path = "test_resume.pdf"
    with open(pdf_path, "wb") as f:
        writer.write(f)
        
    print(f"Dummy PDF created at {pdf_path}")
    
    print("Testing via FastAPI TestClient...")
    from fastapi.testclient import TestClient
    import main
    
    # Mock text extraction so we pass validation and hit parsing
    main.parse_pdf_to_text = lambda x: """
Sharath Kumar
Email: sharath@gmail.com
Phone: +91 9876543210

Professional Summary:
Experienced Senior AI Systems Engineer with a focus on FastAPI, LangGraph, and Next.js applications.

Skills:
Python, FastAPI, TypeScript, React, Next.js, LangGraph, LLMs, PostgreSQL, Docker, AWS

Work Experience:
Senior Software Engineer | TechCorp | Jan 2023 - Present
- Developed and deployed multi-agent reasoning graphs using LangGraph.
- Optimized API performance by 40% using FastAPI async endpoints.

Education:
Bachelor of Technology in Computer Science | Indian Institute of Technology | 2022
"""
    
    client = TestClient(main.app)
    
    with open(pdf_path, "rb") as f:
        response = client.post("/upload-resume", files={"file": ("resume.pdf", f, "application/pdf")})

        
    print("Upload Response status:", response.status_code)
    print("Upload Response JSON:", response.json())
    
    response = client.get("/get-profile")
    print("Get Profile Response JSON:", response.json())
    
    # Cleanup
    if os.path.exists(pdf_path):
        os.remove(pdf_path)
    if os.path.exists("storage/resume.pdf"):
        os.remove("storage/resume.pdf")
    if os.path.exists("storage/user_profile.json"):
        os.remove("storage/user_profile.json")
        
    print("=== TEST COMPLETED ===")

if __name__ == "__main__":
    asyncio.run(main())
