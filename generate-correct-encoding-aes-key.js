const crypto = require('crypto');

// 生成正确的43位EncodingAESKey
function generateCorrectEncodingAESKey() {
  console.log('🔧 生成正确的43位EncodingAESKey...\n');
  
  // 使用Base64编码的随机字节，然后截取43位
  const randomBytes = crypto.randomBytes(32);
  const base64String = randomBytes.toString('base64');
  
  // 确保只包含字母和数字，长度为43
  let encodingAESKey = base64String.replace(/[^A-Za-z0-9]/g, '');
  
  // 如果长度不够43，用随机字符补充
  while (encodingAESKey.length < 43) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    encodingAESKey += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // 截取前43位
  encodingAESKey = encodingAESKey.substring(0, 43);
  
  console.log('✅ 生成的EncodingAESKey：');
  console.log(encodingAESKey);
  console.log(`长度：${encodingAESKey.length}字符`);
  console.log(`格式验证：${/^[A-Za-z0-9]{43}$/.test(encodingAESKey) ? '✅ 正确' : '❌ 错误'}`);
  console.log('');
  
  return encodingAESKey;
}

// 更新.env文件
function updateEnvFile(encodingAESKey) {
  const fs = require('fs');
  
  console.log('📝 更新.env文件...');
  
  const envContent = `# 服务器配置
PORT=3000
HOST=localhost

# 微信公众号配置 - 修复后的配置
WECHAT_APP_ID=wxd5492d5bc0730a21
WECHAT_APP_SECRET=9c90e33c11a2c7dbfc8d74a0cb5a6487
WECHAT_TOKEN=wechatordersystem2025tokenabc123
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
}

// 显示微信公众平台配置
function showWechatConfig(encodingAESKey) {
  console.log('📋 微信公众平台配置参数：');
  console.log('========================================');
  console.log('服务器地址：https://your-app-name.onrender.com/api/wechat');
  console.log('Token：wechatordersystem2025tokenabc123');
  console.log(`EncodingAESKey：${encodingAESKey}`);
  console.log('消息加解密方式：明文模式');
  console.log('========================================');
  console.log('');
  console.log('💡 请将这些参数复制到微信公众平台的服务器配置中');
  console.log('');
}

// 主函数
function main() {
  console.log('========================================');
  console.log('   修复微信服务器配置参数');
  console.log('========================================\n');
  
  // 生成正确的EncodingAESKey
  const encodingAESKey = generateCorrectEncodingAESKey();
  
  // 更新.env文件
  updateEnvFile(encodingAESKey);
  
  // 显示微信公众平台配置
  showWechatConfig(encodingAESKey);
  
  console.log('🔧 修复完成！现在可以重新配置微信公众平台了。');
}

if (require.main === module) {
  main();
}

module.exports = { generateCorrectEncodingAESKey }; 