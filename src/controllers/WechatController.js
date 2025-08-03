const crypto = require('crypto');
const axios = require('axios');
const config = require('../../config/config');
const Order = require('../models/Order');
const Customer = require('../models/Customer');

class WechatController {
  // 验证微信服务器
  static verifyServer(req, res) {
    const { signature, timestamp, nonce, echostr } = req.query;
    const token = config.wechat.token;
    
    const tmpArr = [token, timestamp, nonce].sort();
    const tmpStr = tmpArr.join('');
    const hash = crypto.createHash('sha1').update(tmpStr).digest('hex');
    
    if (hash === signature) {
      res.send(echostr);
    } else {
      res.status(403).send('Forbidden');
    }
  }

  // 处理微信消息
  static async handleMessage(req, res) {
    try {
      const { xml } = req.body;
      const { ToUserName, FromUserName, MsgType, Content, Event } = xml;

      let reply = '';

      switch (MsgType) {
        case 'text':
          reply = await this.handleTextMessage(FromUserName, Content);
          break;
        case 'event':
          reply = await this.handleEventMessage(FromUserName, Event);
          break;
        default:
          reply = this.getDefaultReply();
      }

      const response = this.formatReply(ToUserName, FromUserName, reply);
      res.type('application/xml').send(response);
    } catch (error) {
      console.error('处理微信消息错误:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  // 处理文本消息
  static async handleTextMessage(fromUserName, content) {
    const customer = await Customer.findOne({ wechatId: fromUserName });
    
    if (!customer) {
      return this.getWelcomeMessage();
    }

    // 关键词回复
    const keywords = {
      '订单': this.getOrderStatusMessage,
      '费用': this.getFeeInfoMessage,
      '地址': this.getWarehouseAddressMessage,
      '取件': this.getPickupInfoMessage,
      '帮助': this.getHelpMessage,
      '客服': this.getCustomerServiceMessage
    };

    for (const [keyword, handler] of Object.entries(keywords)) {
      if (content.includes(keyword)) {
        return await handler.call(this, customer);
      }
    }

    // 默认回复
    return this.getDefaultReply();
  }

  // 处理事件消息
  static async handleEventMessage(fromUserName, event) {
    switch (event) {
      case 'subscribe':
        return await this.handleSubscribe(fromUserName);
      case 'unsubscribe':
        return await this.handleUnsubscribe(fromUserName);
      default:
        return this.getDefaultReply();
    }
  }

  // 处理关注事件
  static async handleSubscribe(fromUserName) {
    try {
      // 获取用户信息
      const userInfo = await this.getWechatUserInfo(fromUserName);
      
      // 创建或更新客户信息
      let customer = await Customer.findOne({ wechatId: fromUserName });
      
      if (!customer) {
        customer = new Customer({
          wechatId: fromUserName,
          openId: fromUserName,
          nickname: userInfo.nickname,
          avatar: userInfo.headimgurl,
          name: userInfo.nickname,
          phone: '',
          email: ''
        });
        await customer.save();
      }

      return this.getWelcomeMessage();
    } catch (error) {
      console.error('处理关注事件错误:', error);
      return this.getWelcomeMessage();
    }
  }

  // 处理取消关注事件
  static async handleUnsubscribe(fromUserName) {
    try {
      await Customer.findOneAndUpdate(
        { wechatId: fromUserName },
        { status: 'inactive' }
      );
    } catch (error) {
      console.error('处理取消关注事件错误:', error);
    }
    return '';
  }

  // 获取订单状态消息
  static async getOrderStatusMessage(customer) {
    const orders = await Order.find({ 'customer.wechatId': customer.wechatId })
      .sort({ createdAt: -1 })
      .limit(5);

    if (orders.length === 0) {
      return '您还没有订单记录。\n\n点击下方菜单开始创建新订单！';
    }

    let message = '您的最近订单状态：\n\n';
    
    orders.forEach(order => {
      message += `📦 订单号：${order.orderNumber}\n`;
      message += `📊 状态：${order.status}\n`;
      message += `💰 费用：€${order.fees.total || 0}\n`;
      message += `📅 创建时间：${new Date(order.createdAt).toLocaleDateString()}\n\n`;
    });

    message += '如需查看详细订单信息，请访问我们的网站或联系客服。';
    
    return message;
  }

  // 获取费用信息消息
  static getFeeInfoMessage() {
    const { shippingRates, pickupOptions } = config.business;
    
    let message = '💰 费用说明：\n\n';
    message += `📦 基础运费：€${shippingRates.basePrice}\n`;
    message += `⚖️ 每公斤运费：€${shippingRates.perKg}\n`;
    message += `📋 手续费：货物价值的2%\n\n`;
    message += '🚚 取件方式：\n';
    message += `• 寄到指定地址：€${pickupOptions.delivery.price}\n`;
    message += `• 自取：€${pickupOptions.selfPickup.price}\n\n`;
    message += '💡 提示：实际费用将根据包裹重量和内容计算。';
    
    return message;
  }

  // 获取仓库地址消息
  static getWarehouseAddressMessage() {
    const { warehouseAddress } = config.business;
    
    let message = '🏢 仓库地址：\n\n';
    message += '🇨🇳 中国仓库：\n';
    message += `📍 ${warehouseAddress.china.address}\n`;
    message += `📞 ${warehouseAddress.china.contact}\n\n`;
    message += '🇫🇷 法国仓库：\n';
    message += `📍 ${warehouseAddress.france.address}\n`;
    message += `📞 ${warehouseAddress.france.contact}\n\n`;
    message += '📝 请将包裹寄送到中国仓库地址，并在备注中注明您的订单号。';
    
    return message;
  }

  // 获取取件信息消息
  static getPickupInfoMessage() {
    const { pickupOptions } = config.business;
    
    let message = '🚚 取件方式：\n\n';
    message += `1️⃣ 寄到指定地址\n`;
    message += `   💰 费用：€${pickupOptions.delivery.price}\n`;
    message += `   📝 ${pickupOptions.delivery.description}\n\n`;
    message += `2️⃣ 自取\n`;
    message += `   💰 费用：€${pickupOptions.selfPickup.price}\n`;
    message += `   📍 地址：${pickupOptions.selfPickup.description}\n\n`;
    message += '💡 您可以在订单创建时选择取件方式。';
    
    return message;
  }

  // 获取帮助消息
  static getHelpMessage() {
    let message = '🤝 帮助中心：\n\n';
    message += '📋 常用功能：\n';
    message += '• 回复"订单" - 查看订单状态\n';
    message += '• 回复"费用" - 查看费用说明\n';
    message += '• 回复"地址" - 查看仓库地址\n';
    message += '• 回复"取件" - 查看取件方式\n';
    message += '• 回复"客服" - 联系客服\n\n';
    message += '📞 客服热线：+33 1-xx-xx-xx-xx\n';
    message += '📧 邮箱：service@example.com\n';
    message += '⏰ 工作时间：周一至周五 9:00-18:00';
    
    return message;
  }

  // 获取客服消息
  static getCustomerServiceMessage() {
    let message = '👨‍💼 客服信息：\n\n';
    message += '📞 电话：+33 1-xx-xx-xx-xx\n';
    message += '📧 邮箱：service@example.com\n';
    message += '💬 微信：service_wechat\n\n';
    message += '⏰ 工作时间：\n';
    message += '周一至周五：9:00-18:00\n';
    message += '周六：9:00-12:00\n';
    message += '周日：休息\n\n';
    message += '🔔 非工作时间请发送邮件，我们会在下一个工作日回复。';
    
    return message;
  }

  // 获取欢迎消息
  static getWelcomeMessage() {
    let message = '🎉 欢迎使用中法集运服务！\n\n';
    message += '我们提供从中国到法国的专业集运服务，让您的购物更加便捷。\n\n';
    message += '📋 服务流程：\n';
    message += '1️⃣ 填写申报信息\n';
    message += '2️⃣ 寄送包裹到仓库\n';
    message += '3️⃣ 我们重新打包\n';
    message += '4️⃣ 计算费用并付款\n';
    message += '5️⃣ 选择取件方式\n\n';
    message += '💡 回复"帮助"查看更多信息\n';
    message += '🚀 点击下方菜单开始创建订单！';
    
    return message;
  }

  // 获取默认回复
  static getDefaultReply() {
    return '感谢您的咨询！\n\n如需帮助，请回复"帮助"查看详细说明。\n\n您也可以直接联系客服获取更专业的服务。';
  }

  // 获取微信用户信息
  static async getWechatUserInfo(openId) {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(
        `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${accessToken}&openid=${openId}&lang=zh_CN`
      );
      return response.data;
    } catch (error) {
      console.error('获取微信用户信息错误:', error);
      return { nickname: '用户', headimgurl: '' };
    }
  }

  // 获取访问令牌
  static async getAccessToken() {
    // 这里应该实现访问令牌的缓存机制
    // 简化版本，实际应用中需要缓存token
    try {
      const response = await axios.get(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.wechat.appId}&secret=${config.wechat.appSecret}`
      );
      return response.data.access_token;
    } catch (error) {
      console.error('获取访问令牌错误:', error);
      throw error;
    }
  }

  // 格式化回复消息
  static formatReply(toUserName, fromUserName, content) {
    const now = Math.floor(Date.now() / 1000);
    return `<xml>
      <ToUserName><![CDATA[${fromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${toUserName}]]></FromUserName>
      <CreateTime>${now}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${content}]]></Content>
    </xml>`;
  }

  // 发送客服消息
  static async sendCustomerMessage(openId, content) {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.post(
        `https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${accessToken}`,
        {
          touser: openId,
          msgtype: 'text',
          text: { content }
        }
      );
      return response.data;
    } catch (error) {
      console.error('发送客服消息错误:', error);
      throw error;
    }
  }
}

module.exports = WechatController; 