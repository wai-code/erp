const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { openDB, closeDb } = require('../db');
const { object_checker, email_checker, phone_checker, filer_invalid_field } = require('../common');

const country_checker = Joi.object({
    country: Joi.string()
})

const operator_checker = Joi.object({
    operator: Joi.string()
})


// 获取所有销售订单信息
router.get('/sale/orders', async (req, res) => {
    const db = await openDB();
    const query = 'SELECT * FROM sales_order';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('查询销售订单信息错误：', err.message);
            res.status(500).json({ error: '查询销售订单信息错误' });
        } else {
            res.json(rows);
        }
    });
    closeDb(db);
});

// 获取单个销售订单信息
router.get('/sale/orders/:id', async (req, res) => {
    const db = await openDB();
    const query = 'SELECT * FROM sales_order WHERE id = ?';
    db.get(query, [req.params.id], (err, row) => {
        if (err) {
            console.error('查询销售订单信息错误：', err.message);
            res.status(500).json({ error: '查询销售订单信息错误' });
        } else {
            res.json(row);
        }
    });
    closeDb(db);
});

// 添加新的销售订单信息
router.post('/sale/orders', async (req, res) => {
    const { product_id, quantity, price, order_date, latest_shipment_date, customer_id, shipping_country, is_invoice_issued,
        is_sample_order, exchange_rate, sales_invoice, description } = req.body;
    const obj = {
        product_id, quantity, price, order_date, latest_shipment_date,
        customer_id, shipping_country, is_invoice_issued, is_sample_order,
        exchange_rate, sales_invoice, description, operator: req.headers['username']
    };
    const param = filer_invalid_field(obj)
    const checker = object_checker(param, { operator_checker });
    const validationResult = checker.validate(param);
    if (validationResult.error) {
        console.error('参数校验失败：', validationResult.error.details);
        res.status(400).json({ error: '参数校验失败' });
        return;
    }

    const keys = Object.keys(param).join(",");
    const markers = Array(Object.keys(param).length).fill('?').join(',');

    const db = await openDB();
    const query = `
      INSERT INTO sales_order (${keys}, created_at, updated_at)
      VALUES (${markers}, datetime('now'), datetime('now'))
    `;
    db.run(query, Object.values(param), function (err) {
        if (err) {
            console.error('添加销售订单信息错误：', err.message);
            res.status(500).json({ error: '添加销售订单信息错误' });
        } else {
            res.json({ id: this.lastID });
        }
    });
    closeDb(db);
});

module.exports = router;
