@echo off
setlocal
title KMART NET - FMCG Catalog & Cloud Sync Manager
cd /d "%~dp0"
echo ====================================================================
echo   KMART FMCG ?" Master Catalog & Cloud Sync Menu
echo ====================================================================
echo.
echo   [1] Step 1: Export Excel Catalog from Vision SQL
echo   [2] Step 2: Build Web Catalog (index.html) from Curated Excel
echo   [3] Step 3: Build Android App (KMART_FMCG_Catalog.apk)
echo   [4] Step 4: Sync & Push Catalog to Cloud (OTA Auto-Sync to Salesmen Phones)
echo   [5] Fast Pipeline: Build Web Catalog + Sync to Cloud (Steps 2 + 4)
echo   [6] Full Pipeline: Export + Build Web + Build APK + Cloud Sync (1 + 2 + 3 + 4)
echo.
set /p choice="Enter your choice (1, 2, 3, 4, 5, or 6): "

if "%choice%"=="1" (
    node export-catalog.js --excel-only
) else if "%choice%"=="2" (
    node build-web-catalog.js
) else if "%choice%"=="3" (
    call "C:\Users\Amritpal Singh\Desktop\Vision_Products_Export\3-Build-Android-APK.bat"
) else if "%choice%"=="4" (
    node publish-cloud-catalog.js
) else if "%choice%"=="5" (
    echo.
    echo [Running Step 2: Building Web Catalog...]
    node build-web-catalog.js
    echo.
    echo [Running Step 4: Pushing to Cloud CDN...]
    node publish-cloud-catalog.js
) else if "%choice%"=="6" (
    echo.
    echo [Running Step 1: Exporting from Vision SQL...]
    node export-catalog.js --excel-only
    echo.
    echo [Running Step 2: Building Web Catalog...]
    node build-web-catalog.js
    echo.
    echo [Running Step 3: Compiling Android APK...]
    call "C:\Users\Amritpal Singh\Desktop\Vision_Products_Export\3-Build-Android-APK.bat"
    echo.
    echo [Running Step 4: Pushing to Cloud CDN...]
    node publish-cloud-catalog.js
) else (
    echo Invalid choice. Running Step 4 (Cloud Sync)...
    node publish-cloud-catalog.js
)
echo.
pause
