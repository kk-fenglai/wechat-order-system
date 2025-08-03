@echo off
echo 微信云开发快速设置脚本
echo ========================
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
echo 2. 安装云函数依赖...
cd cloudfunctions\wechat-message
npm install
if errorlevel 1 (
    echo 错误: 依赖安装失败
    pause
    exit /b 1
)
echo ✓ 云函数依赖安装完成

echo.
echo 3. 返回项目根目录...
cd ..\..

echo.
echo ========================
echo 设置完成！
echo.
echo 下一步操作：
echo 1. 下载并安装微信开发者工具
echo 2. 在微信公众平台开通云开发
echo 3. 导入项目到微信开发者工具
echo 4. 部署云函数
echo 5. 配置微信公众号服务器地址
echo.
echo 详细步骤请查看: docs\cloud-deployment.md
echo.
pause 