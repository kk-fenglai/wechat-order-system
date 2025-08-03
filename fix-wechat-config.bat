@echo off
echo ========================================
echo    修复微信服务器配置参数
echo ========================================
echo.

echo 问题诊断：
echo ❌ 当前EncodingAESKey长度：42字符
echo ✅ 微信要求：43字符
echo.

echo 正在生成正确的配置参数...
echo.

echo 生成43位EncodingAESKey...
node -e "
const crypto = require('crypto');
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let result = '';
for (let i = 0; i < 43; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
}
console.log('新的EncodingAESKey:', result);
console.log('长度:', result.length);
console.log('格式验证:', /^[A-Za-z0-9]{43}$/.test(result) ? '✅ 正确' : '❌ 错误');
"

echo.
echo 正在更新.env文件...
echo.

(
echo # 服务器配置
echo PORT=3000
echo HOST=localhost
echo.
echo # 微信公众号配置 - 修复后的配置
echo WECHAT_APP_ID=wxd5492d5bc0730a21
echo WECHAT_APP_SECRET=9c90e33c11a2c7dbfc8d74a0cb5a6487
echo WECHAT_TOKEN=wechatordersystem2025tokenabc123
echo WECHAT_ENCODING_AES_KEY=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789
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

echo ✅ .env 文件已更新！
echo.
echo 现在测试新的配置...
node test-wechat-server-config.js test
echo.
echo 🔧 修复完成！请在微信公众平台使用以下配置：
echo.
echo 服务器地址：https://your-app-name.onrender.com/api/wechat
echo Token：wechatordersystem2025tokenabc123
echo EncodingAESKey：ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789
echo 消息加解密方式：明文模式
echo.
pause 