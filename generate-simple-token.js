const crypto = require('crypto');
const fs = require('fs');

// 生成简单的Token和EncodingAESKey
function generateSimpleConfig() {
  console.log('🔧 生成简单的微信配置参数...\n');
  
  // 生成简单的Token（16位，只包含字母和数字）
  const simpleToken = crypto.randomBytes(8).toString('hex');
  
  // 生成43位EncodingAESKey
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let encodingAESKey = '';
  for (let i = 0; i < 43; i++) {
    encodingAESKey += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  console.log('✅ 生成的简单配置：');
  console.log(`Token: ${simpleToken}`);
  console.log(`Token长度: ${simpleToken.length}字符`);
  console.log(`EncodingAESKey: ${encodingAESKey}`);
  console.log(`EncodingAESKey长度: ${encodingAESKey.length}字符`);
  console.log('');
  
  // 更新.env文件
  const envContent = `# 服务器配置
PORT=3000
HOST=localhost

# 微信公众号配置 - 简单配置
WECHAT_APP_ID=wxd5492d5bc0730a21
WECHAT_APP_SECRET=9c90e33c11a2c7dbfc8d74a0cb5a6487
WECHAT_TOKEN=${simpleToken}
WECHAT_ENCODING_AES_KEY=${encodingAESKey}

# 数据库配置 - MongoDB Atlas
MONGODB_URI=mongodb+srv://wechat_admin:wechat_admin@cluster0.fkxi3rn.mongodb.net/wechat_order_system?retryWrites=true&w=majority&appName=Cluster0

# JWT配置
JWT_SECRET=my_super_secret_jwt_key_2024

# 微信支付配置（可选）
WECHAT_MCH_ID=your_wechat_mch_id
WECHAT_API_KEY=your_wechat_api_key
WECHAT_CERT_PATH=path/to/your/cert.pem

# 邮件配置（可选）
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
`;

  fs.writeFileSync('.env', envContent);
  console.log('✅ .env 文件已更新！');
  console.log('');
  
  console.log('📋 微信公众平台配置参数：');
  console.log('========================================');
  console.log('服务器地址：https://wechat-order-management.onrender.com/api/wechat');
  console.log(`Token：${simpleToken}`);
  console.log(`EncodingAESKey：${encodingAESKey}`);
  console.log('消息加解密方式：明文模式');
  console.log('========================================');
  console.log('');
  
  console.log('💡 使用步骤：');
  console.log('1. 在Render控制台更新环境变量');
  console.log('2. 重新部署应用');
  console.log('3. 在微信公众平台使用新的配置参数');
  console.log('');
  
  return { token: simpleToken, encodingAESKey };
}

// 生成Render环境变量配置
function generateRenderEnvVars(token, encodingAESKey) {
  console.log('📋 Render环境变量配置：');
  console.log('========================================');
  console.log('在Render控制台中配置以下环境变量：');
  console.log('');
  console.log('NODE_ENV=production');
  console.log('PORT=10000');
  console.log('HOST=0.0.0.0');
  console.log('MONGODB_URI=mongodb+srv://wechat_admin:wechat_admin@cluster0.fkxi3rn.mongodb.net/wechat_order_system?retryWrites=true&w=majority&appName=Cluster0');
  console.log('JWT_SECRET=my_super_secret_jwt_key_2024');
  console.log('WECHAT_APP_ID=wxd5492d5bc0730a21');
  console.log('WECHAT_APP_SECRET=9c90e33c11a2c7dbfc8d74a0cb5a6487');
  console.log(`WECHAT_TOKEN=${token}`);
  console.log(`WECHAT_ENCODING_AES_KEY=${encodingAESKey}`);
  console.log('========================================');
  console.log('');
}

// 主函数
function main() {
  console.log('========================================');
  console.log('   生成简单微信配置参数');
  console.log('========================================\n');
  
  const config = generateSimpleConfig();
  generateRenderEnvVars(config.token, config.encodingAESKey);
  
  console.log('🔧 配置完成！请按步骤操作。');
}

if (require.main === module) {
  main();
}

module.exports = { generateSimpleConfig }; 