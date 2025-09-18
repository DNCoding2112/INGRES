#!/bin/bash

echo "Starting INGRES RAG API Server..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed or not in PATH"
    echo "Please install Python 3.8+ and try again"
    exit 1
fi

# Navigate to the RAG API directory
cd "$(dirname "$0")/ingres_SIH-master/ingres-rag-api"

# Check if virtual environment exists, if not create one
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Error: .env file not found!"
    echo "Please create a .env file with your ChromaDB and Gemini API credentials"
    echo
    echo "Example .env file content:"
    echo "CHROMA_API_KEY=your_chroma_api_key_here"
    echo "CHROMA_TENANT=your_chroma_tenant_here"
    echo "CHROMA_DATABASE=your_chroma_database_here"
    echo "GEMINI_API_KEY=your_gemini_api_key_here"
    exit 1
fi

# Start the FastAPI server
echo "Starting FastAPI server on http://127.0.0.1:8000"
echo "Press Ctrl+C to stop the server"
echo
python main.py
