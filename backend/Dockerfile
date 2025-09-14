# Use official Python image
FROM python:3.11-slim

WORKDIR /app

# Copy requirements.txt first to leverage Docker cache for dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code
COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
