const express = require('express');
const router = express.Router();

// 定义 GET 请求的路由
router.get('/', (req, res) => {
    // 处理 GET 请求的逻辑
    res.json({ message: 'GET request received' });
});

// 定义 POST 请求的路由
router.post('/', (req, res) => {
    // 处理 POST 请求的逻辑
    const data = req.body; // 从请求中获取 JSON 数据
    // 处理数据，并返回响应
    res.json({ message: 'POST request received', data });
});

// 定义 PUT 请求的路由
router.put('/:id', (req, res) => {
    // 处理 PUT 请求的逻辑
    const id = req.params.id; // 获取路由参数
    const data = req.body; // 获取请求中的 JSON 数据
    // 处理数据，并返回响应
    res.json({ message: `PUT request received for ID ${id}`, data });
});

// 定义 DELETE 请求的路由
router.delete('/:id', (req, res) => {
    // 处理 DELETE 请求的逻辑
    const id = req.params.id; // 获取路由参数
    // 处理数据，并返回响应
    res.json({ message: `DELETE request received for ID ${id}` });
});

module.exports = router;
