const express = require('express');
const {body, validationResult} = require('express-validator');
const {openDB, closeDb} = require('../db');
const router = express.Router();
const _ = require('lodash');
const Joi = require("joi");
const {filer_invalid_field, object_checker} = require("../common");

// 获取所有库存信息
router.get('/stock', async (req, res) => {
    const db = await openDB();
    const query = 'SELECT * FROM inventory';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('查询库存信息错误：', err.message);
            res.status(500).json({error: '查询库存信息错误'});
        } else {
            res.json(rows);
        }
    });
    closeDb(db);
});

// 添加新的库存信息
router.post('/stock', async (req, res) => {
    const {product_id, stock_quantity} = req.body;
    const obj = {product_id, stock_quantity};
    const param = filer_invalid_field(obj)

    const checker = object_checker(param, {
    });
    const validationResult = checker.validate(param);
    if (validationResult.error) {
        console.error('参数校验失败：', validationResult);
        res.status(400).json({error: '参数校验失败'});
        return;
    }

    const keys = Object.keys(param).join(",");
    const markers = Array(Object.keys(param).length).fill('?').join(',');

    const db = await openDB();
    const query = `
      INSERT INTO inventory (${keys}, updated_at)
      VALUES (${markers}, datetime('now'))
    `;
    db.run(query, Object.values(param), function (err) {
        if (err) {
            console.error('添加库存信息错误：', err.message);
            res.status(500).json({error: '添加库存信息错误'});
        } else {
            res.json({id: this.lastID});
        }
    });
    closeDb(db);
});

// 更新库存信息
router.post('/stock/:id', async (req, res) => {
    const {product_id, stock_quantity} = req.body;
    const obj = {product_id, stock_quantity};
    const param = filer_invalid_field(obj)

    const checker = object_checker(param, {
    });
    const validationResult = checker.validate(param);
    if (validationResult.error) {
        console.error('参数校验失败：', validationResult.error.details);
        res.status(400).json({error: '参数校验失败'});
    }

    const updateFields = Object.keys(param).map(key => `${key} = ?`).join(', ');
    const values = Object.values(param);
    values.push(req.params.id);
    const query = `
        UPDATE inventory
        SET ${updateFields}, updated_at = datetime('now')
        WHERE id = ?
    `;

    const db = await openDB();
    db.run(query, values, function (err) {
        if (err) {
            console.error('更新库存信息错误：', err.message);
            res.status(500).json({error: '更新库存信息错误'});
        } else {
            res.json({rowsChanged: this.changes});
        }
    });
    closeDb(db);
});

module.exports = router;