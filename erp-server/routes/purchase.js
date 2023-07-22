const express = require('express');
const { body, validationResult } = require('express-validator');
const { openDB, closeDb } = require('../db');
const router = express.Router();
const _ = require('lodash');

const validateData = [
    body('name')
        .notEmpty().withMessage('用户名不能为空')
        .isLength({ min: 5 }).withMessage('用户名长度必须大于5')
]

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
router.post('/suppliers', validateData, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const db = await openDB();
    const { name, email, phone, source, address, contact_name, contact_email, contact_phone, other } = req.body;
    const query = `
      INSERT INTO supplier (name, email, phone, source, address, contact_name, contact_email, contact_phone, other, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `;
    db.run(query, [name, email, phone, source, address, contact_name, contact_email, contact_phone, other], function (err) {
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
router.post('/suppliers/:id', validateData, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // 过滤掉未定义的字段，并且忽略ID字段
    const supplierData = _.pickBy(req.body, (value, key) => key !== 'id' && !_.isUndefined(value));
    const updateFields = Object.keys(supplierData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(supplierData);
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
router.get('/suppliers/:id', async (req, res) => {
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
