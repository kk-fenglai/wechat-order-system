const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // 订单基本信息
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  
  // 客户信息
  customer: {
    wechatId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: String,
    address: String
  },

  // 申报信息
  declaration: {
    purpose: {
      type: String,
      required: true,
      enum: ['个人使用', '商业用途', '礼品', '其他']
    },
    items: [{
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      value: {
        type: Number,
        required: true
      },
      weight: {
        type: Number,
        required: true
      },
      description: String
    }],
    totalValue: {
      type: Number,
      required: true
    },
    totalWeight: {
      type: Number,
      required: true
    }
  },

  // 包裹信息
  packages: [{
    trackingNumber: String,
    carrier: String,
    status: {
      type: String,
      enum: ['待寄送', '运输中', '已入库', '已检查', '已打包'],
      default: '待寄送'
    },
    receivedAt: Date,
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    }
  }],

  // 仓库信息
  warehouse: {
    china: {
      address: String,
      contact: String,
      assignedAt: Date
    },
    france: {
      address: String,
      contact: String
    }
  },

  // 订单状态
  status: {
    type: String,
    enum: [
      '信息收集',      // 客户填写申报信息
      '信息审核',      // 系统审核客户信息
      '地址分配',      // 分配仓库地址
      '包裹入库',      // 包裹到达仓库
      '内容检查',      // 检查包裹内容
      '重新打包',      // 重新整合打包
      '费用计算',      // 计算运费
      '等待付款',      // 等待客户付款
      '已付款',        // 客户已付款
      '运输中',        // 包裹运输中
      '待取件',        // 到达法国，等待取件
      '已完成'         // 订单完成
    ],
    default: '信息收集'
  },

  // 取件信息
  pickup: {
    method: {
      type: String,
      enum: ['delivery', 'selfPickup'],
      required: true
    },
    address: String,
    contact: String,
    scheduledTime: Date,
    completedAt: Date
  },

  // 费用信息
  fees: {
    shipping: {
      type: Number,
      default: 0
    },
    handling: {
      type: Number,
      default: 0
    },
    pickup: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },

  // 支付信息
  payment: {
    status: {
      type: String,
      enum: ['未付款', '已付款', '已退款'],
      default: '未付款'
    },
    method: String,
    transactionId: String,
    paidAt: Date,
    amount: Number
  },

  // 时间戳
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 更新时间中间件
orderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// 生成订单号
orderSchema.statics.generateOrderNumber = function() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CF${year}${month}${day}${random}`;
};

// 计算费用
orderSchema.methods.calculateFees = function() {
  const config = require('../../config/config');
  const { shippingRates, pickupOptions } = config.business;
  
  // 计算运费
  const shippingFee = shippingRates.basePrice + (this.declaration.totalWeight * shippingRates.perKg);
  
  // 计算取件费
  const pickupFee = this.pickup.method === 'delivery' 
    ? pickupOptions.delivery.price 
    : pickupOptions.selfPickup.price;
  
  // 计算手续费（总价值的2%）
  const handlingFee = this.declaration.totalValue * 0.02;
  
  this.fees = {
    shipping: shippingFee,
    handling: handlingFee,
    pickup: pickupFee,
    total: shippingFee + handlingFee + pickupFee
  };
  
  return this.fees;
};

module.exports = mongoose.model('Order', orderSchema); 