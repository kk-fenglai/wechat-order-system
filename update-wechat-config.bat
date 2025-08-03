@echo off
echo ========================================
echo    更新微信配置信息
echo ========================================
echo.

echo 正在更新 .env 文件...
echo.

(
echo # 服务器配置
echo PORT=3000
echo HOST=localhost
echo.
echo # 微信公众号配置 - 真实配置
echo WECHAT_APP_ID=wxd5492d5bc0730a21
echo WECHAT_APP_SECRET=9c90e33c11a2c7dbfc8d74a0cb5a6487
echo WECHAT_TOKEN=wechatordersystem2025tokenabc123
echo WECHAT_ENCODING_AES_KEY=0TlgABvA4dZbW1zylmq8Lri4GwrbPu1hZEGkhyeAx7
echo.
echo # 数据库配置 - MongoDB Atlas
echo MONGODB_URI=mongodb+srv://wechat_admin:wechat_admin@cluster0.fkxi3rn.mongodb.net/wechat_order_system?retryWrites=true^&w=majority^&appName=Cluster0
echo.
echo # JWT配置
echo JWT_SECRET=my_super_secret_jwt_key_2024
echo.
echo # 微信支付配置（可选）
echo WECHAT_MCH_ID=your_wechat_mch_id
echo WECHAT_API_KEY=your_wechat_api_key
echo WECHAT_CERT_PATH=path/to/your/cert.pem
echo.
echo # 邮件配置（可选）
echo EMAIL_HOST=smtp.gmail.com
echo EMAIL_PORT=587
echo EMAIL_USER=your_email@gmail.com
echo EMAIL_PASS=your_email_password
) > .env

echo ✅ .env 文件更新成功！
echo.
echo 现在测试微信Access Token获取...
node test-access-token.js

pause 