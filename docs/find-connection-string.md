# 如何找到MongoDB Atlas连接字符串

## 详细步骤指南

### 步骤1：登录MongoDB Atlas
1. 打开浏览器，访问 [MongoDB Atlas](https://cloud.mongodb.com)
2. 输入你的邮箱和密码登录

### 步骤2：找到你的集群
1. 登录后，你会看到Atlas控制台首页
2. 在"Database"部分，你会看到你的集群
3. 集群名称通常是 `wechat-order-cluster` 或类似名称
4. 点击集群名称进入详情页面

### 步骤3：点击Connect按钮
1. 在集群详情页面，你会看到几个按钮
2. 找到并点击 **"Connect"** 按钮
3. 这个按钮通常在页面顶部，颜色是蓝色的

### 步骤4：选择连接方式
1. 在弹出的对话框中，你会看到几个选项：
   - Connect your application
   - Connect using MongoDB Compass
   - Connect using MongoDB Shell
2. 选择 **"Connect your application"**

### 步骤5：配置连接设置
1. 在下一个页面，你会看到连接配置：
   - **Driver**: 选择 `Node.js`
   - **Version**: 选择 `5.0 or later`
2. 页面下方会显示连接字符串

### 步骤6：复制连接字符串
1. 你会看到类似这样的字符串：
   ```
   mongodb+srv://wechat_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
2. 点击字符串旁边的 **"Copy"** 按钮复制

### 步骤7：修改连接字符串
复制后，需要做以下修改：

1. **替换密码**：
   - 将 `<password>` 替换为你的实际密码
   - 例如：`<password>` → `MyStrongPassword123`

2. **添加数据库名**：
   - 在 `mongodb.net/` 后面添加 `/wechat_order_system`
   - 例如：`mongodb.net/?retryWrites=true` → `mongodb.net/wechat_order_system?retryWrites=true`

**最终格式示例**：
```
mongodb+srv://wechat_admin:MyStrongPassword123@cluster0.xxxxx.mongodb.net/wechat_order_system?retryWrites=true&w=majority
```

## 常见问题

### 问题1：看不到Connect按钮
- 确保你已经创建了集群
- 确保集群状态是"Active"
- 刷新页面重试

### 问题2：连接字符串格式不对
- 确保包含了 `mongodb+srv://` 前缀
- 确保用户名和密码正确
- 确保添加了数据库名称

### 问题3：密码包含特殊字符
- 如果密码包含特殊字符，需要进行URL编码
- 例如：`@` 编码为 `%40`，`#` 编码为 `%23`

## 测试连接

获取连接字符串后，可以测试连接：

1. 编辑 `.env` 文件：
   ```
   MONGODB_URI=mongodb+srv://wechat_admin:your_password@cluster0.xxxxx.mongodb.net/wechat_order_system?retryWrites=true&w=majority
   ```

2. 运行测试脚本：
   ```bash
   node test-db.js
   ```

## 安全提醒

- 不要在代码中硬编码密码
- 使用环境变量存储连接字符串
- 定期更换数据库密码
- 不要在公开场合分享连接字符串

---

如果按照以上步骤还是找不到连接字符串，请检查：
1. 是否已经创建了MongoDB Atlas账户
2. 是否已经创建了免费集群
3. 集群是否处于"Active"状态
4. 是否已经设置了数据库用户 