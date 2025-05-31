# Use an official Python runtime as a parent image
FROM python:3.11-slim-bookworm

# Set the working directory in the container
WORKDIR /app

# Install system dependencies (tesseract-ocr and poppler-utils)
# This runs as root within the Docker build process, allowing installation.
RUN apt-get update -y && \
    apt-get install -y \
    tesseract-ocr \
    poppler-utils \
    # Optional but often helpful dependencies for image processing
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY requirements.txt .

# Install any needed Python packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code into the container
# This copies the 'Flask/' directory, 'Procfile', etc.
COPY . .

# Expose the port the app runs on (Render automatically sets $PORT)
EXPOSE $PORT

# Define the command to run your Flask app with Gunicorn
# This explicitly points to your app within the Flask/ directory
CMD gunicorn --bind 0.0.0.0:$PORT Flask.app:app