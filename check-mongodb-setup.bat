@echo off
echo ========================================
echo    MongoDB Atlas 设置检查
echo ========================================
echo.

echo 请按照以下步骤检查你的MongoDB Atlas设置：
echo.

echo 1. 确认账户创建：
echo    - 访问 https://cloud.mongodb.com
echo    - 确认可以正常登录
echo.

echo 2. 确认集群创建：
echo    - 在控制台首页查看是否有集群
echo    - 集群状态应该是 "Active"
echo    - 集群名称通常是 "wechat-order-cluster"
echo.

echo 3. 确认数据库用户：
echo    - 在左侧菜单选择 "Database Access"
echo    - 确认有用户名为 "wechat_admin" 的用户
echo    - 确认用户权限是 "Read and write to any database"
echo.

echo 4. 确认网络访问：
echo    - 在左侧菜单选择 "Network Access"
echo    - 确认有 "0.0.0.0/0" 的访问规则
echo.

echo 5. 获取连接字符串：
echo    - 点击集群名称进入详情页
echo    - 点击蓝色的 "Connect" 按钮
echo    - 选择 "Connect your application"
echo    - 选择 Node.js 驱动
echo    - 复制连接字符串
echo.

echo 6. 修改连接字符串：
echo    - 将 <password> 替换为实际密码
echo    - 在 mongodb.net/ 后添加 /wechat_order_system
echo.

echo 7. 测试连接：
echo    - 编辑 .env 文件，添加 MONGODB_URI
echo    - 运行: node test-db.js
echo.

echo 如果遇到问题，请查看详细指南：
echo docs/find-connection-string.md
echo.

pause 