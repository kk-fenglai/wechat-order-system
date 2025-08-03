# 微信公众平台服务器配置指南

## 概述
本指南将帮助你在微信公众平台配置服务器URL，使微信公众号能够与你的应用进行交互。

## 配置步骤

### 第一步：获取应用URL

#### 方法一：Render部署后获取
1. 完成Render部署
2. 获得应用URL：`https://your-app-name.onrender.com`
3. 微信服务器地址：`https://your-app-name.onrender.com/api/wechat`

#### 方法二：使用临时URL（开发测试）
可以使用以下临时服务进行测试：
- ngrok：`https://your-ngrok-url.ngrok.io/api/wechat`
- localtunnel：`https://your-tunnel-url.loca.lt/api/wechat`

### 第二步：配置微信公众平台

1. **登录微信公众平台**
   - 访问：https://mp.weixin.qq.com
   - 使用你的微信公众号账户登录

2. **进入服务器配置**
   - 左侧菜单：开发 → 基本配置
   - 找到"服务器配置"部分

3. **填写配置信息**
   ```
   服务器地址(URL)：https://your-app-name.onrender.com/api/wechat
   Token：wechat_order_system_2024_token_abc123
   消息加解密密钥(EncodingAESKey)：生成43位随机字符串
   消息加解密方式：安全模式（推荐）
   ```

### 第三步：生成配置信息

#### Token生成
可以使用项目中的默认Token：
```
wechat_order_system_2024_token_abc123
```

#### EncodingAESKey生成
生成43位随机字符串，例如：
```
abcdefghijklmnopqrstuvwxyz123456789012345678901
```

### 第四步：验证配置

1. **点击"提交"按钮**
2. **检查验证结果**
   - 如果显示"配置成功"，说明URL配置正确
   - 如果失败，检查URL和Token是否正确

### 第五步：更新环境变量

配置成功后，更新Render环境变量：

```
WECHAT_APP_ID=你的微信公众号AppID
WECHAT_APP_SECRET=你的微信公众号AppSecret
WECHAT_TOKEN=wechat_order_system_2024_token_abc123
WECHAT_ENCODING_AES_KEY=abcdefghijklmnopqrstuvwxyz123456789012345678901
```

## 部署流程

### 1. 初始部署（使用占位符）
```
WECHAT_APP_ID=temp_app_id
WECHAT_APP_SECRET=temp_app_secret
WECHAT_TOKEN=wechat_order_system_2024_token_abc123
WECHAT_ENCODING_AES_KEY=abcdefghijklmnopqrstuvwxyz123456789012345678901
```

### 2. 获取应用URL
部署完成后，获得URL：`https://your-app-name.onrender.com`

### 3. 配置微信公众平台
使用URL：`https://your-app-name.onrender.com/api/wechat`

### 4. 更新真实配置
用真实的微信配置更新Render环境变量

## 测试验证

### 健康检查
访问：`https://your-app-name.onrender.com/health`

### 微信接口测试
访问：`https://your-app-name.onrender.com/api/wechat`

### 微信公众号测试
1. 关注你的微信公众号
2. 发送消息测试回复功能

## 常见问题

### 问题1：URL验证失败
- 检查URL是否正确
- 确认应用已部署并运行
- 验证Token是否正确

### 问题2：消息无法接收
- 检查服务器配置是否正确
- 查看应用日志
- 确认微信接口正常工作

### 问题3：应用无法访问
- 检查Render服务状态
- 确认环境变量配置正确
- 查看构建日志

## 安全建议

1. **Token安全**
   - 使用强随机Token
   - 定期更换Token
   - 不要在代码中硬编码

2. **URL安全**
   - 使用HTTPS协议
   - 确保URL可公开访问
   - 避免使用内网地址

3. **密钥管理**
   - 使用环境变量存储敏感信息
   - 定期轮换密钥
   - 不要在版本控制中提交真实密钥

---

完成以上配置后，你的微信公众号就能与你的应用正常交互了！ 