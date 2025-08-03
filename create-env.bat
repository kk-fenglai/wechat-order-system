@echo off
echo ========================================
echo    创建环境变量配置文件
echo ========================================
echo.

echo 请按照以下步骤配置你的环境变量：
echo.

echo 1. 复制 env.example 文件为 .env
echo 2. 编辑 .env 文件，填入你的实际配置
echo 3. 特别是 MONGODB_URI，需要填入你的MongoDB Atlas连接字符串
echo.

echo 示例MongoDB Atlas连接字符串格式：
echo MONGODB_URI=mongodb+srv://用户名:密码@集群地址.mongodb.net/数据库名?retryWrites=true^&w=majority
echo.

echo 创建 .env 文件...
copy env.example .env

if exist .env (
    echo ✅ .env 文件创建成功！
    echo.
    echo 请编辑 .env 文件，填入你的实际配置信息
    echo 然后运行以下命令测试数据库连接：
    echo   node test-db.js
) else (
    echo ❌ .env 文件创建失败
)

echo.
pause 