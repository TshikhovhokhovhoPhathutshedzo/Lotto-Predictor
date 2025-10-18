@echo off
echo ========================================
echo   Lotto Predictor by Phathu
echo   Starting all services...
echo ========================================

echo.
echo [1/3] Starting Python ML Service...
start "ML Service" cmd /k "cd ml-service && python app.py"

echo.
echo [2/3] Starting Node.js Backend...
start "Backend API" cmd /k "cd server && npm start"

echo.
echo [3/3] Starting React Frontend...
start "Frontend" cmd /k "cd client && npm start"

echo.
echo ========================================
echo   All services are starting...
echo   Please wait for all services to load.
echo ========================================
echo.
echo Services will be available at:
echo - Frontend: http://localhost:3000
echo - Backend:  http://localhost:5000
echo - ML Service: http://localhost:5001
echo.
echo Created by Phathu - Powered by AI & Machine Learning
echo ========================================

pause
