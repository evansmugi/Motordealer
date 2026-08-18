@echo off
:: Self-elevate to admin
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

:: Add strapi.test to hosts file
echo. >> C:\Windows\System32\drivers\etc\hosts
echo 127.0.0.1 strapi.test  #laragon magic! >> C:\Windows\System32\drivers\etc\hosts
echo Done! strapi.test added to hosts file.
pause
