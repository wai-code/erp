const express = require('express');
const responseInterceptor = require('./middlewares/responseInterceptor');
const authInterceptor = require('./middlewares/authInterceptor');

const app = express();
const port = 3000;

// 初始化数据
require('./db/init.js');


// 解析请求体中的 JSON 数据
app.use(express.json());

// 使用中间件
app.use(authInterceptor);

// 使用中间件
app.use(responseInterceptor);

// 引入 api.js 路由
const usersRouter = require('./routes/users');
app.use('/api', usersRouter);

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
