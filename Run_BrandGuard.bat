@echo off
title BrandGuard AI - Pre-Publication Governance Platform
cd /d D:\BrandGuard\backend
echo ========================================================
echo        BrandGuard AI Governance Platform (Round 2)
echo ========================================================
echo Activating virtual environment...
if exist venv\Scripts\activate (
    call venv\Scripts\activate
)
echo Starting FastAPI Uvicorn Server...
echo ========================================================
echo • Open Review Workspace: http://localhost:8000/app
echo • Open Sign In / Sign Up: http://localhost:8000/login
echo ========================================================
uvicorn main:app --reload --port 8000
pause
