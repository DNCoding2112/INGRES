@echo off
echo ========================================
echo    INGRES AI - Groundwater Assistant
echo ========================================
echo.

echo Starting both Backend and Frontend services...
echo.

REM Start backend in a new window
echo Starting Backend RAG API Server...
start "INGRES Backend" cmd /k "cd ingres_SIH-master\ingres-rag-api && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && python main.py"

REM Wait a moment for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend in a new window
echo Starting Frontend Development Server...
start "INGRES Frontend" cmd /k "npm install && npm run dev"

echo.
echo ========================================
echo Services are starting up...
echo.
echo Backend API: http://127.0.0.1:8000
echo Frontend UI: http://localhost:5173
echo.
echo Check the opened windows for any errors.
echo Press any key to exit this launcher...
pause >nul
