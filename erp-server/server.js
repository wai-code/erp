const express = require('express');
const app = express();
const port = 3000;

// 初始化数据
require('./db/index.js');

// 添加一个简单的路由示例
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
