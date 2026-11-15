@echo off
title OrbiTrace - Biology Map Server
echo ===================================================
echo   Starting OrbiTrace (Biology Map) Local Server...
echo ===================================================
if not exist ".venv" (
    echo Creating virtual environment...
    python -m venv .venv
)
call .venv\Scripts\activate
echo Installing requirements...
pip install -r requirements.txt --quiet
echo Starting Django Server at http://127.0.0.1:8000/
start http://127.0.0.1:8000/
python manage.py runserver
pause
