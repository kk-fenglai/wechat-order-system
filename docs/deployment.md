# 部署指南

## 系统要求

- Node.js 16.0 或更高版本
- MongoDB 4.4 或更高版本
- 微信公众号开发者账号

## 安装步骤

### 1. 克隆项目

```bash
git clone <repository-url>
cd wechat-order-management
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制环境变量模板文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置以下参数：

```env
# 服务器配置
PORT=3000
HOST=localhost

# 微信公众号配置
WECHAT_APP_ID=your_wechat_app_id
WECHAT_APP_SECRET=your_wechat_app_secret
WECHAT_TOKEN=your_wechat_token
WECHAT_ENCODING_AES_KEY=your_wechat_encoding_aes_key

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/wechat_order_system

# JWT配置
JWT_SECRET=your_jwt_secret_key

# 微信支付配置（可选）
WECHAT_MCH_ID=your_wechat_mch_id
WECHAT_API_KEY=your_wechat_api_key
WECHAT_CERT_PATH=path/to/your/cert.pem

# 邮件配置（可选）
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### 4. 启动MongoDB

确保MongoDB服务正在运行：

```bash
# Ubuntu/Debian
sudo systemctl start mongod

# macOS
brew services start mongodb-community

# Windows
net start MongoDB
```

### 5. 启动应用

开发模式：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

## 微信公众号配置

### 1. 创建微信公众号

1. 登录微信公众平台：https://mp.weixin.qq.com/
2. 创建新的公众号或使用现有公众号
3. 获取AppID和AppSecret

### 2. 配置服务器

1. 进入公众号后台 -> 设置 -> 基本配置
2. 配置服务器地址：`https://your-domain.com/api/wechat`
3. 设置Token（与.env文件中的WECHAT_TOKEN一致）
4. 配置消息加解密方式（建议使用安全模式）

### 3. 配置菜单

在公众号后台 -> 自定义菜单中配置以下菜单：

```
主菜单1: 创建订单
- 跳转网页: https://your-domain.com

主菜单2: 我的订单
- 跳转网页: https://your-domain.com/orders

主菜单3: 客服咨询
- 跳转客服会话
```

## 生产环境部署

### 1. 使用PM2（推荐）

安装PM2：
```bash
npm install -g pm2
```

创建PM2配置文件 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [{
    name: 'wechat-order-management',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

启动应用：
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 2. 使用Docker

创建 `Dockerfile`：

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/wechat_order_system
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

volumes:
  mongo_data:
```

启动服务：
```bash
docker-compose up -d
```

### 3. 配置Nginx反向代理

创建Nginx配置文件：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. 配置SSL证书

使用Let's Encrypt获取免费SSL证书：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 监控和维护

### 1. 日志管理

使用PM2查看日志：
```bash
pm2 logs wechat-order-management
pm2 monit
```

### 2. 数据库备份

创建备份脚本：

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --db wechat_order_system --out /backup/$DATE
```

### 3. 性能监控

安装监控工具：
```bash
npm install -g clinic
clinic doctor -- node server.js
```

## 故障排除

### 常见问题

1. **微信公众号验证失败**
   - 检查Token配置是否正确
   - 确认服务器地址可访问
   - 检查防火墙设置

2. **数据库连接失败**
   - 确认MongoDB服务正在运行
   - 检查连接字符串格式
   - 验证网络连接

3. **订单创建失败**
   - 检查客户信息是否完整
   - 验证微信ID是否存在
   - 查看服务器日志

### 日志位置

- 应用日志：`pm2 logs wechat-order-management`
- 系统日志：`/var/log/syslog` (Linux)
- MongoDB日志：`/var/log/mongodb/mongod.log`

## 安全建议

1. **环境变量安全**
   - 不要在代码中硬编码敏感信息
   - 定期更换密钥和令牌
   - 使用强密码

2. **数据库安全**
   - 启用MongoDB认证
   - 限制数据库访问IP
   - 定期备份数据

3. **网络安全**
   - 使用HTTPS
   - 配置防火墙规则
   - 定期更新依赖包

4. **应用安全**
   - 启用CORS保护
   - 实施请求频率限制
   - 验证输入数据

## 更新部署

1. 拉取最新代码：
```bash
git pull origin main
```

2. 安装新依赖：
```bash
npm install
```

3. 重启应用：
```bash
pm2 restart wechat-order-management
```

4. 检查服务状态：
```bash
pm2 status
``` 