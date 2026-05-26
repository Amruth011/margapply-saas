# Use a official lightweight Python image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# Set working directory
WORKDIR /app

# Install system dependencies needed for Playwright browser execution
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    gnupg \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies first to leverage Docker layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright and its system dependencies for Chromium
RUN playwright install --with-deps chromium

# Copy the rest of the application code
COPY . .

# Expose the API port
EXPOSE 8000

# Start FastAPI via uvicorn. Railway dynamically sets the PORT env variable,
# so we run uvicorn binding to 0.0.0.0 and port 8000 (which Railway maps appropriately).
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT}
