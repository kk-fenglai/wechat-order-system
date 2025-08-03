const express = require('express');
const router = express.Router();
const WechatController = require('../controllers/WechatController');

// 微信服务器验证
router.get('/', WechatController.verifyServer);

// 处理微信消息
router.post('/', WechatController.handleMessage);

module.exports = router; 