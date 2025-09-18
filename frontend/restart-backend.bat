@echo off
echo Stopping all Python processes...
taskkill /f /im python.exe 2>nul

echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo Starting INGRES RAG API with full functionality...
cd ingres_SIH-master\ingres-rag-api
venv\Scripts\activate
python main-light.py
