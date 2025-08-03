@echo off
echo Vercel快速部署脚本
echo ===================
echo.

echo 1. 检查Node.js环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js已安装

echo.
echo 2. 安装项目依赖...
npm install
if errorlevel 1 (
    echo 错误: 依赖安装失败
    pause
    exit /b 1
)
echo ✓ 项目依赖安装完成

echo.
echo 3. 安装Vercel CLI...
npm install -g vercel
if errorlevel 1 (
    echo 错误: Vercel CLI安装失败
    pause
    exit /b 1
)
echo ✓ Vercel CLI安装完成

echo.
echo 4. 开始部署...
echo 请按照提示操作：
echo - 如果未登录，会要求您登录Vercel
echo - 选择"Y"确认部署
echo - 等待部署完成
echo.
vercel

echo.
echo ===================
echo 部署完成！
echo.
echo 下一步操作：
echo 1. 复制部署URL
echo 2. 在微信公众平台配置服务器地址
echo 3. 测试微信公众号功能
echo.
echo 详细步骤请查看: docs\simple-deployment.md
echo.
pause 