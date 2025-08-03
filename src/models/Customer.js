const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  // 微信信息
  wechatId: {
    type: String,
    required: true,
    unique: true
  },
  openId: String,
  unionId: String,
  nickname: String,
  avatar: String,

  // 基本信息
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: String,
  
  // 地址信息
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    country: {
      type: String,
      default: 'France'
    },
    city: String,
    address: String,
    postalCode: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  }],

  // 偏好设置
  preferences: {
    language: {
      type: String,
      enum: ['zh-CN', 'fr-FR', 'en-US'],
      default: 'zh-CN'
    },
    pickupMethod: {
      type: String,
      enum: ['delivery', 'selfPickup'],
      default: 'selfPickup'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      wechat: {
        type: Boolean,
        default: true
      }
    }
  },

  // 统计信息
  stats: {
    totalOrders: {
      type: Number,
      default: 0
    },
    completedOrders: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    firstOrderDate: Date,
    lastOrderDate: Date
  },

  // 状态
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked'],
    default: 'active'
  },

  // 备注
  notes: String,

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
customerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// 获取默认地址
customerSchema.methods.getDefaultAddress = function() {
  return this.addresses.find(addr => addr.isDefault) || this.addresses[0];
};

// 设置默认地址
customerSchema.methods.setDefaultAddress = function(addressId) {
  this.addresses.forEach(addr => {
    addr.isDefault = addr._id.toString() === addressId.toString();
  });
};

// 更新统计信息
customerSchema.methods.updateStats = function(order) {
  this.stats.totalOrders += 1;
  
  if (order.status === '已完成') {
    this.stats.completedOrders += 1;
  }
  
  if (order.payment.status === '已付款') {
    this.stats.totalSpent += order.payment.amount || 0;
  }
  
  if (!this.stats.firstOrderDate) {
    this.stats.firstOrderDate = order.createdAt;
  }
  
  this.stats.lastOrderDate = order.updatedAt;
};

module.exports = mongoose.model('Customer', customerSchema); 