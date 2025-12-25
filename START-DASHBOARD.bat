@echo off
title CryptoDash - Quick Start
color 0A

echo ========================================
echo   CRYPTO DASHBOARD - Quick Start
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found!
    echo Please install Node.js from: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found
echo.

REM Check if package.json exists
if not exist "package.json" (
    echo [ERROR] package.json not found!
    echo Please run this file from the project root directory.
    echo.
    pause
    exit /b 1
)

echo [OK] Project directory verified
echo.

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    echo This may take 2-3 minutes...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies installed
) else (
    echo [OK] Dependencies already installed
)

echo.
echo ========================================
echo   Starting Dashboard...
echo ========================================
echo.
echo Dashboard will open at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
echo The dashboard is now configured to run as a web app.
echo Your web extension files remain intact.
echo.

REM Start the dashboard
call npm run dev

pause
