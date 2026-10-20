@echo off
title [STEP 1] Vision SQL FMCG Catalog Exporter
cd /d "%~dp0"
echo ====================================================================
echo   KMART NET — Step 1: Export Excel Catalog from Vision SQL
echo ====================================================================
echo.
echo Connecting to Vision SQL, cleaning item names, caching packshots,
echo and exporting Vision_Products_Catalog.xlsx...
echo.
node export-catalog.js --excel-only
echo.
pause
