@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo Stopping PostgreSQL service & terminating processes...
taskkill /F /IM postgres.exe /IM pg_ctl.exe >nul 2>&1
net stop postgresql-x64-18 >nul 2>&1
timeout /t 2 /nobreak >nul

echo Resetting Write-Ahead Logs...
del /f /q "C:\Program Files\PostgreSQL\18\data\pg_wal\000000010000000000000028" 2>nul
"C:\Program Files\PostgreSQL\18\bin\pg_resetwal.exe" -f "C:\Program Files\PostgreSQL\18\data"

echo Starting PostgreSQL service...
net start postgresql-x64-18

echo.
echo Done! PostgreSQL recovery lock has been cleared and service restarted.
pause
