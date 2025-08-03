@echo off
echo ========================================
echo    微信公众号自定义菜单配置工具
echo ========================================
echo.

echo 请选择操作：
echo 1. 创建自定义菜单
echo 2. 删除自定义菜单
echo 3. 查看当前菜单配置
echo 4. 退出
echo.

set /p choice=请输入选择 (1-4): 

if "%choice%"=="1" (
    echo.
    echo 🔧 正在创建微信公众号自定义菜单...
    node create-wechat-menu.js create
) else if "%choice%"=="2" (
    echo.
    echo 🗑️ 正在删除微信公众号自定义菜单...
    node create-wechat-menu.js delete
) else if "%choice%"=="3" (
    echo.
    echo 📋 正在获取当前菜单配置...
    node create-wechat-menu.js get
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