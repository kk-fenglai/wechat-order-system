@echo off
echo ========================================
echo    微信公众号订单管理系统 - 完整部署流程
echo ========================================
echo.

echo 这个流程将帮助你完成Render部署和微信配置
echo.

echo ========================================
echo 第一步：Render部署（使用占位符）
echo ========================================
echo.

echo 在Render中配置以下环境变量：
echo.
echo 必需变量：
echo MONGODB_URI=mongodb+srv://wechat_admin:wechat_admin@cluster0.fkxi3rn.mongodb.net/wechat_order_system?retryWrites=true^&w=majority^&appName=Cluster0
echo NODE_ENV=production
echo PORT=10000
echo HOST=0.0.0.0
echo JWT_SECRET=my_super_secret_jwt_key_2024
echo.
echo 微信配置（占位符）：
echo WECHAT_APP_ID=temp_app_id
echo WECHAT_APP_SECRET=temp_app_secret
echo WECHAT_TOKEN=wechat_order_system_2024_token_abc123
echo WECHAT_ENCODING_AES_KEY=abcdefghijklmnopqrstuvwxyz123456789012345678901
echo.

echo ========================================
echo 第二步：获取应用URL
echo ========================================
echo.
echo 部署完成后，你会获得类似这样的URL：
echo https://your-app-name.onrender.com
echo.
echo 微信服务器地址将是：
echo https://your-app-name.onrender.com/api/wechat
echo.

echo ========================================
echo 第三步：配置微信公众平台
echo ========================================
echo.
echo 1. 访问：https://mp.weixin.qq.com
echo 2. 进入：开发 → 基本配置
echo 3. 服务器配置：
echo    - URL：https://your-app-name.onrender.com/api/wechat
echo    - Token：wechat_order_system_2024_token_abc123
echo    - EncodingAESKey：abcdefghijklmnopqrstuvwxyz123456789012345678901
echo.

echo ========================================
echo 第四步：更新真实微信配置
echo ========================================
echo.
echo 配置成功后，在Render中更新环境变量：
echo WECHAT_APP_ID=你的真实AppID
echo WECHAT_APP_SECRET=你的真实AppSecret
echo.

echo ========================================
echo 测试验证
echo ========================================
echo.
echo 1. 健康检查：https://your-app-name.onrender.com/health
echo 2. API文档：https://your-app-name.onrender.com/api
echo 3. 微信接口：https://your-app-name.onrender.com/api/wechat
echo.

echo 详细配置指南请查看：docs/wechat-server-config.md
echo.

pause 