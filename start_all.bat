@echo off
setlocal
cd /d "%~dp0"

echo =============================================
echo  SkinCare Check - Backend + Frontend
echo  Mode: Tanpa Supabase / Local JSON
echo =============================================
echo.

where python >nul 2>nul
if errorlevel 1 (
  echo Python tidak ditemukan. Install Python 3.10+ dulu.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm tidak ditemukan. Install Node.js LTS dulu.
  pause
  exit /b 1
)

if not exist backend\venv (
  echo [1/4] Membuat virtual environment backend...
  python -m venv backend\venv
)

echo [2/4] Install dependency backend...
call backend\venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r backend\requirements.txt

echo [3/4] Install dependency frontend...
cd frontend
if not exist node_modules (
  npm install
)
cd ..

echo [4/4] Menjalankan backend dan frontend...
start "SkinCare Backend" cmd /k "cd /d %cd%\backend && call venv\Scripts\activate.bat && python -m uvicorn app.main:app --reload"
start "SkinCare Frontend" cmd /k "cd /d %cd%\frontend && npm run dev"

echo.
echo Backend Docs: http://127.0.0.1:8000/docs
echo Frontend:     http://localhost:5173
echo.
pause
