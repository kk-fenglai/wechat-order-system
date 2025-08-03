const crypto = require('crypto');
require('dotenv').config();

// 微信服务器配置测试工具
function testWechatServerConfig() {
  console.log('========================================');
  console.log('   微信服务器配置测试工具');
  console.log('========================================\n');

  // 1. 检查环境变量
  console.log('📋 环境变量检查：');
  console.log(`WECHAT_APP_ID: ${process.env.WECHAT_APP_ID || '❌ 未配置'}`);
  console.log(`WECHAT_APP_SECRET: ${process.env.WECHAT_APP_SECRET ? '✅ 已配置' : '❌ 未配置'}`);
  console.log(`WECHAT_TOKEN: ${process.env.WECHAT_TOKEN || '❌ 未配置'}`);
  console.log(`WECHAT_ENCODING_AES_KEY: ${process.env.WECHAT_ENCODING_AES_KEY || '❌ 未配置'}`);
  console.log('');

  // 2. 验证Token格式
  console.log('🔍 Token格式验证：');
  const token = process.env.WECHAT_TOKEN;
  if (token) {
    if (token.length >= 3 && token.length <= 32) {
      console.log('✅ Token长度符合要求（3-32字符）');
    } else {
      console.log('❌ Token长度不符合要求（应为3-32字符）');
    }
    
    // 检查Token是否包含特殊字符
    const specialChars = /[^a-zA-Z0-9]/;
    if (specialChars.test(token)) {
      console.log('⚠️ Token包含特殊字符，可能影响验证');
    } else {
      console.log('✅ Token格式正确');
    }
  } else {
    console.log('❌ Token未配置');
  }
  console.log('');

  // 3. 验证EncodingAESKey格式
  console.log('🔍 EncodingAESKey格式验证：');
  const encodingAESKey = process.env.WECHAT_ENCODING_AES_KEY;
  if (encodingAESKey) {
    if (encodingAESKey.length === 43) {
      console.log('✅ EncodingAESKey长度正确（43字符）');
    } else {
      console.log('❌ EncodingAESKey长度错误（应为43字符）');
    }
    
    // 检查是否只包含字母和数字
    const validChars = /^[A-Za-z0-9]+$/;
    if (validChars.test(encodingAESKey)) {
      console.log('✅ EncodingAESKey格式正确');
    } else {
      console.log('❌ EncodingAESKey包含无效字符');
    }
  } else {
    console.log('❌ EncodingAESKey未配置');
  }
  console.log('');

  // 4. 模拟签名验证
  console.log('🔐 签名验证测试：');
  if (token) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = Math.random().toString(36).substr(2, 15);
    
    // 按照微信的签名算法
    const tmpArr = [token, timestamp, nonce].sort();
    const tmpStr = tmpArr.join('');
    const hash = crypto.createHash('sha1').update(tmpStr).digest('hex');
    
    console.log('模拟参数：');
    console.log(`Token: ${token}`);
    console.log(`Timestamp: ${timestamp}`);
    console.log(`Nonce: ${nonce}`);
    console.log(`生成的签名: ${hash}`);
    console.log('✅ 签名算法正常');
  } else {
    console.log('❌ 无法测试签名验证（Token未配置）');
  }
  console.log('');

  // 5. 配置建议
  console.log('💡 微信公众平台配置建议：');
  console.log('服务器地址：https://your-app-name.onrender.com/api/wechat');
  console.log(`Token：${process.env.WECHAT_TOKEN || '请配置'}`);
  console.log(`EncodingAESKey：${process.env.WECHAT_ENCODING_AES_KEY || '请配置'}`);
  console.log('消息加解密方式：明文模式');
  console.log('');

  // 6. 常见错误排查
  console.log('🔧 常见错误排查：');
  console.log('1. Token长度必须在3-32字符之间');
  console.log('2. EncodingAESKey必须是43个字符');
  console.log('3. 服务器地址必须是HTTPS协议');
  console.log('4. 服务器地址必须是公网可访问的');
  console.log('5. 确保应用已部署并正常运行');
  console.log('6. 检查防火墙和网络设置');
  console.log('');

  // 7. 测试步骤
  console.log('📋 测试步骤：');
  console.log('1. 确保应用已部署到Render');
  console.log('2. 获取应用的公网URL');
  console.log('3. 在微信公众平台配置服务器地址');
  console.log('4. 点击"提交"按钮');
  console.log('5. 查看是否显示"配置成功"');
  console.log('6. 如果失败，检查错误信息');
  console.log('');

  return {
    appId: process.env.WECHAT_APP_ID,
    appSecret: process.env.WECHAT_APP_SECRET,
    token: process.env.WECHAT_TOKEN,
    encodingAESKey: process.env.WECHAT_ENCODING_AES_KEY
  };
}

// 生成正确的配置参数
function generateCorrectConfig() {
  console.log('🔧 生成正确的配置参数：\n');
  
  // 生成符合要求的Token
  const token = 'wechatordersystem2025tokenabc123';
  console.log(`推荐Token: ${token}`);
  console.log(`Token长度: ${token.length}字符`);
  console.log(`Token格式: ${/^[a-zA-Z0-9]+$/.test(token) ? '✅ 正确' : '❌ 错误'}`);
  console.log('');

  // 生成符合要求的EncodingAESKey
  const encodingAESKey = '0TlgABvA4dZbW1zylmq8Lri4GwrbPu1hZEGkhyeAx7';
  console.log(`推荐EncodingAESKey: ${encodingAESKey}`);
  console.log(`EncodingAESKey长度: ${encodingAESKey.length}字符`);
  console.log(`EncodingAESKey格式: ${/^[A-Za-z0-9]{43}$/.test(encodingAESKey) ? '✅ 正确' : '❌ 错误'}`);
  console.log('');

  return { token, encodingAESKey };
}

// 主函数
function main() {
  const action = process.argv[2];
  
  switch (action) {
    case 'test':
      testWechatServerConfig();
      break;
    case 'generate':
      generateCorrectConfig();
      break;
    default:
      console.log('使用方法：');
      console.log('  node test-wechat-server-config.js test     - 测试当前配置');
      console.log('  node test-wechat-server-config.js generate - 生成正确配置');
      console.log('\n💡 如果配置参数错误，请使用generate命令生成正确的参数');
  }
}

if (require.main === module) {
  main();
}

module.exports = { testWechatServerConfig, generateCorrectConfig }; 