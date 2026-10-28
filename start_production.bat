@echo off
title BrandGuard Production Platform (Single Unified Link)
color 0B

echo =====================================================================
echo    BRANDGUARD PRODUCTION PLATFORM (SINGLE UNIFIED LINK: PORT 8000)
echo =====================================================================
echo.
echo [*] Building latest frontend assets...
cd /d "%~dp0"
call npm run build

echo.
echo [*] Starting Unified FastAPI Platform (Frontend + Backend on Port 8000)...
echo [*] Single Live URL: http://127.0.0.1:8000
echo.

start http://127.0.0.1:8000

cd backend
python run.py

pause
