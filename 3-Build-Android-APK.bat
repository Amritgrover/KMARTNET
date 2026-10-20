@echo off
setlocal
title KMART FMCG - Build Android APK
color 0A

echo ========================================================
echo       KMART FMCG - Standalone Android App Builder
echo ========================================================
echo.

set SCRIPT_DIR=%~dp0
set EXPORT_DIR=C:\Users\Amritpal Singh\Desktop\Vision_Products_Export
set APP_DIR=%SCRIPT_DIR%..\kmart-app
if not exist "%APP_DIR%\app" set APP_DIR=C:\Users\Amritpal Singh\Downloads\kmartnet\kmart-app

if not exist "%EXPORT_DIR%\index.html" (
    echo [ERROR] %EXPORT_DIR%\index.html not found!
    echo Please run 2-Build-Web-Catalog.bat first to generate index.html.
    echo.
    pause
    exit /b 1
)

echo [1/3] Copying latest index.html into Android app assets...
if not exist "%APP_DIR%\app\src\main\assets" mkdir "%APP_DIR%\app\src\main\assets"
copy /Y "%EXPORT_DIR%\index.html" "%APP_DIR%\app\src\main\assets\index.html" >nul
if errorlevel 1 (
    echo [ERROR] Failed to copy index.html to assets.
    pause
    exit /b 1
)

echo [2/3] Compiling Android APK with Gradle...
set JAVA_HOME=C:\Users\Amritpal Singh\AppData\Local\Java\jdk-17.0.20.1+1
cd /d "%APP_DIR%"
call gradlew.bat assembleDebug
if errorlevel 1 (
    echo.
    echo [ERROR] Gradle build failed!
    pause
    exit /b 1
)

echo [3/3] Copying APK to Desktop Export Folder...
copy /Y "%APP_DIR%\app\build\outputs\apk\debug\app-debug.apk" "%EXPORT_DIR%\KMART_FMCG_Catalog.apk" >nul

echo.
echo ========================================================
echo   SUCCESS! Android APK created successfully!
echo   Location: %EXPORT_DIR%\KMART_FMCG_Catalog.apk
echo.
echo   You can send KMART_FMCG_Catalog.apk to your salesmen
echo   via WhatsApp or USB. They can install and run it
echo   100%% offline!
echo ========================================================
echo.
pause
