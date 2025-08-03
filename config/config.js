require('dotenv').config();

module.exports = {
  // 服务器配置
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost'
  },

  // 微信公众号配置
  wechat: {
    appId: process.env.WECHAT_APP_ID,
    appSecret: process.env.WECHAT_APP_SECRET,
    token: process.env.WECHAT_TOKEN,
    encodingAESKey: process.env.WECHAT_ENCODING_AES_KEY
  },

  // 数据库配置
  database: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/wechat_order_system',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },

  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '7d'
  },

  // 业务配置
  business: {
    // 仓库地址
    warehouseAddress: {
      china: {
        name: '中国仓库',
        address: '广东省深圳市宝安区...',
        contact: '+86 138-xxxx-xxxx'
      },
      france: {
        name: '法国仓库',
        address: 'Komé Café-Atelier Lyon 1',
        contact: '+33 1-xx-xx-xx-xx'
      }
    },

    // 取件方式
    pickupOptions: {
      delivery: {
        name: '寄到指定地址',
        description: '适合有大量包裹的顾客',
        price: 15 // 欧元
      },
      selfPickup: {
        name: '自取',
        description: '到Komé Café-Atelier Lyon 1自取',
        price: 10 // 欧元
      }
    },

    // 运费计算规则
    shippingRates: {
      basePrice: 5, // 基础运费（欧元）
      perKg: 2,     // 每公斤运费（欧元）
      maxWeight: 30 // 最大重量限制（公斤）
    }
  },

  // 支付配置
  payment: {
    wechatPay: {
      mchId: process.env.WECHAT_MCH_ID,
      apiKey: process.env.WECHAT_API_KEY,
      certPath: process.env.WECHAT_CERT_PATH
    }
  },

  // 邮件配置
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
}; 