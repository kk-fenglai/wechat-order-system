# 微信公众号部署指南（简化版）

## 概述

由于微信公众号平台不直接支持云开发，我们使用第三方云服务来部署您的订单管理系统。

## 推荐方案：Vercel部署

### 第一步：准备代码

1. **确保项目结构完整**
   ```
   微信公众号/
   ├── server.js          # 主服务器文件
   ├── package.json       # 项目配置
   ├── vercel.json        # Vercel配置
   ├── public/            # 静态文件
   └── src/               # 源代码
   ```

2. **检查依赖**
   ```bash
   npm install
   ```

### 第二步：注册Vercel账号

1. **访问Vercel**
   - 网址：https://vercel.com/
   - 使用GitHub账号注册

2. **安装Vercel CLI**
   ```bash
   npm install -g vercel
   ```

### 第三步：部署到Vercel

1. **登录Vercel**
   ```bash
   vercel login
   ```

2. **部署项目**
   ```bash
   vercel
   ```

3. **配置环境变量**
   在Vercel控制台中设置以下环境变量：
   ```
   WECHAT_TOKEN=wechat_order_system_2024_token_abc123
   WECHAT_APP_ID=your_wechat_app_id
   WECHAT_APP_SECRET=your_wechat_app_secret
   MONGODB_URI=your_mongodb_connection_string
   ```

### 第四步：获取部署URL

部署成功后，您会得到一个类似这样的URL：
```
https://your-project-name.vercel.app
```

### 第五步：配置微信公众号

1. **登录微信公众平台**
   - 访问：https://mp.weixin.qq.com/

2. **进入开发配置**
   - 点击"开发" → "基本配置"

3. **配置服务器地址**
   - **URL**: `https://your-project-name.vercel.app/api/wechat`
   - **Token**: `wechat_order_system_2024_token_abc123`
   - **EncodingAESKey**: 点击"随机生成"
   - **消息加解密方式**: 安全模式

4. **验证配置**
   - 点击"提交"
   - 如果成功，会显示"配置成功"

## 替代方案：Railway部署

### 第一步：注册Railway

1. **访问Railway**
   - 网址：https://railway.app/
   - 使用GitHub账号注册

### 第二步：部署项目

1. **连接GitHub仓库**
   - 将项目推送到GitHub
   - 在Railway中导入GitHub仓库

2. **配置环境变量**
   ```
   WECHAT_TOKEN=wechat_order_system_2024_token_abc123
   WECHAT_APP_ID=your_wechat_app_id
   WECHAT_APP_SECRET=your_wechat_app_secret
   MONGODB_URI=your_mongodb_connection_string
   ```

3. **部署**
   - Railway会自动检测Node.js项目并部署

## 替代方案：Heroku部署

### 第一步：注册Heroku

1. **访问Heroku**
   - 网址：https://heroku.com/
   - 注册免费账号

### 第二步：部署项目

1. **安装Heroku CLI**
   ```bash
   # Windows
   # 下载安装包：https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **登录Heroku**
   ```bash
   heroku login
   ```

3. **创建应用**
   ```bash
   heroku create your-app-name
   ```

4. **部署**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

5. **配置环境变量**
   ```bash
   heroku config:set WECHAT_TOKEN=wechat_order_system_2024_token_abc123
   heroku config:set WECHAT_APP_ID=your_wechat_app_id
   heroku config:set WECHAT_APP_SECRET=your_wechat_app_secret
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   ```

## 数据库配置

### 使用MongoDB Atlas（推荐）

1. **注册MongoDB Atlas**
   - 访问：https://www.mongodb.com/cloud/atlas
   - 创建免费集群

2. **获取连接字符串**
   - 格式：`mongodb+srv://username:password@cluster.mongodb.net/database`

3. **配置到云平台**
   - 将连接字符串设置为环境变量 `MONGODB_URI`

## 测试部署

### 1. 测试服务器响应
访问您的部署URL，应该看到欢迎页面。

### 2. 测试微信公众号
1. 关注您的公众号
2. 发送关键词测试自动回复：
   - `帮助`
   - `费用`
   - `地址`
   - `取件`
   - `客服`

## 常见问题

### 1. 部署失败
- 检查 `package.json` 中的依赖是否正确
- 确认 `server.js` 文件存在
- 查看部署日志

### 2. 微信公众号配置失败
- 确认URL格式正确
- 检查Token是否匹配
- 确认服务器能正常响应

### 3. 数据库连接失败
- 检查MongoDB连接字符串
- 确认网络连接正常
- 查看环境变量配置

## 费用说明

### Vercel
- 免费额度：每月100GB带宽
- 个人项目完全免费

### Railway
- 免费额度：每月500小时
- 超出后按使用量计费

### Heroku
- 免费额度：每月550小时
- 超出后按使用量计费

## 推荐选择

**对于初学者，推荐使用Vercel**：
- 部署简单
- 免费额度充足
- 自动HTTPS
- 全球CDN

选择哪个平台？我可以为您提供详细的部署指导！ 