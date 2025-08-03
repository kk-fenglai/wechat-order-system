@echo off
echo ========================================
echo    微信公众号订单管理系统 - Render部署
echo ========================================
echo.

echo 正在检查Git状态...
git status

echo.
echo 请确保你已经：
echo 1. 注册了Render账户 (https://render.com)
echo 2. 将代码推送到GitHub/GitLab仓库
echo 3. 准备好所有环境变量
echo.

echo 部署步骤：
echo 1. 访问 https://render.com
echo 2. 点击 "New +" → "Blueprint"
echo 3. 连接你的Git仓库
echo 4. 配置环境变量
echo 5. 点击 "Create Blueprint Instance"
echo.

echo 必需的环境变量：
echo - MONGODB_URI: MongoDB连接字符串
echo - WECHAT_APP_ID: 微信公众号AppID
echo - WECHAT_APP_SECRET: 微信公众号AppSecret
echo - WECHAT_TOKEN: 微信公众号Token
echo - WECHAT_ENCODING_AES_KEY: 微信公众号EncodingAESKey
echo - JWT_SECRET: JWT密钥
echo.

echo 可选的环境变量：
echo - WECHAT_MCH_ID: 微信支付商户号
echo - WECHAT_API_KEY: 微信支付API密钥
echo - EMAIL_HOST: 邮件服务器地址
echo - EMAIL_PORT: 邮件服务器端口
echo - EMAIL_USER: 邮件用户名
echo - EMAIL_PASS: 邮件密码
echo.

echo 部署完成后，你的应用将在以下地址运行：
echo https://your-app-name.onrender.com
echo.

echo 详细部署指南请查看：docs/render-deploy-guide.md
echo.

pause 