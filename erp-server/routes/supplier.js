const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { openDB, closeDb } = require('../db');
const { object_checker, filer_invalid_field } = require('../common');

const name_checker = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    other: Joi.any()
});

const address_checker = Joi.object({
    address: Joi.string().min(3).max(64).required()
});

const contact_name_checker = Joi.object({
    contact_name: Joi.string().min(3).max(30).required(),
});

const contact_email_checker = Joi.object({
    contact_email: Joi.string().email().required(),
});

const contact_phone_checker = Joi.object({
    contact_phone: Joi.string().pattern(/^[0-9]{6,15}$/).required(),
});


// 获取所有供应商信息
router.get('/suppliers', async (req, res) => {
    const db = await openDB();
    const query = 'SELECT * FROM supplier';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('查询供应商信息错误：', err.message);
            res.status(500).json({ error: '查询供应商信息错误' });
        } else {
            res.json(rows);
        }
    });
    closeDb(db);
});

// 获取单个供应商信息
router.get('/suppliers/:id', async (req, res) => {
    const db = await openDB();
    const query = 'SELECT * FROM supplier WHERE id = ?';
    db.get(query, [req.params.id], (err, row) => {
        if (err) {
            console.error('查询供应商信息错误：', err.message);
            res.status(500).json({ error: '查询供应商信息错误' });
        } else {
            res.json(row);
        }
    });
    closeDb(db);
});

// 添加新的供应商信息
router.post('/suppliers', async (req, res) => {
    const { name, address, contact_name, contact_email, contact_phone, other } = req.body;
    const obj = { name, address, contact_name, contact_email, contact_phone, other };
    const param = filer_invalid_field(obj)
    const checker = object_checker(param, { name_checker, address_checker, contact_name_checker, contact_email_checker, contact_phone_checker });
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
      INSERT INTO supplier (${keys}, created_at, updated_at)
      VALUES (${markers}, datetime('now'), datetime('now'))
    `;
    db.run(query, Object.values(param), function (err) {
        if (err) {
            console.error('添加供应商信息错误：', err.message);
            res.status(500).json({ error: '添加供应商信息错误' });
        } else {
            res.json({ id: this.lastID });
        }
    });
    closeDb(db);
});

// 更新供应商信息
router.post('/suppliers/:id', async (req, res) => {
    const { name, address, contact_name, contact_email, contact_phone, other } = req.body;
    const obj = { name, address, contact_name, contact_email, contact_phone, other };
    const param = filer_invalid_field(obj)
    const checker = object_checker(param, { name_checker, address_checker, contact_name_checker, contact_email_checker, contact_phone_checker });
    const validationResult = checker.validate(param);
    if (validationResult.error) {
        console.error('参数校验失败：', validationResult.error.details);
        res.status(400).json({ error: '参数校验失败' });
    }

    const updateFields = Object.keys(param).map(key => `${key} = ?`).join(', ');
    const values = Object.values(param);
    values.push(req.params.id);
    const query = `
        UPDATE supplier
        SET ${updateFields}, updated_at = datetime('now')
        WHERE id = ?
    `;

    const db = await openDB();
    db.run(query, values, function (err) {
        if (err) {
            console.error('更新供应商信息错误：', err.message);
            res.status(500).json({ error: '更新供应商信息错误' });
        } else {
            res.json({ rowsChanged: this.changes });
        }
    });
    closeDb(db);
});

// 删除供应商信息
router.get('/suppliers/delete/:id', async (req, res) => {
    const db = await openDB();
    const query = 'DELETE FROM supplier WHERE id = ?';
    db.run(query, [req.params.id], function (err) {
        if (err) {
            console.error('删除供应商信息错误：', err.message);
            res.status(500).json({ error: '删除供应商信息错误' });
        } else {
            res.json({ rowsChanged: this.changes });
        }
    });
    closeDb(db);
});

module.exports = router;
