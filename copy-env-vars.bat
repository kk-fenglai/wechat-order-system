@echo off
echo ========================================
echo    Render环境变量快速复制
echo ========================================
echo.

echo 以下是你需要在Render中配置的环境变量：
echo.

echo ========================================
echo 必需的环境变量：
echo ========================================
echo MONGODB_URI=mongodb+srv://wechat_admin:wechat_admin@cluster0.fkxi3rn.mongodb.net/wechat_order_system?retryWrites=true^&w=majority^&appName=Cluster0
echo NODE_ENV=production
echo PORT=10000
echo HOST=0.0.0.0
echo JWT_SECRET=my_super_secret_jwt_key_2024
echo WECHAT_APP_ID=temp_app_id
echo WECHAT_APP_SECRET=temp_app_secret
echo WECHAT_TOKEN=wechat_order_system_2024_token_abc123
echo WECHAT_ENCODING_AES_KEY=abcdefghijklmnopqrstuvwxyz123456789012345678901
echo.

echo ========================================
echo 可选的环境变量：
echo ========================================
echo WECHAT_MCH_ID=your_wechat_mch_id
echo WECHAT_API_KEY=your_wechat_api_key
echo WECHAT_CERT_PATH=path/to/your/cert.pem
echo EMAIL_HOST=smtp.gmail.com
echo EMAIL_PORT=587
echo EMAIL_USER=your_email@gmail.com
echo EMAIL_PASS=your_email_password
echo.

echo ========================================
echo 使用说明：
echo ========================================
echo 1. 复制上述环境变量到Render配置页面
echo 2. 每个变量一行，格式：变量名=值
echo 3. 部署完成后，更新微信配置为真实值
echo.

echo 详细配置请查看：
echo - render-env-vars.txt （完整版本）
echo - render-essential-env-vars.txt （简化版本）
echo.

pause 