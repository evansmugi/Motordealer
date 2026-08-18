@echo off
title Strapi CMS Project Launcher
cd /d "%~dp0"

:: Ensure Node v22.13.0 environment is loaded for Strapi v5 & PostgreSQL
if exist "%USERPROFILE%\.config\herd\bin\nvm\v22.13.0\node.exe" (
    set "PATH=%USERPROFILE%\.config\herd\bin\nvm\v22.13.0;%PATH%"
) else (
    call nvm use 22.13.0 >nul 2>&1
)

echo =========================================================
echo  Starting Strapi CMS Backend (Port 1337 / PostgreSQL)...
echo =========================================================
start "Strapi Backend (Port 1337)" cmd /k "cd /d "%~dp0" && set "PATH=%USERPROFILE%\.config\herd\bin\nvm\v22.13.0;%PATH%" && npm run develop"

if exist "%~dp0frontend\package.json" (
    echo =========================================================
    echo  Starting Strapi Next.js Frontend (Port 3000)...
    echo =========================================================
    start "Strapi Next.js Frontend (Port 3000)" cmd /k "cd /d "%~dp0frontend" && set "PATH=%USERPROFILE%\.config\herd\bin\nvm\v22.13.0;%PATH%" && npm run dev"
)

echo.
echo =========================================================
echo Strapi Project Servers Started!
echo  - Strapi Admin (HTTP):  http://localhost:1337/admin
echo  - Strapi Admin (HTTPS): https://strapi.test/admin
echo  - Next.js Frontend:     http://localhost:3000
echo =========================================================
echo.
