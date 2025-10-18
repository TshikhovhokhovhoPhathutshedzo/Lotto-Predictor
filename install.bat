@echo off
echo ========================================
echo   Lotto Predictor by Phathu
echo   Installing all dependencies...
echo ========================================

echo.
echo [1/4] Installing root dependencies...
npm install

echo.
echo [2/4] Installing backend dependencies...
cd server
npm install
cd ..

echo.
echo [3/4] Installing frontend dependencies...
cd client
npm install
cd ..

echo.
echo [4/4] Installing Python ML dependencies...
cd ml-service
pip install -r requirements.txt
cd ..

echo.
echo ========================================
echo   Installation completed!
echo   Run start.bat to launch the application
echo ========================================
echo.
echo Created by Phathu - Powered by AI & Machine Learning
echo ========================================

pause
