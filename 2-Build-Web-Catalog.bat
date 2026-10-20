@echo off
title [STEP 2] Build Mobile Web Catalog from Curated Excel
cd /d "%~dp0"
echo ====================================================================
echo   KMART NET — Step 2: Build Web Catalog from Curated Excel
echo ====================================================================
echo.
echo Reading remaining products from Vision_Products_Catalog.xlsx,
echo embedding packshot images, and generating standalone index.html...
echo.
node build-web-catalog.js
echo.
pause
