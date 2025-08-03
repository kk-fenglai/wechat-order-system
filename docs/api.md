# API 文档

## 基础信息

- 基础URL: `http://localhost:3000/api`
- 内容类型: `application/json`
- 字符编码: `UTF-8`

## 认证

目前API使用简单的微信ID验证，后续可扩展JWT认证。

## 响应格式

所有API响应都遵循以下格式：

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

## 微信公众号接口

### 1. 微信服务器验证

**GET** `/api/wechat`

验证微信服务器配置。

**查询参数:**
- `signature`: 微信加密签名
- `timestamp`: 时间戳
- `nonce`: 随机数
- `echostr`: 随机字符串

**响应:**
- 成功: 返回 `echostr` 字符串
- 失败: 返回 `403 Forbidden`

### 2. 处理微信消息

**POST** `/api/wechat`

处理微信用户发送的消息。

**请求体:**
```xml
<xml>
  <ToUserName><![CDATA[公众号]]></ToUserName>
  <FromUserName><![CDATA[用户OpenID]]></FromUserName>
  <CreateTime>1234567890</CreateTime>
  <MsgType><![CDATA[text]]></MsgType>
  <Content><![CDATA[消息内容]]></Content>
</xml>
```

**响应:**
```xml
<xml>
  <ToUserName><![CDATA[用户OpenID]]></ToUserName>
  <FromUserName><![CDATA[公众号]]></FromUserName>
  <CreateTime>1234567890</CreateTime>
  <MsgType><![CDATA[text]]></MsgType>
  <Content><![CDATA[回复内容]]></Content>
</xml>
```

## 订单管理接口

### 1. 创建订单

**POST** `/api/orders`

创建新的集运订单。

**请求体:**
```json
{
  "wechatId": "用户微信ID",
  "customerInfo": {
    "name": "客户姓名",
    "phone": "联系电话",
    "email": "邮箱地址",
    "address": "地址信息"
  },
  "declaration": {
    "purpose": "个人使用",
    "items": [
      {
        "name": "物品名称",
        "quantity": 1,
        "value": 100.00,
        "weight": 1.5,
        "description": "物品描述"
      }
    ],
    "totalValue": 100.00,
    "totalWeight": 1.5
  },
  "pickupMethod": "delivery"
}
```

**响应:**
```json
{
  "success": true,
  "order": {
    "orderNumber": "CF202312010001",
    "status": "信息收集",
    "fees": {
      "shipping": 8.00,
      "handling": 2.00,
      "pickup": 15.00,
      "total": 25.00
    },
    "warehouseAddress": {
      "address": "广东省深圳市宝安区...",
      "contact": "+86 138-xxxx-xxxx"
    }
  }
}
```

### 2. 获取订单列表

**GET** `/api/orders`

获取订单列表，支持分页和状态筛选。

**查询参数:**
- `wechatId`: 微信ID（可选）
- `status`: 订单状态（可选）
- `page`: 页码（默认1）
- `limit`: 每页数量（默认10）

**响应:**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "订单ID",
      "orderNumber": "CF202312010001",
      "customer": {
        "name": "客户姓名",
        "phone": "联系电话"
      },
      "status": "信息收集",
      "fees": {
        "total": 25.00
      },
      "createdAt": "2023-12-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

### 3. 获取订单详情

**GET** `/api/orders/{orderNumber}`

获取指定订单的详细信息。

**路径参数:**
- `orderNumber`: 订单号

**响应:**
```json
{
  "success": true,
  "order": {
    "_id": "订单ID",
    "orderNumber": "CF202312010001",
    "customer": {
      "wechatId": "用户微信ID",
      "name": "客户姓名",
      "phone": "联系电话",
      "email": "邮箱地址"
    },
    "declaration": {
      "purpose": "个人使用",
      "items": [...],
      "totalValue": 100.00,
      "totalWeight": 1.5
    },
    "packages": [...],
    "warehouse": {...},
    "status": "信息收集",
    "pickup": {...},
    "fees": {...},
    "payment": {...},
    "createdAt": "2023-12-01T10:00:00.000Z",
    "updatedAt": "2023-12-01T10:00:00.000Z"
  }
}
```

### 4. 更新订单状态

**PUT** `/api/orders/{orderNumber}/status`

更新订单状态。

**路径参数:**
- `orderNumber`: 订单号

**请求体:**
```json
{
  "status": "信息审核",
  "notes": "状态更新备注"
}
```

**响应:**
```json
{
  "success": true,
  "order": {
    "orderNumber": "CF202312010001",
    "status": "信息审核",
    "updatedAt": "2023-12-01T10:30:00.000Z"
  }
}
```

### 5. 添加包裹信息

**POST** `/api/orders/{orderNumber}/packages`

为订单添加包裹信息。

**路径参数:**
- `orderNumber`: 订单号

**请求体:**
```json
{
  "trackingNumber": "快递单号",
  "carrier": "快递公司",
  "weight": 1.5,
  "dimensions": {
    "length": 30,
    "width": 20,
    "height": 15
  }
}
```

**响应:**
```json
{
  "success": true,
  "package": {
    "_id": "包裹ID",
    "trackingNumber": "快递单号",
    "carrier": "快递公司",
    "status": "已入库",
    "receivedAt": "2023-12-01T11:00:00.000Z",
    "weight": 1.5
  },
  "orderStatus": "包裹入库"
}
```

### 6. 更新包裹状态

**PUT** `/api/orders/{orderNumber}/packages/{packageId}/status`

更新指定包裹的状态。

**路径参数:**
- `orderNumber`: 订单号
- `packageId`: 包裹ID

**请求体:**
```json
{
  "status": "已检查"
}
```

**响应:**
```json
{
  "success": true,
  "package": {
    "id": "包裹ID",
    "status": "已检查"
  }
}
```

### 7. 更新取件信息

**PUT** `/api/orders/{orderNumber}/pickup`

更新订单的取件信息。

**路径参数:**
- `orderNumber`: 订单号

**请求体:**
```json
{
  "method": "delivery",
  "address": "收件地址",
  "contact": "联系人",
  "scheduledTime": "2023-12-05T14:00:00.000Z"
}
```

**响应:**
```json
{
  "success": true,
  "pickup": {
    "method": "delivery",
    "address": "收件地址",
    "contact": "联系人",
    "scheduledTime": "2023-12-05T14:00:00.000Z"
  },
  "fees": {
    "shipping": 8.00,
    "handling": 2.00,
    "pickup": 15.00,
    "total": 25.00
  }
}
```

### 8. 完成取件

**POST** `/api/orders/{orderNumber}/pickup/complete`

标记订单取件完成。

**路径参数:**
- `orderNumber`: 订单号

**响应:**
```json
{
  "success": true,
  "order": {
    "orderNumber": "CF202312010001",
    "status": "已完成",
    "completedAt": "2023-12-05T15:00:00.000Z"
  }
}
```

### 9. 获取订单统计

**GET** `/api/orders/stats`

获取订单统计信息。

**查询参数:**
- `wechatId`: 微信ID（可选）

**响应:**
```json
{
  "success": true,
  "stats": {
    "byStatus": [
      {
        "_id": "信息收集",
        "count": 10,
        "totalValue": 1000.00
      },
      {
        "_id": "已完成",
        "count": 25,
        "totalValue": 2500.00
      }
    ],
    "totalOrders": 50,
    "totalRevenue": 5000.00
  }
}
```

## 错误处理

### 错误响应格式

```json
{
  "success": false,
  "error": "错误描述",
  "message": "详细错误信息"
}
```

### 常见错误码

- `400 Bad Request`: 请求参数错误
- `404 Not Found`: 资源不存在
- `500 Internal Server Error`: 服务器内部错误

### 错误示例

```json
{
  "success": false,
  "error": "订单不存在",
  "message": "未找到订单号 CF202312010001"
}
```

## 状态码说明

### 订单状态

1. **信息收集**: 客户填写申报信息
2. **信息审核**: 系统审核客户信息
3. **地址分配**: 分配仓库地址
4. **包裹入库**: 包裹到达仓库
5. **内容检查**: 检查包裹内容
6. **重新打包**: 重新整合打包
7. **费用计算**: 计算运费
8. **等待付款**: 等待客户付款
9. **已付款**: 客户已付款
10. **运输中**: 包裹运输中
11. **待取件**: 到达法国，等待取件
12. **已完成**: 订单完成

### 包裹状态

1. **待寄送**: 等待客户寄送
2. **运输中**: 包裹运输中
3. **已入库**: 包裹已到达仓库
4. **已检查**: 包裹内容已检查
5. **已打包**: 包裹已重新打包

### 支付状态

1. **未付款**: 尚未付款
2. **已付款**: 已付款
3. **已退款**: 已退款

## 使用示例

### JavaScript 示例

```javascript
// 创建订单
const createOrder = async () => {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      wechatId: 'user123',
      customerInfo: {
        name: '张三',
        phone: '13800138000',
        email: 'zhangsan@example.com'
      },
      declaration: {
        purpose: '个人使用',
        items: [{
          name: '手机壳',
          quantity: 2,
          value: 50.00,
          weight: 0.2,
          description: 'iPhone手机壳'
        }],
        totalValue: 100.00,
        totalWeight: 0.4
      },
      pickupMethod: 'selfPickup'
    })
  });
  
  const result = await response.json();
  console.log(result);
};

// 获取订单列表
const getOrders = async () => {
  const response = await fetch('/api/orders?page=1&limit=10');
  const result = await response.json();
  console.log(result);
};
```

### cURL 示例

```bash
# 创建订单
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "wechatId": "user123",
    "customerInfo": {
      "name": "张三",
      "phone": "13800138000"
    },
    "declaration": {
      "purpose": "个人使用",
      "items": [{
        "name": "手机壳",
        "quantity": 2,
        "value": 50.00,
        "weight": 0.2
      }],
      "totalValue": 100.00,
      "totalWeight": 0.4
    },
    "pickupMethod": "selfPickup"
  }'

# 获取订单列表
curl http://localhost:3000/api/orders

# 更新订单状态
curl -X PUT http://localhost:3000/api/orders/CF202312010001/status \
  -H "Content-Type: application/json" \
  -d '{"status": "信息审核"}'
```

## 注意事项

1. 所有时间字段使用ISO 8601格式
2. 金额字段使用欧元（€）作为单位
3. 重量字段使用公斤（kg）作为单位
4. 微信ID必须是有效的用户标识
5. 订单号格式为：CF + 年月日 + 4位随机数
6. 状态转换必须遵循预定义的流程 