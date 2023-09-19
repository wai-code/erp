const express = require('express');
const {body, validationResult} = require('express-validator');
const {openDB, closeDb} = require('../db');
const router = express.Router();
const _ = require('lodash');
const Joi = require("joi");
const {filer_invalid_field, object_checker} = require("../common");

const order_id_checker = Joi.object({
    order_id: Joi.string().required(),
});

const type_checker = Joi.object({
    order_id: Joi.string().required(),
    type: Joi.string().valid('product', 'accessory').required()
});

const product_id_checker = Joi.object({
    product_id: Joi.number().required(),
});

const unit_price_checker = Joi.object({
    unit_price: Joi.number().min(0).required(),
});

const purchase_quantity_checker = Joi.object({
    purchase_quantity: Joi.number().min(0).required(),
});

const plan_quantity_checker = Joi.object({
    plan_quantity: Joi.number().min(0).required(),
});

const operator_checker = Joi.object({
    operator: Joi.string().required(),
});

// 获取所有采购订单信息
router.get('/purchases', async (req, res) => {
    // TODO 连表查询
    const db = await openDB();
    const query = 'SELECT * FROM purchase';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('查询采购订单信息错误：', err.message);
            res.status(500).json({error: '查询采购订单信息错误'});
        } else {
            res.json(rows);
        }
    });
    closeDb(db);
});

// 获取单个采购订单信息
router.get('/purchases/:id', async (req, res) => {
    const db = await openDB();
    const query = 'SELECT * FROM purchase WHERE id = ?';
    db.get(query, [req.params.id], (err, row) => {
        if (err) {
            console.error('查询采购订单信息错误：', err.message);
            res.status(500).json({error: '查询采购订单信息错误'});
        } else {
            res.json(row);
        }
    });
    closeDb(db);
});

// 添加新的采购订单信息
router.post('/purchases', async (req, res) => {
    const {order_id, type, product_id, unit_price, purchase_quantity, plan_quantity, arrival_quantity, loss_quantity, order_date, plan_arrival_date,
        last_arrival_date, shipping_method, shipping_cost, other_cost, description} = req.body;
    const obj = {order_id, type, product_id, unit_price, purchase_quantity, plan_quantity, arrival_quantity, loss_quantity, order_date, plan_arrival_date,
        last_arrival_date, shipping_method, shipping_cost, other_cost, description, operator: req.headers['username']};
    const param = filer_invalid_field(obj)
    const checker = object_checker(param, {
        order_id_checker,
        type_checker,
        product_id_checker,
        unit_price_checker,
        purchase_quantity_checker,
        plan_quantity_checker,
        operator_checker
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
      INSERT INTO purchase (${keys}, created_at, updated_at)
      VALUES (${markers}, datetime('now'), datetime('now'))
    `;
    db.run(query, Object.values(param), function (err) {
        if (err) {
            console.error('添加采购订单信息错误：', err.message);
            res.status(500).json({error: '添加采购订单信息错误'});
        } else {
            res.json({id: this.lastID});
        }
    });
    closeDb(db);
});

router.post('/purchases/:id', async (req, res) => {
    // TODO
    const {order_id, type, product_id, unit_price, purchase_quantity, plan_quantity, arrival_quantity, loss_quantity, order_date, plan_arrival_date,
        last_arrival_date, shipping_method, shipping_cost, other_cost, description} = req.body;
    const obj = {order_id, type, product_id, unit_price, purchase_quantity, plan_quantity, arrival_quantity, loss_quantity, order_date, plan_arrival_date,
        last_arrival_date, shipping_method, shipping_cost, other_cost, description, operator: req.headers['username']};
    const param = filer_invalid_field(obj)
    const checker = object_checker(param, {
        order_id_checker,
        type_checker,
        product_id_checker,
        unit_price_checker,
        purchase_quantity_checker,
        plan_quantity_checker,
        operator_checker
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
        UPDATE purchase
        SET ${updateFields}, updated_at = datetime('now')
        WHERE id = ?
    `;

    const db = await openDB();
    db.run(query, values, function (err) {
        if (err) {
            console.error('更新采购订单信息错误：', err.message);
            res.status(500).json({error: '更新采购订单信息错误'});
        } else {
            res.json({rowsChanged: this.changes});
        }
    });
    closeDb(db);
});

// 删除采购订单信息
router.get('/purchases/delete/:id', async (req, res) => {
    const db = await openDB();
    const query = 'DELETE FROM purchase WHERE id = ?';
    db.run(query, [req.params.id], function (err) {
        if (err) {
            console.error('删除采购订单信息错误：', err.message);
            res.status(500).json({error: '删除采购订单信息错误'});
        } else {
            res.json({rowsChanged: this.changes});
        }
    });
    closeDb(db);
});

module.exports = router;