# Use an official lightweight Python image
FROM python:3.10-slim

# Install system dependencies required by pyzbar
RUN apt-get update && apt-get install -y \
    libzbar0 \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Start the FastAPI app using Uvicorn
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-10000}
