#!/bin/bash

echo "========================================"
echo "  Lotto Predictor by Phathu"
echo "  Starting all services..."
echo "========================================"

echo ""
echo "[1/3] Starting Python ML Service..."
cd ml-service
python app.py &
ML_PID=$!
cd ..

echo ""
echo "[2/3] Starting Node.js Backend..."
cd server
npm start &
BACKEND_PID=$!
cd ..

echo ""
echo "[3/3] Starting React Frontend..."
cd client
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================"
echo "  All services are starting..."
echo "  Please wait for all services to load."
echo "========================================"
echo ""
echo "Services will be available at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend:  http://localhost:5000"
echo "- ML Service: http://localhost:5001"
echo ""
echo "Created by Phathu - Powered by AI & Machine Learning"
echo "========================================"

# Function to cleanup on exit
cleanup() {
    echo "Stopping all services..."
    kill $ML_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Trap Ctrl+C
trap cleanup INT

# Wait for user to stop
echo "Press Ctrl+C to stop all services"
wait
