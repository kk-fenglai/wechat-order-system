const cloud = require('wx-server-sdk');
const crypto = require('crypto');
const xml2js = require('xml2js');

// 初始化云开发
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 获取数据库引用
const db = cloud.database();

// 微信公众号配置
const WECHAT_TOKEN = 'wechat_order_system_2024_token_abc123';
const WECHAT_APP_ID = 'your_wechat_app_id';
const WECHAT_APP_SECRET = 'your_wechat_app_secret';

// 生成订单号
function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORDER${year}${month}${day}${random}`;
}

// 验证微信签名
function verifySignature(signature, timestamp, nonce, token) {
  const arr = [token, timestamp, nonce].sort();
  const str = arr.join('');
  const sha1 = crypto.createHash('sha1');
  sha1.update(str);
  return sha1.digest('hex') === signature;
}

// 解析XML消息
async function parseXML(xmlData) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xmlData, { explicitArray: false }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.xml);
      }
    });
  });
}

// 生成XML回复
function generateXMLReply(toUser, fromUser, createTime, msgType, content) {
  return `<xml>
    <ToUserName><![CDATA[${toUser}]]></ToUserName>
    <FromUserName><![CDATA[${fromUser}]]></FromUserName>
    <CreateTime>${createTime}</CreateTime>
    <MsgType><![CDATA[${msgType}]]></MsgType>
    <Content><![CDATA[${content}]]></Content>
  </xml>`;
}

// 处理文本消息
async function handleTextMessage(fromUserName, content) {
  const keywords = {
    '订单': '您可以通过以下方式查询订单：\n1. 发送"订单 订单号"查询具体订单\n2. 发送"我的订单"查看所有订单',
    '费用': '运费计算规则：\n- 基础运费：5欧元\n- 每公斤：2欧元\n- 最大重量：30公斤\n- 取件费用：自取10欧元，配送15欧元',
    '地址': '仓库地址：\n🇨🇳 中国仓库：\n广东省深圳市宝安区...\n🇫🇷 法国仓库：\nKomé Café-Atelier Lyon 1',
    '取件': '取件方式：\n1. 自取：到Komé Café-Atelier Lyon 1自取（10欧元）\n2. 配送：寄到指定地址（15欧元，适合大量包裹）',
    '帮助': '欢迎使用中法集运服务！\n\n可用指令：\n- 订单：查询订单状态\n- 费用：查看运费说明\n- 地址：获取仓库地址\n- 取件：了解取件方式\n- 客服：联系客服\n\n如需创建订单，请访问我们的网页系统。',
    '客服': '客服联系方式：\n📞 电话：+33 1-xx-xx-xx-xx\n📧 邮箱：service@yourdomain.com\n⏰ 工作时间：周一至周五 9:00-18:00'
  };

  for (const [keyword, reply] of Object.entries(keywords)) {
    if (content.includes(keyword)) {
      return reply;
    }
  }

  return '感谢您的咨询！如需帮助，请发送"帮助"查看可用指令。';
}

// 处理订阅事件
function handleSubscribe() {
  return `欢迎关注中法集运服务！🚢

我们提供从中国到法国的集运服务，让您的购物更加便捷。

📋 服务流程：
1️⃣ 填写申报信息
2️⃣ 寄送货物到仓库
3️⃣ 我们重新打包并计算费用
4️⃣ 支付后安排运输
5️⃣ 到法国后取件

💡 发送"帮助"查看详细使用说明
📞 发送"客服"联系我们的客服团队

感谢您的关注！`;
}

// 处理取消订阅事件
function handleUnsubscribe() {
  // 可以在这里记录用户取消订阅的日志
  console.log('用户取消订阅');
  return '';
}

// 主函数
exports.main = async (event, context) => {
  const { httpMethod, queryStringParameters, body } = event;

  try {
    // GET请求 - 服务器验证
    if (httpMethod === 'GET') {
      const { signature, timestamp, nonce, echostr } = queryStringParameters || {};
      
      if (verifySignature(signature, timestamp, nonce, WECHAT_TOKEN)) {
        return {
          statusCode: 200,
          body: echostr
        };
      } else {
        return {
          statusCode: 403,
          body: '签名验证失败'
        };
      }
    }

    // POST请求 - 处理消息
    if (httpMethod === 'POST') {
      const xmlData = body;
      const message = await parseXML(xmlData);
      
      const toUser = message.ToUserName;
      const fromUser = message.FromUserName;
      const createTime = Math.floor(Date.now() / 1000);
      const msgType = message.MsgType;

      let replyContent = '';

      // 处理不同类型的消息
      switch (msgType) {
        case 'text':
          replyContent = await handleTextMessage(fromUser, message.Content);
          break;
        case 'event':
          switch (message.Event) {
            case 'subscribe':
              replyContent = handleSubscribe();
              break;
            case 'unsubscribe':
              replyContent = handleUnsubscribe();
              break;
            default:
              replyContent = '收到事件消息';
          }
          break;
        default:
          replyContent = '暂不支持此类型消息';
      }

      const replyXML = generateXMLReply(fromUser, toUser, createTime, 'text', replyContent);

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8'
        },
        body: replyXML
      };
    }

    return {
      statusCode: 405,
      body: '方法不允许'
    };

  } catch (error) {
    console.error('云函数执行错误:', error);
    return {
      statusCode: 500,
      body: '服务器内部错误'
    };
  }
}; 