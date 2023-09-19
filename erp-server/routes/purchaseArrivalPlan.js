const express = require('express');
const {body, validationResult} = require('express-validator');
const {openDB, closeDb} = require('../db');
const router = express.Router();
const _ = require('lodash');
const Joi = require("joi");
const {filer_invalid_field, object_checker} = require("../common");

// 获取单个采购订单的发货信息
router.get('/purchaseArrivalPlan/:id', async (req, res) => {
    console.log(req.params.id)
    const db = await openDB();
    const query = 'SELECT * FROM purchase_arrival_plan WHERE purchase_id = ?';
    db.get(query, [req.params.id], (err, row) => {
        if (err) {
            console.error('查询采购订单发货信息错误：', err.message);
            res.status(500).json({error: '查询采购订单发货信息错误'});
        } else {
            res.json(row);
        }
    });
    closeDb(db);
});

// 添加新的采购订单的发货信息
router.post('/purchaseArrivalPlan', async (req, res) => {
    let error;

    for (const arrivalPlan of req.body) {
        console.log(arrivalPlan)
        const {purchase_id, plan_quantity, plan_date, is_completed} = arrivalPlan;
        const obj = {purchase_id, plan_quantity, plan_date, is_completed, operator: req.headers['username']};
        const param = filer_invalid_field(obj)

        const checker = object_checker(param, {});
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
          INSERT INTO purchase_arrival_plan (${keys}, updated_at)
          VALUES (${markers}, datetime('now'))
        `;
        db.run(query, Object.values(param), function (err) {
            error = err;
        });
        closeDb(db);
    }

    if (error) {
        console.error('添加采购订单信息错误：', err.message);
        res.status(500).json({error: '添加采购订单信息错误'});
    } else {
        res.json({id: this.lastID});
    }
});

// 更新采购订单的发货信息
router.post('/purchaseArrivalPlan/:id', async (req, res) => {
    // TODO
    const {purchase_id, plan_quantity, plan_date, is_completed} = req.body;
    const obj = {purchase_id, plan_quantity, plan_date, is_completed};
    const param = filer_invalid_field(obj)

    const checker = object_checker(param, {});
    const validationResult = checker.validate(param);
    if (validationResult.error) {
        console.error('参数校验失败：', validationResult.error.details);
        res.status(400).json({error: '参数校验失败'});
    }

    const updateFields = Object.keys(param).map(key => `${key} = ?`).join(', ');
    const values = Object.values(param);
    values.push(req.params.id);
    const query = `
        UPDATE purchase_arrival_plan
        SET ${updateFields}, updated_at = datetime('now')
        WHERE id = ?
    `;

    const db = await openDB();
    db.run(query, values, function (err) {
        if (err) {
            console.error('更新采购订单发货信息错误：', err.message);
            res.status(500).json({error: '更新采购订单发货信息错误'});
        } else {
            res.json({rowsChanged: this.changes});
        }
    });
    closeDb(db);
});

// 删除采购订单的发货信息
router.get('/purchaseArrivalPlan/delete/:id', async (req, res) => {
    const db = await openDB();
    const query = 'DELETE FROM purchase_arrival_plan WHERE id = ?';
    db.run(query, [req.params.id], function (err) {
        if (err) {
            console.error('删除采购订单发货信息错误：', err.message);
            res.status(500).json({error: '删除采购订单发货信息错误'});
        } else {
            res.json({rowsChanged: this.changes});
        }
    });
    closeDb(db);
});

module.exports = router;