const crypto = require('crypto');
const axios = require('axios');
require('dotenv').config();

// 生成微信服务器验证签名
function generateWechatSignature(token, timestamp, nonce) {
  const tmpArr = [token, timestamp, nonce].sort();
  const tmpStr = tmpArr.join('');
  const hash = crypto.createHash('sha1').update(tmpStr).digest('hex');
  return hash;
}

// 测试微信服务器验证
async function testWechatVerification() {
  console.log('========================================');
  console.log('   微信服务器验证测试工具');
  console.log('========================================\n');

  const token = process.env.WECHAT_TOKEN;
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = Math.random().toString(36).substr(2, 15);
  const echostr = 'test_echostr_' + Date.now();

  console.log('📋 测试参数：');
  console.log(`Token: ${token}`);
  console.log(`Timestamp: ${timestamp}`);
  console.log(`Nonce: ${nonce}`);
  console.log(`Echostr: ${echostr}`);
  console.log('');

  // 生成正确的签名
  const signature = generateWechatSignature(token, timestamp, nonce);
  console.log('🔐 生成的签名：');
  console.log(signature);
  console.log('');

  // 构建测试URL
  const testUrl = `https://wechat-order-management.onrender.com/api/wechat?signature=${signature}&timestamp=${timestamp}&nonce=${nonce}&echostr=${echostr}`;
  
  console.log('🌐 测试URL：');
  console.log(testUrl);
  console.log('');

  try {
    console.log('🔄 正在测试微信服务器验证...');
    const response = await axios.get(testUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'WeChat/1.0'
      }
    });

    console.log('✅ 验证成功！');
    console.log(`状态码: ${response.status}`);
    console.log(`响应内容: ${response.data}`);
    
    if (response.data === echostr) {
      console.log('🎉 签名验证完全正确！');
    } else {
      console.log('⚠️ 响应内容与期望不符');
    }

  } catch (error) {
    console.log('❌ 验证失败：');
    if (error.response) {
      console.log(`状态码: ${error.response.status}`);
      console.log(`响应内容: ${error.response.data}`);
    } else {
      console.log(`错误信息: ${error.message}`);
    }
  }
}

// 生成微信公众平台配置URL
function generateWechatConfigUrl() {
  const token = process.env.WECHAT_TOKEN;
  const timestamp = Math.floor(Date.now() / 10000).toString(); // 使用固定时间戳便于测试
  const nonce = 'testnonce123';
  const echostr = 'test_echostr_123456';
  
  const signature = generateWechatSignature(token, timestamp, nonce);
  
  console.log('📋 微信公众平台配置测试URL：');
  console.log('========================================');
  console.log(`https://wechat-order-management.onrender.com/api/wechat?signature=${signature}&timestamp=${timestamp}&nonce=${nonce}&echostr=${echostr}`);
  console.log('========================================');
  console.log('');
  
  console.log('🔧 配置参数：');
  console.log('服务器地址：https://wechat-order-management.onrender.com/api/wechat');
  console.log(`Token：${token}`);
  console.log(`EncodingAESKey：${process.env.WECHAT_ENCODING_AES_KEY}`);
  console.log('消息加解密方式：明文模式');
  console.log('');
  
  console.log('💡 测试步骤：');
  console.log('1. 复制上面的测试URL到浏览器');
  console.log('2. 如果返回echostr值，说明验证成功');
  console.log('3. 然后在微信公众平台使用配置参数');
  console.log('');
}

// 检查环境变量
function checkEnvironmentVariables() {
  console.log('🔍 环境变量检查：');
  console.log(`WECHAT_APP_ID: ${process.env.WECHAT_APP_ID || '❌ 未配置'}`);
  console.log(`WECHAT_APP_SECRET: ${process.env.WECHAT_APP_SECRET ? '✅ 已配置' : '❌ 未配置'}`);
  console.log(`WECHAT_TOKEN: ${process.env.WECHAT_TOKEN || '❌ 未配置'}`);
  console.log(`WECHAT_ENCODING_AES_KEY: ${process.env.WECHAT_ENCODING_AES_KEY || '❌ 未配置'}`);
  console.log('');
  
  if (!process.env.WECHAT_TOKEN) {
    console.log('❌ Token未配置，无法进行验证测试');
    return false;
  }
  
  return true;
}

// 主函数
async function main() {
  const action = process.argv[2];
  
  switch (action) {
    case 'test':
      if (checkEnvironmentVariables()) {
        await testWechatVerification();
      }
      break;
    case 'config':
      if (checkEnvironmentVariables()) {
        generateWechatConfigUrl();
      }
      break;
    default:
      console.log('使用方法：');
      console.log('  node test-wechat-verification.js test   - 测试微信服务器验证');
      console.log('  node test-wechat-verification.js config - 生成配置测试URL');
      console.log('\n💡 建议先运行test命令检查验证是否正常');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { 
  generateWechatSignature, 
  testWechatVerification, 
  generateWechatConfigUrl 
}; 