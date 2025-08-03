const axios = require('axios');
require('dotenv').config();

// 测试Access Token获取
async function testAccessToken() {
  console.log('🔍 测试微信Access Token获取...\n');
  
  const appId = process.env.WECHAT_APP_ID;
  const appSecret = process.env.WECHAT_APP_SECRET;
  
  if (!appId || !appSecret) {
    console.log('❌ 环境变量未配置');
    console.log('请在.env文件中配置以下变量：');
    console.log('WECHAT_APP_ID=你的微信公众号AppID');
    console.log('WECHAT_APP_SECRET=你的微信公众号AppSecret');
    return;
  }
  
  console.log('📋 配置信息：');
  console.log(`AppID: ${appId}`);
  console.log(`AppSecret: ${appSecret.substring(0, 8)}...`);
  console.log('');
  
  try {
    console.log('🔄 正在获取Access Token...');
    
    const response = await axios.get(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
    );
    
    if (response.data.access_token) {
      console.log('✅ Access Token获取成功！');
      console.log(`Token: ${response.data.access_token.substring(0, 20)}...`);
      console.log(`有效期: ${response.data.expires_in}秒 (约${Math.floor(response.data.expires_in/3600)}小时)`);
      
      // 测试Token有效性
      console.log('\n🔄 测试Token有效性...');
      const testResponse = await axios.get(
        `https://api.weixin.qq.com/cgi-bin/getcallbackip?access_token=${response.data.access_token}`
      );
      
      if (testResponse.data.ip_list) {
        console.log('✅ Token验证成功！');
        console.log('微信服务器IP列表：', testResponse.data.ip_list.slice(0, 3).join(', '));
      } else {
        console.log('⚠️ Token验证失败：', testResponse.data);
      }
      
    } else {
      console.log('❌ Access Token获取失败：', response.data);
    }
    
  } catch (error) {
    console.log('❌ 请求失败：', error.message);
    
    if (error.response) {
      console.log('错误详情：', error.response.data);
    }
  }
}

// 测试用户信息获取
async function testUserInfo() {
  console.log('\n🔍 测试用户信息获取...\n');
  
  const appId = process.env.WECHAT_APP_ID;
  const appSecret = process.env.WECHAT_APP_SECRET;
  
  try {
    // 先获取Access Token
    const tokenResponse = await axios.get(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
    );
    
    if (!tokenResponse.data.access_token) {
      console.log('❌ 无法获取Access Token');
      return;
    }
    
    const accessToken = tokenResponse.data.access_token;
    
    // 注意：这里需要一个真实的openid来测试
    // 在实际使用中，openid来自用户关注公众号或发送消息时
    console.log('⚠️ 用户信息获取需要真实的openid');
    console.log('Access Token已获取，可以用于其他API调用');
    
  } catch (error) {
    console.log('❌ 测试失败：', error.message);
  }
}

// 主函数
async function main() {
  console.log('========================================');
  console.log('   微信Access Token测试工具');
  console.log('========================================\n');
  
  await testAccessToken();
  await testUserInfo();
  
  console.log('\n========================================');
  console.log('测试完成！');
  console.log('========================================');
}

// 运行测试
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testAccessToken, testUserInfo }; 