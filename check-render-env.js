const axios = require('axios');
require('dotenv').config();

// 检查Render环境变量配置
async function checkRenderEnvironment() {
  console.log('========================================');
  console.log('   检查Render环境变量配置');
  console.log('========================================\n');

  console.log('🔍 本地环境变量：');
  console.log(`WECHAT_APP_ID: ${process.env.WECHAT_APP_ID || '❌ 未配置'}`);
  console.log(`WECHAT_APP_SECRET: ${process.env.WECHAT_APP_SECRET ? '✅ 已配置' : '❌ 未配置'}`);
  console.log(`WECHAT_TOKEN: ${process.env.WECHAT_TOKEN || '❌ 未配置'}`);
  console.log(`WECHAT_ENCODING_AES_KEY: ${process.env.WECHAT_ENCODING_AES_KEY || '❌ 未配置'}`);
  console.log('');

  // 测试Render应用的健康检查
  try {
    console.log('🔄 测试Render应用健康状态...');
    const healthResponse = await axios.get('https://wechat-order-management.onrender.com/health', {
      timeout: 10000
    });
    console.log('✅ 应用健康检查通过');
    console.log(`状态码: ${healthResponse.status}`);
  } catch (error) {
    console.log('❌ 应用健康检查失败');
    if (error.response) {
      console.log(`状态码: ${error.response.status}`);
    }
  }

  console.log('');
  console.log('💡 可能的问题和解决方案：');
  console.log('');
  console.log('1. Render环境变量未正确配置');
  console.log('   - 登录Render控制台');
  console.log('   - 检查环境变量设置');
  console.log('   - 确保WECHAT_TOKEN等变量已配置');
  console.log('');
  console.log('2. 应用需要重新部署');
  console.log('   - 在Render上触发重新部署');
  console.log('   - 等待部署完成');
  console.log('');
  console.log('3. 网络连接问题');
  console.log('   - 检查Render应用是否正常运行');
  console.log('   - 确认域名解析正常');
  console.log('');
}

// 生成Render环境变量配置
function generateRenderEnvConfig() {
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
  console.log('WECHAT_TOKEN=wechatordersystem2025tokenabc123');
  console.log('WECHAT_ENCODING_AES_KEY=Zb4ujeI6LHcNl8IJDPzwcMDADeT1IU6T4g9NofdPpo6');
  console.log('========================================');
  console.log('');
}

// 主函数
async function main() {
  const action = process.argv[2];
  
  switch (action) {
    case 'check':
      await checkRenderEnvironment();
      break;
    case 'config':
      generateRenderEnvConfig();
      break;
    default:
      console.log('使用方法：');
      console.log('  node check-render-env.js check   - 检查Render环境');
      console.log('  node check-render-env.js config - 生成环境变量配置');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkRenderEnvironment, generateRenderEnvConfig }; 