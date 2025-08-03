const mongoose = require('mongoose');

// 测试数据库连接
async function testConnection() {
  try {
    console.log('正在连接MongoDB...');
    
    // 这里需要替换为您的实际连接字符串
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/wechat_order_system';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ MongoDB连接成功！');
    console.log('数据库名称:', mongoose.connection.name);
    console.log('连接状态:', mongoose.connection.readyState);
    
    // 测试创建集合
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: '数据库连接测试成功'
    });
    
    console.log('✅ 数据库写入测试成功！');
    
    // 清理测试数据
    await testCollection.deleteOne({ test: true });
    console.log('✅ 测试数据清理完成！');
    
  } catch (error) {
    console.error('❌ MongoDB连接失败:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('数据库连接已关闭');
  }
}

// 运行测试
testConnection(); 