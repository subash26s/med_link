@echo off
TITLE VoiceTriage AI Setup
COLOR 0A

echo Checking for Node.js...
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is NOT installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/ first.
    pause
    exit /b
)

echo.
echo ==================================================
echo   Installing Dependencies...
echo ==================================================
echo.

cd backend
if not exist "node_modules" (
    echo Installing Backend...
    call npm install
)

cd ../frontend
if not exist "node_modules" (
    echo Installing Frontend...
    call npm install
)

echo.
echo ==================================================
echo   Starting Application...
echo ==================================================
echo.

start "VoiceTriage Backend" cmd /k "cd ../backend && npm start"
start "VoiceTriage Frontend" cmd /k "npm run dev"

timeout /t 5 /nobreak >nul
start http://localhost:5173

echo Backend running on http://localhost:5000
echo Frontend running on http://localhost:5173
echo.
pause
