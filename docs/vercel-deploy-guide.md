# Vercel部署详细指南

## 方法一：通过Vercel控制台部署（推荐）

### 第一步：准备代码

1. **将项目推送到GitHub**
   ```bash
   # 初始化Git仓库
   git init
   git add .
   git commit -m "Initial commit"
   
   # 推送到GitHub（需要先在GitHub创建仓库）
   git remote add origin https://github.com/your-username/wechat-order-system.git
   git push -u origin main
   ```

### 第二步：通过Vercel控制台部署

1. **访问Vercel控制台**
   - 打开：https://vercel.com/dashboard
   - 点击"New Project"

2. **导入GitHub仓库**
   - 选择"Import Git Repository"
   - 选择您的GitHub仓库
   - 点击"Import"

3. **配置项目**
   - **Project Name**: `wechat-order-system`
   - **Framework Preset**: 选择"Node.js"
   - **Root Directory**: `./` (默认)
   - **Build Command**: `npm run build` (可选)
   - **Output Directory**: `public` (可选)
   - **Install Command**: `npm install`

4. **环境变量配置**
   点击"Environment Variables"添加以下变量：
   ```
   WECHAT_TOKEN=wechat_order_system_2024_token_abc123
   WECHAT_APP_ID=your_wechat_app_id
   WECHAT_APP_SECRET=your_wechat_app_secret
   MONGODB_URI=your_mongodb_connection_string
   ```

5. **部署**
   - 点击"Deploy"
   - 等待部署完成

### 第三步：获取部署URL

部署成功后，您会得到类似这样的URL：
```
https://wechat-order-system-xxx.vercel.app
```

## 方法二：通过Vercel CLI部署（备用）

如果控制台部署遇到问题，可以尝试以下步骤：

### 第一步：清理环境
```bash
# 删除可能存在的Vercel配置
rm -rf .vercel
rm -rf node_modules
npm install
```

### 第二步：重新部署
```bash
vercel --yes
```

## 配置微信公众号

### 第一步：登录微信公众平台
- 访问：https://mp.weixin.qq.com/
- 使用您的公众号账号登录

### 第二步：配置服务器地址
1. 点击"开发" → "基本配置"
2. 配置以下信息：
   - **URL**: `https://your-project-name.vercel.app/api/wechat`
   - **Token**: `wechat_order_system_2024_token_abc123`
   - **EncodingAESKey**: 点击"随机生成"
   - **消息加解密方式**: 安全模式

3. 点击"提交"验证配置

## 测试部署

### 1. 测试服务器响应
访问您的部署URL，应该看到欢迎页面。

### 2. 测试API接口
访问：`https://your-project-name.vercel.app/api/wechat`
应该看到API响应。

### 3. 测试微信公众号
1. 关注您的公众号
2. 发送关键词测试自动回复：
   - `帮助`
   - `费用`
   - `地址`
   - `取件`
   - `客服`

## 常见问题解决

### 1. 部署失败
- 检查`package.json`中的依赖
- 确认`server.js`文件存在
- 查看Vercel部署日志

### 2. 微信公众号配置失败
- 确认URL格式正确
- 检查Token是否匹配
- 确认服务器能正常响应

### 3. 环境变量问题
- 在Vercel控制台中正确设置环境变量
- 确保变量名称和值正确

## 下一步操作

部署成功后，您需要：

1. **配置数据库**
   - 注册MongoDB Atlas
   - 获取连接字符串
   - 在Vercel中设置`MONGODB_URI`

2. **配置微信公众号信息**
   - 在Vercel中设置`WECHAT_APP_ID`和`WECHAT_APP_SECRET`

3. **测试完整功能**
   - 测试订单创建
   - 测试消息回复
   - 测试数据库操作

## 费用说明

Vercel免费计划包含：
- 每月100GB带宽
- 个人项目完全免费
- 自动HTTPS
- 全球CDN

对于您的微信公众号项目，免费计划完全够用！ 