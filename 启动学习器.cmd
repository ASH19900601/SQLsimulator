@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install Node.js 22 or later, then run this file again.
  pause
  exit /b 1
)
echo QueryPath - CAIE SQL Learning Studio
echo Open http://localhost:4173 in your browser.
echo Keep this window open while studying. Press Ctrl+C to stop.
node scripts\server.mjs
pause
