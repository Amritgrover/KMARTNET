@echo off
title KMART NET - Catalog Exporter Menu
cd /d "%~dp0"
echo ====================================================================
echo   KMART NET — Catalog Exporter Menu
echo ====================================================================
echo.
echo   [1] Step 1: Export Excel Catalog from Vision SQL
echo   [2] Step 2: Build Web Catalog (index.html) from Curated Excel
echo   [3] Run Both Steps (Full Auto Export)
echo.
set /p choice="Enter your choice (1, 2, or 3): "

if "%choice%"=="1" (
    node export-catalog.js --excel-only
) else if "%choice%"=="2" (
    node build-web-catalog.js
) else if "%choice%"=="3" (
    node export-catalog.js --with-web
) else (
    echo Invalid choice. Running Step 1...
    node export-catalog.js --excel-only
)
echo.
pause
