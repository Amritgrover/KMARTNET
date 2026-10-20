@echo off
title KMART NET - Catalog & Android App Exporter
cd /d "%~dp0"
echo ====================================================================
echo   KMART NET — Catalog & Android App Exporter Menu
echo ====================================================================
echo.
echo   [1] Step 1: Export Excel Catalog from Vision SQL
echo   [2] Step 2: Build Web Catalog (index.html) from Curated Excel
echo   [3] Step 3: Build Android App (KMART_FMCG_Catalog.apk)
echo   [4] Run All Steps (Excel + Web Catalog + Android APK)
echo.
set /p choice="Enter your choice (1, 2, 3, or 4): "

if "%choice%"=="1" (
    node export-catalog.js --excel-only
) else if "%choice%"=="2" (
    node build-web-catalog.js
) else if "%choice%"=="3" (
    call 3-Build-Android-APK.bat
) else if "%choice%"=="4" (
    echo [Running Step 1: Exporting from Vision SQL...]
    node export-catalog.js --excel-only
    echo.
    echo [Running Step 2: Building Web Catalog index.html...]
    node build-web-catalog.js
    echo.
    echo [Running Step 3: Building Android APK...]
    call 3-Build-Android-APK.bat
) else (
    echo Invalid choice. Running Step 1...
    node export-catalog.js --excel-only
)
echo.
pause
