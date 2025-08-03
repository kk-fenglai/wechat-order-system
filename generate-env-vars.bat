@echo off
echo ========================================
echo    Render环境变量配置生成器
echo ========================================
echo.

echo 以下是Render部署时需要配置的环境变量：
echo.

echo ========================================
echo 必需的环境变量（必须配置）：
echo ========================================
echo MONGODB_URI=mongodb+srv://wechat_admin:wechat_admin@cluster0.fkxi3rn.mongodb.net/wechat_order_system?retryWrites=true^&w=majority^&appName=Cluster0
echo NODE_ENV=production
echo PORT=10000
echo HOST=0.0.0.0
echo JWT_SECRET=your_random_jwt_secret_here
echo.

echo ========================================
echo 微信公众号配置（必需）：
echo ========================================
echo WECHAT_APP_ID=你的微信公众号AppID
echo WECHAT_APP_SECRET=你的微信公众号AppSecret
echo WECHAT_TOKEN=你的微信公众号Token
echo WECHAT_ENCODING_AES_KEY=你的微信公众号EncodingAESKey
echo.

echo ========================================
echo 微信支付配置（可选）：
echo ========================================
echo WECHAT_MCH_ID=你的微信支付商户号
echo WECHAT_API_KEY=你的微信支付API密钥
echo WECHAT_CERT_PATH=证书文件路径
echo.

echo ========================================
echo 邮件配置（可选）：
echo ========================================
echo EMAIL_HOST=smtp.gmail.com
echo EMAIL_PORT=587
echo EMAIL_USER=你的邮箱地址
echo EMAIL_PASS=你的邮箱密码
echo.

echo ========================================
echo 部署步骤：
echo ========================================
echo 1. 访问 https://render.com
echo 2. 点击 "New +" → "Blueprint"
echo 3. 连接GitHub仓库：kk-fenglai/wechat-order-system
echo 4. 在环境变量配置页面，添加上述变量
echo 5. 点击 "Create Blueprint Instance"
echo.

echo 注意：
echo - 将 "你的..." 替换为实际值
echo - JWT_SECRET 建议使用随机字符串
echo - 微信公众号配置需要从微信公众平台获取
echo.

pause 