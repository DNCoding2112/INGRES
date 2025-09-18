@echo off
echo Starting INGRES RAG API Server...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

REM Navigate to the RAG API directory
cd /d "%~dp0ingres_SIH-master\ingres-rag-api"

REM Check if virtual environment exists, if not create one
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Check if .env file exists
if not exist ".env" (
    echo Error: .env file not found!
    echo Please create a .env file with your ChromaDB and Gemini API credentials
    echo.
    echo Example .env file content:
    echo CHROMA_API_KEY=your_chroma_api_key_here
    echo CHROMA_TENANT=your_chroma_tenant_here
    echo CHROMA_DATABASE=your_chroma_database_here
    echo GEMINI_API_KEY=your_gemini_api_key_here
    pause
    exit /b 1
)

REM Start the FastAPI server
echo Starting FastAPI server on http://127.0.0.1:8000
echo Press Ctrl+C to stop the server
echo.
python main.py

pause
