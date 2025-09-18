#!/bin/bash

echo "========================================"
echo "   INGRES AI - Groundwater Assistant"
echo "========================================"
echo

echo "Starting both Backend and Frontend services..."
echo

# Function to start backend
start_backend() {
    echo "Starting Backend RAG API Server..."
    cd ingres_SIH-master/ingres-rag-api
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    
    # Activate virtual environment and start server
    source venv/bin/activate
    pip install -r requirements.txt
    python main.py &
    
    BACKEND_PID=$!
    cd ../..
}

# Function to start frontend
start_frontend() {
    echo "Starting Frontend Development Server..."
    npm install
    npm run dev &
    
    FRONTEND_PID=$!
}

# Start both services
start_backend
sleep 5  # Wait for backend to start
start_frontend

echo
echo "========================================"
echo "Services are starting up..."
echo
echo "Backend API: http://127.0.0.1:8000"
echo "Frontend UI: http://localhost:5173"
echo
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap 'echo "Stopping services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit' INT
wait
