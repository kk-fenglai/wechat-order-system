@echo off
echo GitHub快速推送脚本
echo ===================
echo.

echo 1. 检查Git是否安装...
git --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Git，请先安装Git
    echo 下载地址: https://git-scm.com/download/win
    echo.
    echo 安装完成后重新运行此脚本
    pause
    exit /b 1
)
echo ✓ Git已安装

echo.
echo 2. 检查Git配置...
git config --global user.name >nul 2>&1
if errorlevel 1 (
    echo 警告: 未配置Git用户信息
    echo 请先运行以下命令配置：
    echo git config --global user.name "您的GitHub用户名"
    echo git config --global user.email "您的邮箱地址"
    echo.
    pause
    exit /b 1
)
echo ✓ Git配置已完成

echo.
echo 3. 初始化Git仓库...
if not exist .git (
    git init
    echo ✓ Git仓库初始化完成
) else (
    echo ✓ Git仓库已存在
)

echo.
echo 4. 添加文件到暂存区...
git add .
echo ✓ 文件已添加到暂存区

echo.
echo 5. 提交更改...
git commit -m "Initial commit: 微信公众号订单管理系统"
if errorlevel 1 (
    echo 警告: 提交失败，可能是没有更改或已提交
    echo 继续下一步...
)

echo.
echo 6. 检查远程仓库...
git remote -v >nul 2>&1
if errorlevel 1 (
    echo 需要配置远程仓库
    echo 请先创建GitHub仓库，然后运行：
    echo git remote add origin https://github.com/您的用户名/wechat-order-system.git
    echo.
    echo 创建GitHub仓库步骤：
    echo 1. 访问 https://github.com/
    echo 2. 点击右上角"+"号，选择"New repository"
    echo 3. 仓库名填写: wechat-order-system
    echo 4. 不要勾选任何选项，直接点击"Create repository"
    echo.
    pause
    exit /b 1
)
echo ✓ 远程仓库已配置

echo.
echo 7. 设置默认分支...
git branch -M main
echo ✓ 默认分支设置为main

echo.
echo 8. 推送到GitHub...
echo 注意: 如果提示输入用户名和密码：
echo - 用户名: 您的GitHub用户名
echo - 密码: 使用Personal Access Token（不是GitHub密码）
echo.
echo 如果还没有Personal Access Token，请：
echo 1. 访问 https://github.com/settings/tokens
echo 2. 点击"Generate new token (classic)"
echo 3. 勾选"repo"权限
echo 4. 生成并复制Token
echo.
git push -u origin main

echo.
echo ===================
echo 推送完成！
echo.
echo 下一步操作：
echo 1. 访问您的GitHub仓库确认文件已上传
echo 2. 通过Vercel控制台部署项目
echo 3. 配置微信公众号服务器地址
echo.
echo 详细步骤请查看: docs\github-push-guide.md
echo.
pause 