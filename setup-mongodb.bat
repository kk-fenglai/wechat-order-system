@echo off
echo ========================================
echo    MongoDB Atlas 连接配置
echo ========================================
echo.

echo 你的MongoDB Atlas连接字符串：
echo mongodb+srv://wechat_admin:^<db_password^>@cluster0.fkxi3rn.mongodb.net/?retryWrites=true^&w=majority^&appName=Cluster0
echo.

echo 需要修改的地方：
echo 1. 将 ^<db_password^> 替换为你的实际密码
echo 2. 在 mongodb.net/ 后添加 /wechat_order_system
echo.

echo 最终格式应该是：
echo mongodb+srv://wechat_admin:你的密码@cluster0.fkxi3rn.mongodb.net/wechat_order_system?retryWrites=true^&w=majority^&appName=Cluster0
echo.

echo 请按照以下步骤操作：
echo.

echo 1. 打开 .env 文件（如果不存在，复制 env.example 为 .env）
echo 2. 找到 MONGODB_URI 这一行
echo 3. 将连接字符串替换为上面的格式
echo 4. 保存文件
echo 5. 运行测试：node test-db.js
echo.

echo 示例：
echo MONGODB_URI=mongodb+srv://wechat_admin:MyPassword123@cluster0.fkxi3rn.mongodb.net/wechat_order_system?retryWrites=true^&w=majority^&appName=Cluster0
echo.

pause 