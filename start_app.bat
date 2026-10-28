@echo off
title BrandGuard Autonomous Governance Platform - Launcher
color 0A

echo =====================================================================
echo           BRANDGUARD AUTONOMOUS GOVERNANCE PLATFORM
echo =====================================================================
echo.
echo [*] Initializing Full-Stack Environment...
echo.

cd /d "%~dp0"

echo [*] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "BrandGuard Backend (FastAPI)" cmd /k "cd backend && python run.py"

timeout /t 2 /nobreak >nul

echo [*] Starting Frontend Vite Server on http://127.0.0.1:5173 ...
start "BrandGuard Frontend (Vite)" cmd /k "npm run dev -- --host 127.0.0.1 --port 5173"

timeout /t 2 /nobreak >nul

echo.
echo =====================================================================
echo [*] System is LIVE!
echo [*] Frontend App:     http://127.0.0.1:5173
echo [*] Backend API:      http://127.0.0.1:8000
echo [*] API Swagger Docs: http://127.0.0.1:8000/docs
echo =====================================================================
echo.
echo [*] Opening BrandGuard in your browser...
start http://127.0.0.1:5173

exit
