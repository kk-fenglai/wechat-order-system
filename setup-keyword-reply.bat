@echo off
echo ========================================
echo    微信关键词回复配置工具
echo ========================================
echo.

echo 请选择操作：
echo 1. 检查微信权限
echo 2. 显示关键词配置
echo 3. 生成配置文件
echo 4. 退出
echo.

set /p choice=请输入选择 (1-4): 

if "%choice%"=="1" (
    echo.
    echo 🔍 正在检查微信权限...
    node setup-keyword-reply.js check
) else if "%choice%"=="2" (
    echo.
    echo 📋 正在显示关键词配置...
    node setup-keyword-reply.js display
) else if "%choice%"=="3" (
    echo.
    echo 📄 正在生成配置文件...
    node setup-keyword-reply.js generate > keyword-reply-config.txt
    echo ✅ 配置文件已生成：keyword-reply-config.txt
) else if "%choice%"=="4" (
    echo 退出程序
    exit /b 0
) else (
    echo 无效选择，请重新运行脚本
    exit /b 1
)

echo.
echo 操作完成！
pause 