# Render 云部署指南

## 概述
本指南将帮助你将微信公众号订单管理系统部署到Render云平台。

## 准备工作

### 1. 注册Render账户
- 访问 [Render官网](https://render.com)
- 使用GitHub、GitLab或邮箱注册账户
- 完成邮箱验证

### 2. 准备代码仓库
确保你的代码已经推送到GitHub或GitLab仓库中。

## 部署步骤

### 方法一：使用render.yaml配置文件（推荐）

1. **连接Git仓库**
   - 登录Render控制台
   - 点击"New +" → "Blueprint"
   - 选择你的Git仓库
   - Render会自动检测`render.yaml`文件

2. **配置环境变量**
   - 在部署过程中，Render会提示你配置环境变量
   - 需要配置以下环境变量：
     ```
     MONGODB_URI=你的MongoDB连接字符串
     WECHAT_APP_ID=微信公众号AppID
     WECHAT_APP_SECRET=微信公众号AppSecret
     WECHAT_TOKEN=微信公众号Token
     WECHAT_ENCODING_AES_KEY=微信公众号EncodingAESKey
     JWT_SECRET=JWT密钥
     WECHAT_MCH_ID=微信支付商户号
     WECHAT_API_KEY=微信支付API密钥
     EMAIL_HOST=邮件服务器地址
     EMAIL_PORT=邮件服务器端口
     EMAIL_USER=邮件用户名
     EMAIL_PASS=邮件密码
     ```

3. **开始部署**
   - 点击"Create Blueprint Instance"
   - Render会自动构建和部署你的应用

### 方法二：手动创建Web服务

1. **创建Web服务**
   - 登录Render控制台
   - 点击"New +" → "Web Service"
   - 连接你的Git仓库

2. **配置服务设置**
   - **Name**: `wechat-order-management`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free` (免费计划)

3. **配置环境变量**
   - 在"Environment"标签页中添加所有必需的环境变量
   - 参考上面的环境变量列表

4. **部署**
   - 点击"Create Web Service"
   - 等待构建完成

## 环境变量配置

### 必需的环境变量

| 变量名 | 描述 | 示例 |
|--------|------|------|
| `MONGODB_URI` | MongoDB数据库连接字符串 | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `WECHAT_APP_ID` | 微信公众号AppID | `wx1234567890abcdef` |
| `WECHAT_APP_SECRET` | 微信公众号AppSecret | `abcdef1234567890abcdef1234567890` |
| `WECHAT_TOKEN` | 微信公众号Token | `your_token_here` |
| `WECHAT_ENCODING_AES_KEY` | 微信公众号EncodingAESKey | `43位随机字符串` |
| `JWT_SECRET` | JWT签名密钥 | `your_jwt_secret_key` |

### 可选的环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `NODE_ENV` | 运行环境 | `production` |
| `PORT` | 服务端口 | `10000` |
| `HOST` | 服务地址 | `0.0.0.0` |

## 数据库配置

### 使用MongoDB Atlas（推荐）
1. 注册 [MongoDB Atlas](https://www.mongodb.com/atlas)
2. 创建免费集群
3. 获取连接字符串
4. 在Render中设置`MONGODB_URI`环境变量

### 使用Render PostgreSQL（可选）
1. 在Render中创建PostgreSQL数据库
2. 修改代码以支持PostgreSQL
3. 设置数据库连接环境变量

## 域名配置

### 自定义域名
1. 在Render服务设置中找到"Custom Domains"
2. 添加你的域名
3. 配置DNS记录指向Render提供的CNAME

### HTTPS证书
- Render自动为所有服务提供SSL证书
- 无需额外配置

## 监控和日志

### 查看日志
- 在Render控制台中点击你的服务
- 查看"Logs"标签页
- 可以实时查看应用日志

### 性能监控
- Render提供基本的性能监控
- 可以查看CPU、内存使用情况
- 监控请求响应时间

## 常见问题

### 1. 构建失败
- 检查`package.json`中的依赖是否正确
- 确保所有必需的环境变量都已设置
- 查看构建日志获取详细错误信息

### 2. 应用无法启动
- 检查`startCommand`是否正确
- 确保端口配置正确（Render使用`PORT`环境变量）
- 查看应用日志排查问题

### 3. 数据库连接失败
- 检查`MONGODB_URI`是否正确
- 确保数据库允许外部连接
- 检查网络连接和防火墙设置

### 4. 微信接口无法访问
- 确保微信公众号配置正确
- 检查服务器地址是否可访问
- 验证Token和EncodingAESKey是否正确

## 更新部署

### 自动部署
- 推送到Git仓库主分支会自动触发重新部署
- 无需手动操作

### 手动部署
1. 在Render控制台中点击你的服务
2. 点击"Manual Deploy"
3. 选择要部署的分支或提交

## 成本说明

### 免费计划限制
- 每月750小时运行时间
- 512MB内存
- 共享CPU
- 自动休眠（15分钟无请求后）

### 付费计划
- 从$7/月起
- 更多资源和不休眠

## 安全建议

1. **环境变量安全**
   - 不要在代码中硬编码敏感信息
   - 使用Render的环境变量功能
   - 定期轮换密钥

2. **数据库安全**
   - 使用强密码
   - 限制IP访问
   - 启用SSL连接

3. **应用安全**
   - 定期更新依赖包
   - 使用HTTPS
   - 实施适当的认证和授权

## 联系支持

如果遇到问题，可以：
- 查看 [Render文档](https://render.com/docs)
- 在 [Render社区](https://community.render.com) 寻求帮助
- 联系Render技术支持

---

部署完成后，你的应用将在以下地址运行：
`https://your-app-name.onrender.com` 