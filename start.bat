@echo off
echo 启动中法集运订单管理系统...
echo.

echo 检查Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

echo 检查MongoDB...
mongod --version >nul 2>&1
if errorlevel 1 (
    echo 警告: 未找到MongoDB，请确保MongoDB服务正在运行
    echo.
)

echo 安装依赖...
npm install

echo.
echo 启动服务器...
npm start

pause 