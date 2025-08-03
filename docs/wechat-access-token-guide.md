# 微信Access Token获取指南

## 概述
Access Token是微信公众号调用接口的重要凭证，有效期为2小时。本文档介绍如何获取和管理Access Token。

## 获取方法

### 1. 通过微信公众平台获取AppID和AppSecret

#### 步骤：
1. **登录微信公众平台**
   - 访问：https://mp.weixin.qq.com
   - 使用你的微信公众号账户登录

2. **进入基本配置**
   - 左侧菜单：开发 → 基本配置
   - 找到"开发者ID"部分

3. **获取配置信息**
   - **AppID（开发者ID）**：复制这个ID
   - **AppSecret（开发者密码）**：点击"重置"按钮获取新的Secret

### 2. 通过API获取Access Token

#### API接口
```
GET https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
```

#### 参数说明
- `grant_type`：固定值 `client_credential`
- `appid`：你的微信公众号AppID
- `secret`：你的微信公众号AppSecret

#### 返回结果
```json
{
  "access_token": "ACCESS_TOKEN",
  "expires_in": 7200
}
```

## 项目中的实现

### 当前代码实现
项目中的`WechatController.js`已经实现了Access Token获取：

```javascript
static async getAccessToken() {
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
```

### 改进建议
当前的实现每次都会请求新的Access Token，建议添加缓存机制：

```javascript
static async getAccessToken() {
  // 检查缓存中是否有有效的token
  if (this.cachedToken && this.tokenExpireTime > Date.now()) {
    return this.cachedToken;
  }
  
  try {
    const response = await axios.get(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.wechat.appId}&secret=${config.wechat.appSecret}`
    );
    
    // 缓存token，设置过期时间为1.5小时（比2小时短一些）
    this.cachedToken = response.data.access_token;
    this.tokenExpireTime = Date.now() + (response.data.expires_in - 1800) * 1000;
    
    return this.cachedToken;
  } catch (error) {
    console.error('获取访问令牌错误:', error);
    throw error;
  }
}
```

## 使用Access Token

### 1. 获取用户信息
```javascript
const userInfo = await axios.get(
  `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${accessToken}&openid=${openId}&lang=zh_CN`
);
```

### 2. 发送客服消息
```javascript
const response = await axios.post(
  `https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${accessToken}`,
  {
    touser: openId,
    msgtype: 'text',
    text: { content: '消息内容' }
  }
);
```

### 3. 创建自定义菜单
```javascript
const response = await axios.post(
  `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${accessToken}`,
  {
    button: [
      {
        type: 'click',
        name: '创建订单',
        key: 'create_order'
      }
    ]
  }
);
```

## 环境变量配置

### Render部署时的配置
在Render中设置以下环境变量：

```
WECHAT_APP_ID=你的真实AppID
WECHAT_APP_SECRET=你的真实AppSecret
```

### 获取真实配置的步骤
1. 登录微信公众平台
2. 进入：开发 → 基本配置
3. 复制AppID和AppSecret
4. 在Render中更新环境变量

## 安全注意事项

### 1. AppSecret安全
- **不要**在代码中硬编码AppSecret
- **不要**将AppSecret提交到版本控制系统
- 使用环境变量存储AppSecret
- 定期更换AppSecret

### 2. Access Token安全
- Access Token有效期为2小时
- 实现缓存机制避免频繁请求
- 在Token过期前主动刷新

### 3. 错误处理
- 处理网络请求失败
- 处理Token过期情况
- 实现重试机制

## 测试Access Token

### 1. 使用curl测试
```bash
curl "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=YOUR_APPID&secret=YOUR_APPSECRET"
```

### 2. 使用Postman测试
- 方法：GET
- URL：`https://api.weixin.qq.com/cgi-bin/token`
- 参数：
  - `grant_type`: `client_credential`
  - `appid`: 你的AppID
  - `secret`: 你的AppSecret

### 3. 验证Token有效性
```bash
curl "https://api.weixin.qq.com/cgi-bin/getcallbackip?access_token=YOUR_ACCESS_TOKEN"
```

## 常见问题

### 问题1：AppSecret错误
- 检查AppSecret是否正确
- 确认AppSecret没有过期
- 重新生成AppSecret

### 问题2：Access Token获取失败
- 检查网络连接
- 确认AppID和AppSecret正确
- 查看微信API返回的错误信息

### 问题3：Token过期
- 实现Token缓存机制
- 在Token过期前主动刷新
- 处理Token过期异常

---

完成以上配置后，你的应用就能正常获取和使用微信Access Token了！ 