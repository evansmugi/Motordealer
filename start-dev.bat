@echo off
title Dual Frontend Strapi Launcher
cd /d "%~dp0"

:: Ensure Node v22.13.0 environment is loaded
if exist "%USERPROFILE%\.config\herd\bin\nvm\v22.13.0\node.exe" (
    set "PATH=%USERPROFILE%\.config\herd\bin\nvm\v22.13.0;%PATH%"
) else (
    call nvm use 22.13.0 >nul 2>&1
)

echo =========================================================
echo  1. Starting Strapi CMS Backend (Port 1337 / PostgreSQL)
echo =========================================================
start "1. Strapi Backend (Port 1337)" cmd /k "cd /d "%~dp0" && set "PATH=%USERPROFILE%\.config\herd\bin\nvm\v22.13.0;%PATH%" && npm run develop"

if exist "%~dp0frontend\package.json" (
    echo =========================================================
    echo  2. Starting Next.js Customer Portal (Port 3000)
    echo =========================================================
    start "2. Next.js Public Portal (Port 3000)" cmd /k "cd /d "%~dp0frontend" && set "PATH=%USERPROFILE%\.config\herd\bin\nvm\v22.13.0;%PATH%" && npm run dev"
)

if exist "%~dp0dashboard\package.json" (
    echo =========================================================
    echo  3. Starting React Vite Business Dashboard (Port 5173)
    echo =========================================================
    start "3. React POS/CRM/ERP Dashboard (Port 5173)" cmd /k "cd /d "%~dp0dashboard" && set "PATH=%USERPROFILE%\.config\herd\bin\nvm\v22.13.0;%PATH%" && npm run dev"
)

echo.
echo =========================================================
echo All 3 servers launching in separate terminal windows!
echo  - Strapi CMS Admin:       http://localhost:1337/admin
echo  - Next.js Customer Portal: http://localhost:3000
echo  - POS/CRM/ERP Dashboard:   http://localhost:5173
echo =========================================================
echo.
