# MongoDB Atlas 免费集群设置指南

## 概述
本指南将帮助你创建MongoDB Atlas免费集群，用于微信公众号订单管理系统的数据库。

## 第一步：注册MongoDB Atlas账户

### 1. 访问官网
- 打开浏览器，访问 [MongoDB Atlas](https://www.mongodb.com/atlas)
- 点击右上角的"Try Free"或"免费试用"按钮

### 2. 创建账户
- 选择注册方式：
  - **邮箱注册**：输入邮箱、密码、姓名
  - **Google账户**：使用Google账户快速注册
  - **GitHub账户**：使用GitHub账户快速注册

### 3. 验证邮箱
- 检查邮箱，点击验证链接
- 完成邮箱验证

## 第二步：创建免费集群

### 1. 选择计划
- 在Atlas控制台首页，选择"FREE"计划
- 点击"Create"或"创建"按钮

### 2. 配置集群设置
```
Cloud Provider: AWS (推荐)
Region: N. Virginia (us-east-1) 或选择离你最近的地区
Cluster Tier: M0 Sandbox (免费)
Cluster Name: wechat-order-cluster (或你喜欢的名称)
```

### 3. 创建集群
- 点击"Create Cluster"
- 等待集群创建完成（通常需要2-3分钟）

## 第三步：设置数据库用户

### 1. 创建数据库用户
- 在集群创建完成后，会提示设置数据库用户
- 填写信息：
  ```
  Username: wechat_admin (或你喜欢的用户名)
  Password: 设置一个强密码（至少8位，包含大小写字母和数字）
  ```
- **重要**：请记住这个用户名和密码！

### 2. 设置权限
- 选择"Read and write to any database"
- 点击"Create User"

## 第四步：配置网络访问

### 1. 添加IP地址
- 在左侧菜单选择"Network Access"
- 点击"Add IP Address"

### 2. 选择访问方式
- **开发环境**：选择"Allow Access from Anywhere"（输入0.0.0.0/0）
- **生产环境**：可以限制特定IP地址

### 3. 确认设置
- 点击"Confirm"

## 第五步：获取连接字符串

### 1. 回到数据库页面
- 在左侧菜单选择"Database"
- 点击你的集群名称

### 2. 获取连接信息
- 点击"Connect"按钮
- 选择"Connect your application"

### 3. 复制连接字符串
- 选择"Node.js"驱动
- 复制连接字符串
- 格式示例：
  ```
  mongodb+srv://wechat_admin:your_password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```

## 第六步：配置项目环境变量

### 1. 创建环境变量文件
运行项目中的脚本：
```bash
create-env.bat
```

### 2. 编辑.env文件
将连接字符串添加到.env文件中：
```bash
MONGODB_URI=mongodb+srv://wechat_admin:your_password@cluster0.xxxxx.mongodb.net/wechat_order_system?retryWrites=true&w=majority
```

**注意**：
- 将`your_password`替换为你的实际密码
- 在连接字符串末尾添加数据库名称`/wechat_order_system`

### 3. 测试连接
运行测试脚本验证连接：
```bash
node test-db.js
```

## 第七步：Render部署配置

### 1. 在Render中设置环境变量
- 登录Render控制台
- 进入你的Web服务
- 在"Environment"标签页添加环境变量：
  ```
  MONGODB_URI=mongodb+srv://wechat_admin:your_password@cluster0.xxxxx.mongodb.net/wechat_order_system?retryWrites=true&w=majority
  ```

### 2. 重新部署
- 保存环境变量
- 触发重新部署

## 免费计划限制

### 存储限制
- 最大存储：512MB
- 对于订单管理系统足够使用

### 性能限制
- 共享资源
- 适合开发和中小型应用

### 网络限制
- 无带宽限制
- 全球CDN加速

## 安全建议

### 1. 密码安全
- 使用强密码
- 定期更换密码
- 不要在代码中硬编码密码

### 2. 网络访问
- 生产环境建议限制IP访问
- 定期审查网络访问设置

### 3. 数据库用户
- 为不同应用创建不同用户
- 遵循最小权限原则

## 常见问题

### 1. 连接失败
- 检查用户名和密码是否正确
- 确认网络访问设置
- 验证连接字符串格式

### 2. 权限错误
- 确认数据库用户权限设置
- 检查数据库名称是否正确

### 3. 网络超时
- 检查网络连接
- 确认IP地址设置

## 监控和维护

### 1. 监控集群状态
- 在Atlas控制台查看集群状态
- 监控存储使用情况

### 2. 备份数据
- Atlas自动提供备份
- 可以手动创建备份

### 3. 性能优化
- 监控查询性能
- 创建适当的索引

## 升级计划

当免费计划不够用时，可以考虑：
- 升级到付费计划
- 使用更大的存储空间
- 获得更好的性能

---

完成以上步骤后，你的MongoDB Atlas免费集群就配置好了，可以用于微信公众号订单管理系统的数据库存储。 