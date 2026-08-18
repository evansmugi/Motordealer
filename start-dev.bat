@echo off
title Strapi Project Launcher
cd /d "%~dp0"

:: Ensure Node v22.13.0 is used for Strapi native dependencies
if exist "%USERPROFILE%\.config\herd\bin\nvm\v22.13.0\node.exe" (
    set "PATH=%USERPROFILE%\.config\herd\bin\nvm\v22.13.0;%PATH%"
) else (
    call nvm use 22.13.0 >nul 2>&1
)

echo ===================================================
echo Starting Strapi CMS Backend (Port 1337)...
echo ===================================================
start "Strapi CMS Backend" cmd /k "cd /d "%~dp0" && set "PATH=%USERPROFILE%\.config\herd\bin\nvm\v22.13.0;%PATH%" && npm run develop"

if exist "%~dp0frontend\package.json" (
    echo ===================================================
    echo Starting Next.js Frontend...
    echo ===================================================
    start "Strapi Next.js Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"
)

echo.
echo Both servers launching in separate windows!
echo - Strapi CMS Admin: http://localhost:1337/admin
echo.
