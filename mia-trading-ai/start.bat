@echo off
chcp 65001 >nul
title Aicy Server
cd /d "%~dp0"

echo.
echo ════════════════════════════════════════════
echo   💕 Aicy - 来自2157年的赛博少女
echo ════════════════════════════════════════════
echo.

:: 检查Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 未检测到 Node.js
    echo    请安装: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js 已安装
echo.
echo 🚀 启动服务器...
echo.
echo    访问地址: http://localhost:8080
echo    按 Ctrl+C 停止
echo.
echo ════════════════════════════════════════════
echo.

node server.js

pause
