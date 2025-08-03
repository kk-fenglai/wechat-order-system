const axios = require('axios');
require('dotenv').config();

async function getAccessToken() {
  try {
    const appId = process.env.WECHAT_APP_ID;
    const appSecret = process.env.WECHAT_APP_SECRET;
    
    const response = await axios.get(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
    );
    
    if (response.data.access_token) {
      return response.data.access_token;
    } else {
      throw new Error('获取Access Token失败：' + JSON.stringify(response.data));
    }
  } catch (error) {
    console.error('获取Access Token错误：', error.message);
    throw error;
  }
}

function generateKeywordReplyConfig() {
  return {
    // 关键词回复配置
    keywords: [
      {
        keyword: "订单",
        reply: `📦 订单管理功能

🔗 功能链接：
• 我的订单：https://your-app-name.onrender.com/orders
• 创建订单：https://your-app-name.onrender.com/create-order
• 订单查询：https://your-app-name.onrender.com/search-order

💡 使用说明：
发送以下关键词获取相应功能：
• 订单 - 订单管理
• 支付 - 支付服务
• 帮助 - 使用帮助`
      },
      {
        keyword: "支付",
        reply: `💰 支付服务功能

🔗 功能链接：
• 在线支付：https://your-app-name.onrender.com/payment
• 支付记录：https://your-app-name.onrender.com/payment-history

💳 支付方式：
• 微信支付
• 支付宝
• 银行卡

💡 使用说明：
发送以下关键词获取相应功能：
• 订单 - 订单管理
• 支付 - 支付服务
• 帮助 - 使用帮助`
      },
      {
        keyword: "帮助",
        reply: `ℹ️ 使用帮助

📱 主要功能：
• 📦 订单管理 - 查看、创建、查询订单
• 💰 支付服务 - 在线支付、支付记录
• 📞 客服支持 - 联系客服获取帮助

🔗 快速访问：
• 订单管理：https://your-app-name.onrender.com/orders
• 支付服务：https://your-app-name.onrender.com/payment
• 服务条款：https://your-app-name.onrender.com/terms

💡 关键词列表：
• 订单 - 订单管理功能
• 支付 - 支付服务功能
• 帮助 - 使用帮助说明

📞 如需更多帮助，请发送"客服"联系人工客服。`
      },
      {
        keyword: "客服",
        reply: `📞 客服支持

🕐 服务时间：周一至周日 9:00-18:00

📧 联系方式：
• 邮箱：support@your-company.com
• 微信：your-customer-service
• 电话：400-123-4567

💬 在线客服：
请访问：https://your-app-name.onrender.com/customer-service

⏰ 非工作时间：
请发送邮件或留言，我们会在下一个工作日回复您。

💡 常见问题：
发送"帮助"查看使用说明`
      },
      {
        keyword: "创建订单",
        reply: `➕ 创建订单

🔗 直接创建：https://your-app-name.onrender.com/create-order

📋 创建步骤：
1. 点击上方链接进入创建页面
2. 填写订单信息
3. 确认订单详情
4. 提交订单

📝 需要准备的信息：
• 收件人姓名和电话
• 收件地址
• 商品信息
• 特殊要求（如有）

💡 其他功能：
• 发送"订单"查看所有订单
• 发送"支付"进行在线支付
• 发送"帮助"获取使用说明`
      },
      {
        keyword: "我的订单",
        reply: `📋 我的订单

🔗 查看订单：https://your-app-name.onrender.com/orders

📊 订单状态说明：
• 🟡 待付款 - 订单已创建，等待支付
• 🟢 已付款 - 订单已支付，等待处理
• 🔵 处理中 - 订单正在处理
• 🟣 已发货 - 订单已发货
• ✅ 已完成 - 订单已完成
• ❌ 已取消 - 订单已取消

💡 操作说明：
• 点击链接查看详细订单
• 发送"创建订单"新建订单
• 发送"支付"进行在线支付
• 发送"客服"联系客服`
      }
    ]
  };
}

function displayKeywordConfig() {
  const config = generateKeywordReplyConfig();
  
  console.log('📋 关键词回复配置建议：\n');
  
  config.keywords.forEach((item, index) => {
    console.log(`${index + 1}. 关键词：${item.keyword}`);
    console.log(`   回复内容：`);
    console.log(`   ${item.reply.split('\n').join('\n   ')}`);
    console.log('');
  });
  
  console.log('🔧 配置步骤：');
  console.log('1. 登录微信公众平台：https://mp.weixin.qq.com');
  console.log('2. 进入：自动回复 → 关键词回复');
  console.log('3. 添加以上关键词规则');
  console.log('4. 将URL地址更新为你的实际应用地址');
  console.log('');
  console.log('⚠️ 注意：部署到Render后，需要更新所有URL地址！');
}

function generateConfigFile() {
  const config = generateKeywordReplyConfig();
  
  const configText = `# 微信关键词回复配置
# 复制以下内容到微信公众平台的关键词回复设置中

${config.keywords.map((item, index) => `
## ${index + 1}. 关键词：${item.keyword}

回复内容：
${item.reply}

---
`).join('')}

# 配置说明：
# 1. 登录微信公众平台
# 2. 进入：自动回复 → 关键词回复
# 3. 添加以上关键词规则
# 4. 将URL地址更新为实际应用地址
# 5. 保存并测试
`;

  return configText;
}

async function checkWechatPermissions() {
  try {
    console.log('🔍 检查微信公众号权限...\n');
    
    const accessToken = await getAccessToken();
    console.log('✅ Access Token获取成功');
    
    // 尝试获取自定义菜单（检查权限）
    try {
      const menuResponse = await axios.get(
        `https://api.weixin.qq.com/cgi-bin/menu/get?access_token=${accessToken}`
      );
      
      if (menuResponse.data.errcode === 48001) {
        console.log('❌ 自定义菜单权限不足');
        console.log('💡 建议：升级为服务号或使用关键词回复');
      } else {
        console.log('✅ 自定义菜单权限正常');
      }
    } catch (error) {
      console.log('❌ 自定义菜单API调用失败');
    }
    
    // 检查其他权限
    try {
      const userInfoResponse = await axios.get(
        `https://api.weixin.qq.com/cgi-bin/user/get?access_token=${accessToken}`
      );
      
      if (userInfoResponse.data.errcode === 48001) {
        console.log('❌ 用户管理权限不足');
      } else {
        console.log('✅ 用户管理权限正常');
      }
    } catch (error) {
      console.log('❌ 用户管理API调用失败');
    }
    
  } catch (error) {
    console.error('❌ 权限检查失败：', error.message);
  }
}

// 主函数
async function main() {
  const action = process.argv[2];
  
  console.log('========================================');
  console.log('   微信关键词回复配置工具');
  console.log('========================================\n');
  
  switch (action) {
    case 'check':
      await checkWechatPermissions();
      break;
    case 'display':
      displayKeywordConfig();
      break;
    case 'generate':
      const configText = generateConfigFile();
      console.log(configText);
      break;
    default:
      console.log('使用方法：');
      console.log('  node setup-keyword-reply.js check     - 检查微信权限');
      console.log('  node setup-keyword-reply.js display   - 显示关键词配置');
      console.log('  node setup-keyword-reply.js generate  - 生成配置文件');
      console.log('\n💡 由于自定义菜单权限不足，建议使用关键词回复作为替代方案');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { 
  generateKeywordReplyConfig, 
  displayKeywordConfig, 
  checkWechatPermissions 
}; 