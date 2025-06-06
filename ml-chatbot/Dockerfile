# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies (add more if your ML code needs them)
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install scikit-learn==1.5.2

# Copy the rest of your application code into the container
COPY . .

# Expose the port (Render will set $PORT)
EXPOSE $PORT

# Start the app with Gunicorn
CMD gunicorn --bind 0.0.0.0:$PORT app:app
