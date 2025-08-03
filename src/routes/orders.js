const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');

// 创建新订单
router.post('/', OrderController.createOrder);

// 获取订单列表
router.get('/', OrderController.getOrders);

// 获取订单统计
router.get('/stats', OrderController.getOrderStats);

// 获取订单详情
router.get('/:orderNumber', OrderController.getOrder);

// 更新订单状态
router.put('/:orderNumber/status', OrderController.updateOrderStatus);

// 添加包裹信息
router.post('/:orderNumber/packages', OrderController.addPackage);

// 更新包裹状态
router.put('/:orderNumber/packages/:packageId/status', OrderController.updatePackageStatus);

// 更新取件信息
router.put('/:orderNumber/pickup', OrderController.updatePickupInfo);

// 完成取件
router.post('/:orderNumber/pickup/complete', OrderController.completePickup);

module.exports = router; 