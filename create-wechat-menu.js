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

async function createWechatMenu() {
  try {
    console.log('🔧 开始配置微信公众号自定义菜单...\n');
    
    const accessToken = await getAccessToken();
    console.log('✅ Access Token获取成功');
    
    // 自定义菜单配置
    const menuConfig = {
      button: [
        {
          name: "📦 订单管理",
          sub_button: [
            {
              type: "view",
              name: "📋 我的订单",
              url: "https://your-app-name.onrender.com/orders" // 部署后需要更新
            },
            {
              type: "view",
              name: "➕ 创建订单",
              url: "https://your-app-name.onrender.com/create-order" // 部署后需要更新
            },
            {
              type: "view",
              name: "🔍 订单查询",
              url: "https://your-app-name.onrender.com/search-order" // 部署后需要更新
            }
          ]
        },
        {
          name: "💰 支付服务",
          sub_button: [
            {
              type: "view",
              name: "💳 在线支付",
              url: "https://your-app-name.onrender.com/payment" // 部署后需要更新
            },
            {
              type: "view",
              name: "📊 支付记录",
              url: "https://your-app-name.onrender.com/payment-history" // 部署后需要更新
            }
          ]
        },
        {
          name: "ℹ️ 帮助中心",
          sub_button: [
            {
              type: "click",
              name: "📞 联系客服",
              key: "contact_service"
            },
            {
              type: "click",
              name: "❓ 使用说明",
              key: "help_guide"
            },
            {
              type: "view",
              name: "📖 服务条款",
              url: "https://your-app-name.onrender.com/terms" // 部署后需要更新
            }
          ]
        }
      ]
    };
    
    console.log('📋 菜单配置：');
    console.log(JSON.stringify(menuConfig, null, 2));
    console.log('\n🔄 正在创建自定义菜单...');
    
    const response = await axios.post(
      `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${accessToken}`,
      menuConfig
    );
    
    if (response.data.errcode === 0) {
      console.log('✅ 自定义菜单创建成功！');
      console.log('📱 用户现在可以在微信公众号中看到这些功能按钮了');
    } else {
      console.log('❌ 菜单创建失败：', response.data);
    }
    
  } catch (error) {
    console.error('❌ 配置菜单时出错：', error.message);
    if (error.response) {
      console.error('错误详情：', error.response.data);
    }
  }
}

async function deleteWechatMenu() {
  try {
    console.log('🗑️ 开始删除微信公众号自定义菜单...\n');
    
    const accessToken = await getAccessToken();
    console.log('✅ Access Token获取成功');
    
    const response = await axios.get(
      `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${accessToken}`
    );
    
    if (response.data.errcode === 0) {
      console.log('✅ 自定义菜单删除成功！');
    } else {
      console.log('❌ 菜单删除失败：', response.data);
    }
    
  } catch (error) {
    console.error('❌ 删除菜单时出错：', error.message);
  }
}

async function getWechatMenu() {
  try {
    console.log('📋 获取当前微信公众号菜单配置...\n');
    
    const accessToken = await getAccessToken();
    console.log('✅ Access Token获取成功');
    
    const response = await axios.get(
      `https://api.weixin.qq.com/cgi-bin/menu/get?access_token=${accessToken}`
    );
    
    if (response.data.menu) {
      console.log('✅ 当前菜单配置：');
      console.log(JSON.stringify(response.data.menu, null, 2));
    } else {
      console.log('❌ 获取菜单失败：', response.data);
    }
    
  } catch (error) {
    console.error('❌ 获取菜单时出错：', error.message);
  }
}

// 主函数
async function main() {
  const action = process.argv[2];
  
  console.log('========================================');
  console.log('   微信公众号自定义菜单配置工具');
  console.log('========================================\n');
  
  switch (action) {
    case 'create':
      await createWechatMenu();
      break;
    case 'delete':
      await deleteWechatMenu();
      break;
    case 'get':
      await getWechatMenu();
      break;
    default:
      console.log('使用方法：');
      console.log('  node create-wechat-menu.js create  - 创建自定义菜单');
      console.log('  node create-wechat-menu.js delete  - 删除自定义菜单');
      console.log('  node create-wechat-menu.js get     - 获取当前菜单配置');
      console.log('\n注意：部署到Render后，需要更新菜单中的URL地址');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createWechatMenu, deleteWechatMenu, getWechatMenu }; 