# Render部署检查清单

## ✅ 已完成
- [x] MongoDB Atlas集群创建
- [x] 数据库连接测试成功
- [x] 代码推送到GitHub
- [x] render.yaml配置文件创建
- [x] 环境变量配置

## 🚀 部署步骤

### 1. 访问Render
- [ ] 访问 https://render.com
- [ ] 使用GitHub账户登录

### 2. 创建Blueprint
- [ ] 点击"New +" → "Blueprint"
- [ ] 连接GitHub仓库：`kk-fenglai/wechat-order-system`
- [ ] 确认render.yaml文件被检测到

### 3. 配置环境变量
在部署过程中配置以下环境变量：

**必需变量**：
```
MONGODB_URI=mongodb+srv://wechat_admin:wechat_admin@cluster0.fkxi3rn.mongodb.net/wechat_order_system?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
PORT=10000
HOST=0.0.0.0
```

**可选变量**（稍后配置）：
```
WECHAT_APP_ID=your_wechat_app_id
WECHAT_APP_SECRET=your_wechat_app_secret
WECHAT_TOKEN=your_wechat_token
WECHAT_ENCODING_AES_KEY=your_wechat_encoding_aes_key
JWT_SECRET=your_jwt_secret_key
WECHAT_MCH_ID=your_wechat_mch_id
WECHAT_API_KEY=your_wechat_api_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### 4. 开始部署
- [ ] 点击"Create Blueprint Instance"
- [ ] 等待构建完成（通常需要2-3分钟）

### 5. 验证部署
- [ ] 检查服务状态是否为"Live"
- [ ] 访问健康检查端点：`/health`
- [ ] 访问API文档端点：`/api`

## 📋 部署后检查

### 服务状态
- [ ] 服务状态：Live
- [ ] 构建状态：Success
- [ ] 日志无错误

### 功能测试
- [ ] 健康检查：`https://your-app-name.onrender.com/health`
- [ ] API文档：`https://your-app-name.onrender.com/api`
- [ ] 数据库连接正常

### 环境变量
- [ ] MONGODB_URI已设置
- [ ] NODE_ENV=production
- [ ] PORT=10000

## 🔧 常见问题

### 构建失败
- 检查package.json中的依赖
- 查看构建日志
- 确认Node.js版本兼容

### 应用无法启动
- 检查环境变量配置
- 查看应用日志
- 确认端口配置

### 数据库连接失败
- 确认MONGODB_URI正确
- 检查MongoDB Atlas网络设置
- 验证用户名密码

## 📞 获取帮助

如果遇到问题：
1. 查看Render部署日志
2. 检查MongoDB Atlas连接
3. 参考详细部署指南：`docs/render-deploy-guide.md`

---

部署完成后，你的应用将在以下地址运行：
`https://your-app-name.onrender.com` 