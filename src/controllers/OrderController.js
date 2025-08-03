const Order = require('../models/Order');
const Customer = require('../models/Customer');
const config = require('../../config/config');

class OrderController {
  // 创建新订单
  static async createOrder(req, res) {
    try {
      const {
        wechatId,
        customerInfo,
        declaration,
        pickupMethod
      } = req.body;

      // 验证客户信息
      const customer = await Customer.findOne({ wechatId });
      if (!customer) {
        return res.status(404).json({ error: '客户不存在' });
      }

      // 生成订单号
      const orderNumber = Order.generateOrderNumber();

      // 创建订单
      const order = new Order({
        orderNumber,
        customer: {
          wechatId: customer.wechatId,
          name: customerInfo.name || customer.name,
          phone: customerInfo.phone || customer.phone,
          email: customerInfo.email || customer.email,
          address: customerInfo.address
        },
        declaration,
        pickup: {
          method: pickupMethod
        },
        status: '信息收集'
      });

      // 计算费用
      order.calculateFees();

      await order.save();

      // 更新客户统计信息
      customer.updateStats(order);
      await customer.save();

      res.status(201).json({
        success: true,
        order: {
          orderNumber: order.orderNumber,
          status: order.status,
          fees: order.fees,
          warehouseAddress: config.business.warehouseAddress.china
        }
      });
    } catch (error) {
      console.error('创建订单错误:', error);
      res.status(500).json({ error: '创建订单失败' });
    }
  }

  // 获取订单列表
  static async getOrders(req, res) {
    try {
      const { wechatId, status, page = 1, limit = 10 } = req.query;
      
      const filter = {};
      if (wechatId) {
        filter['customer.wechatId'] = wechatId;
      }
      if (status) {
        filter.status = status;
      }

      const skip = (page - 1) * limit;
      
      const orders = await Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v');

      const total = await Order.countDocuments(filter);

      res.json({
        success: true,
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('获取订单列表错误:', error);
      res.status(500).json({ error: '获取订单列表失败' });
    }
  }

  // 获取订单详情
  static async getOrder(req, res) {
    try {
      const { orderNumber } = req.params;
      
      const order = await Order.findOne({ orderNumber });
      if (!order) {
        return res.status(404).json({ error: '订单不存在' });
      }

      res.json({
        success: true,
        order
      });
    } catch (error) {
      console.error('获取订单详情错误:', error);
      res.status(500).json({ error: '获取订单详情失败' });
    }
  }

  // 更新订单状态
  static async updateOrderStatus(req, res) {
    try {
      const { orderNumber } = req.params;
      const { status, notes } = req.body;

      const order = await Order.findOne({ orderNumber });
      if (!order) {
        return res.status(404).json({ error: '订单不存在' });
      }

      // 验证状态转换的合法性
      const validTransitions = {
        '信息收集': ['信息审核'],
        '信息审核': ['地址分配'],
        '地址分配': ['包裹入库'],
        '包裹入库': ['内容检查'],
        '内容检查': ['重新打包'],
        '重新打包': ['费用计算'],
        '费用计算': ['等待付款'],
        '等待付款': ['已付款'],
        '已付款': ['运输中'],
        '运输中': ['待取件'],
        '待取件': ['已完成']
      };

      if (validTransitions[order.status] && !validTransitions[order.status].includes(status)) {
        return res.status(400).json({ 
          error: `状态转换无效，当前状态 ${order.status} 只能转换为: ${validTransitions[order.status].join(', ')}` 
        });
      }

      order.status = status;
      
      // 根据状态执行相应操作
      await this.handleStatusChange(order, status);

      if (notes) {
        order.notes = notes;
      }

      await order.save();

      res.json({
        success: true,
        order: {
          orderNumber: order.orderNumber,
          status: order.status,
          updatedAt: order.updatedAt
        }
      });
    } catch (error) {
      console.error('更新订单状态错误:', error);
      res.status(500).json({ error: '更新订单状态失败' });
    }
  }

  // 处理状态变化
  static async handleStatusChange(order, newStatus) {
    switch (newStatus) {
      case '地址分配':
        // 分配仓库地址
        order.warehouse.china = {
          address: config.business.warehouseAddress.china.address,
          contact: config.business.warehouseAddress.china.contact,
          assignedAt: new Date()
        };
        break;

      case '费用计算':
        // 重新计算费用
        order.calculateFees();
        break;

      case '已付款':
        // 更新支付信息
        order.payment.status = '已付款';
        order.payment.paidAt = new Date();
        break;

      case '待取件':
        // 设置取件信息
        if (order.pickup.method === 'delivery') {
          const customer = await Customer.findOne({ wechatId: order.customer.wechatId });
          const defaultAddress = customer.getDefaultAddress();
          if (defaultAddress) {
            order.pickup.address = `${defaultAddress.address}, ${defaultAddress.city}, ${defaultAddress.postalCode}`;
            order.pickup.contact = customer.phone;
          }
        }
        break;
    }
  }

  // 添加包裹信息
  static async addPackage(req, res) {
    try {
      const { orderNumber } = req.params;
      const packageInfo = req.body;

      const order = await Order.findOne({ orderNumber });
      if (!order) {
        return res.status(404).json({ error: '订单不存在' });
      }

      // 验证订单状态
      if (!['地址分配', '包裹入库', '内容检查'].includes(order.status)) {
        return res.status(400).json({ error: '当前订单状态不允许添加包裹' });
      }

      const newPackage = {
        trackingNumber: packageInfo.trackingNumber,
        carrier: packageInfo.carrier,
        status: '已入库',
        receivedAt: new Date(),
        weight: packageInfo.weight,
        dimensions: packageInfo.dimensions
      };

      order.packages.push(newPackage);

      // 如果状态是地址分配，更新为包裹入库
      if (order.status === '地址分配') {
        order.status = '包裹入库';
      }

      await order.save();

      res.json({
        success: true,
        package: newPackage,
        orderStatus: order.status
      });
    } catch (error) {
      console.error('添加包裹错误:', error);
      res.status(500).json({ error: '添加包裹失败' });
    }
  }

  // 更新包裹状态
  static async updatePackageStatus(req, res) {
    try {
      const { orderNumber, packageId } = req.params;
      const { status } = req.body;

      const order = await Order.findOne({ orderNumber });
      if (!order) {
        return res.status(404).json({ error: '订单不存在' });
      }

      const package = order.packages.id(packageId);
      if (!package) {
        return res.status(404).json({ error: '包裹不存在' });
      }

      package.status = status;
      await order.save();

      res.json({
        success: true,
        package: {
          id: package._id,
          status: package.status
        }
      });
    } catch (error) {
      console.error('更新包裹状态错误:', error);
      res.status(500).json({ error: '更新包裹状态失败' });
    }
  }

  // 更新取件信息
  static async updatePickupInfo(req, res) {
    try {
      const { orderNumber } = req.params;
      const { method, address, contact, scheduledTime } = req.body;

      const order = await Order.findOne({ orderNumber });
      if (!order) {
        return res.status(404).json({ error: '订单不存在' });
      }

      // 验证订单状态
      if (order.status !== '待取件') {
        return res.status(400).json({ error: '订单状态不允许更新取件信息' });
      }

      order.pickup.method = method;
      if (address) order.pickup.address = address;
      if (contact) order.pickup.contact = contact;
      if (scheduledTime) order.pickup.scheduledTime = new Date(scheduledTime);

      // 重新计算费用（取件方式可能影响费用）
      order.calculateFees();

      await order.save();

      res.json({
        success: true,
        pickup: order.pickup,
        fees: order.fees
      });
    } catch (error) {
      console.error('更新取件信息错误:', error);
      res.status(500).json({ error: '更新取件信息失败' });
    }
  }

  // 完成取件
  static async completePickup(req, res) {
    try {
      const { orderNumber } = req.params;

      const order = await Order.findOne({ orderNumber });
      if (!order) {
        return res.status(404).json({ error: '订单不存在' });
      }

      if (order.status !== '待取件') {
        return res.status(400).json({ error: '订单状态不允许完成取件' });
      }

      order.status = '已完成';
      order.pickup.completedAt = new Date();

      await order.save();

      res.json({
        success: true,
        order: {
          orderNumber: order.orderNumber,
          status: order.status,
          completedAt: order.pickup.completedAt
        }
      });
    } catch (error) {
      console.error('完成取件错误:', error);
      res.status(500).json({ error: '完成取件失败' });
    }
  }

  // 获取订单统计
  static async getOrderStats(req, res) {
    try {
      const { wechatId } = req.query;
      
      const filter = {};
      if (wechatId) {
        filter['customer.wechatId'] = wechatId;
      }

      const stats = await Order.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalValue: { $sum: '$fees.total' }
          }
        }
      ]);

      const totalOrders = await Order.countDocuments(filter);
      const totalRevenue = await Order.aggregate([
        { $match: { ...filter, 'payment.status': '已付款' } },
        { $group: { _id: null, total: { $sum: '$payment.amount' } } }
      ]);

      res.json({
        success: true,
        stats: {
          byStatus: stats,
          totalOrders,
          totalRevenue: totalRevenue[0]?.total || 0
        }
      });
    } catch (error) {
      console.error('获取订单统计错误:', error);
      res.status(500).json({ error: '获取订单统计失败' });
    }
  }
}

module.exports = OrderController; 