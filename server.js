const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');

// 导入路由
const wechatRoutes = require('./src/routes/wechat');
const orderRoutes = require('./src/routes/orders');

const app = express();

// 连接数据库（暂时注释掉，稍后配置）
// mongoose.connect(config.database.url, config.database.options)
//   .then(() => {
//     console.log('✅ 数据库连接成功');
//   })
//   .catch((error) => {
//     console.error('❌ 数据库连接失败:', error);
//     process.exit(1);
//   });

console.log('⚠️ 数据库连接已暂时禁用，请稍后配置MongoDB');

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 路由
app.use('/api/wechat', wechatRoutes);
app.use('/api/orders', orderRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API文档
app.get('/api', (req, res) => {
  res.json({
    name: '微信公众号订单管理系统 API',
    version: '1.0.0',
    description: '中法集运业务订单管理API',
    endpoints: {
      wechat: '/api/wechat',
      orders: '/api/orders',
      health: '/health'
    }
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : '请稍后重试'
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    error: '接口不存在',
    path: req.path
  });
});

// 启动服务器
const PORT = config.server.port;
const HOST = config.server.host;

app.listen(PORT, HOST, () => {
  console.log(`🚀 服务器启动成功`);
  console.log(`📍 地址: http://${HOST}:${PORT}`);
  console.log(`📋 API文档: http://${HOST}:${PORT}/api`);
  console.log(`💚 健康检查: http://${HOST}:${PORT}/health`);
  console.log(`🤖 微信接口: http://${HOST}:${PORT}/api/wechat`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，正在关闭服务器...');
  // mongoose.connection.close(() => {
  //   console.log('数据库连接已关闭');
  //   process.exit(0);
  // });
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('收到 SIGINT 信号，正在关闭服务器...');
  // mongoose.connection.close(() => {
  //   console.log('数据库连接已关闭');
  //   process.exit(0);
  // });
  process.exit(0);
});

module.exports = app; 