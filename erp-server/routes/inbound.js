const express = require('express');
const {body, validationResult} = require('express-validator');
const {openDB, closeDb} = require('../db');
const router = express.Router();
const _ = require('lodash');
const Joi = require("joi");
const {filer_invalid_field, object_checker} = require("../common");

// 获取所有入库信息
router.get('/inbound', async (req, res) => {
    const db = await openDB();
    const query = 'SELECT * FROM inbound';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('查询入库信息错误：', err.message);
            res.status(500).json({error: '查询入库信息错误'});
        } else {
            res.json(rows);
        }
    });
    closeDb(db);
});

// 获取单个入库信息
router.get('/inbound/:id', async (req, res) => {
    const db = await openDB();
    const query = 'SELECT * FROM inbound WHERE id = ?';
    db.get(query, [req.params.id], (err, row) => {
        if (err) {
            console.error('查询入库信息错误：', err.message);
            res.status(500).json({error: '查询入库信息错误'});
        } else {
            res.json(row);
        }
    });
    closeDb(db);
});

// 添加新的入库信息
router.post('/inbound', async (req, res) => {
    const {purchase_id, arrival_quantity, arrival_date, incoming_quantity,incoming_date,yield,shipping_method} = req.body;
    const obj = {purchase_id, arrival_quantity, arrival_date, incoming_quantity,incoming_date,yield,shipping_method, operator: req.headers['username']};
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
      INSERT INTO inbound (${keys}, created_at, updated_at)
      VALUES (${markers}, datetime('now'), datetime('now'))
    `;
    db.run(query, Object.values(param), function (err) {
        if (err) {
            console.error('添加入库信息错误：', err.message);
            res.status(500).json({error: '添加入库信息错误'});
        } else {
            res.json({id: this.lastID});
        }
    });
    closeDb(db);
});

// 更新入库信息
router.post('/inbound/:id', async (req, res) => {
    // TODO
    const {purchase_id, arrival_quantity, arrival_date, incoming_quantity,incoming_date,yield,shipping_method} = req.body;
    const obj = {purchase_id, arrival_quantity, arrival_date, incoming_quantity,incoming_date,yield,shipping_method, operator: req.headers['username']};
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
        UPDATE inbound
        SET ${updateFields}, updated_at = datetime('now')
        WHERE id = ?
    `;

    const db = await openDB();
    db.run(query, values, function (err) {
        if (err) {
            console.error('更新入库信息错误：', err.message);
            res.status(500).json({error: '更新入库信息错误'});
        } else {
            res.json({rowsChanged: this.changes});
        }
    });
    closeDb(db);
});

// 删除入库信息
router.get('/inbound/delete/:id', async (req, res) => {
    const db = await openDB();
    const query = 'DELETE FROM inbound WHERE id = ?';
    db.run(query, [req.params.id], function (err) {
        if (err) {
            console.error('删除入库信息错误：', err.message);
            res.status(500).json({error: '删除入库信息错误'});
        } else {
            res.json({rowsChanged: this.changes});
        }
    });
    closeDb(db);
});

module.exports = router;