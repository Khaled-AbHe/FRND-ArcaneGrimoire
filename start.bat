@echo off
title Spell Slot Manager Launcher

echo.
echo  =========================================
echo   ⚔  SPELL SLOT MANAGER - Starting up...
echo  =========================================
echo.

:: ── Find backend folder ───────────────────────────────────────────────────────
:: Assumes this script lives in the same parent folder as both
:: "frontend" and "backend"

set SCRIPT_DIR=%~dp0
set FRONTEND_DIR=%SCRIPT_DIR%frontend
set BACKEND_DIR=%SCRIPT_DIR%backend

:: Check folders exist
if not exist "%FRONTEND_DIR%" (
    echo [ERROR] Could not find frontend folder at:
    echo         %FRONTEND_DIR%
    echo.
    echo Make sure this script is in the same folder as "frontend"
    pause
    exit /b 1
)

if not exist "%BACKEND_DIR%" (
    echo [ERROR] Could not find backend folder at:
    echo         %BACKEND_DIR%
    echo.
    echo Make sure this script is in the same folder as "backend"
    pause
    exit /b 1
)

:: ── Install deps if node_modules missing ──────────────────────────────────────
if not exist "%BACKEND_DIR%\node_modules" (
    echo [Backend] Installing dependencies for the first time...
    cd /d "%BACKEND_DIR%"
    call npm install
    echo [Backend] Done!
    echo.
)

if not exist "%FRONTEND_DIR%\node_modules" (
    echo [Frontend] Installing dependencies for the first time...
    cd /d "%FRONTEND_DIR%"
    call npm install
    echo [Frontend] Done!
    echo.
)

:: ── Start backend in a new window ─────────────────────────────────────────────
echo [Backend]  Starting NestJS API on http://localhost:3001 ...
start "SSM - Backend (API)" cmd /k "cd /d "%BACKEND_DIR%" && npm run start:dev"

:: Small delay so the backend gets a head start
timeout /t 3 /nobreak >nul

:: ── Start frontend in a new window ───────────────────────────────────────────
echo [Frontend] Starting Vite on http://localhost:5173 ...
start "SSM - Frontend (Vite)" cmd /k "cd /d "%FRONTEND_DIR%" && npm run dev"

:: ── Done ─────────────────────────────────────────────────────────────────────
echo.
echo  Both servers are starting in separate windows.
echo  Open http://localhost:5173 in your browser.
echo.
echo  Close the two terminal windows to shut everything down.
echo.
pause
