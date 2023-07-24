const express = require('express');
const { body, validationResult } = require('express-validator');
const { openDB, closeDb } = require('../db');
const router = express.Router();


// 查询列表接口
router.get('/products', async (req, res) => {
    const db = await openDB();
    db.all('SELECT * FROM product', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
    closeDb(db);
});

// 按ID查询接口
router.get('/products/:id', async (req, res) => {
    const db = await openDB();
    const productId = req.params.id;

    db.get('SELECT * FROM product WHERE id = ?', [productId], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    });
    closeDb(db);
});

// 新增接口
router.post('/products', async (req, res) => {
    const db = await openDB();
    const { name, model, standard, supplier_name, purchase_price, sales_price } = req.body;

    if (!name || !model || !standard || !supplier_name || !purchase_price || !sales_price) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    db.run(
        `INSERT INTO product (name, model, standard, supplier_name, purchase_price, sales_price, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
        [name, model, standard, supplier_name, purchase_price, sales_price],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ id: this.lastID });
            }
        }
    );
    closeDb(db);
});

// 更新接口
router.post('/products/:id', async (req, res) => {
    const db = await openDB();
    const productId = req.params.id;
    const { name, model, standard, supplier_name, purchase_price, sales_price } = req.body;

    if (!name || !model || !standard || !supplier_name || !purchase_price || !sales_price) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    db.run(
        `UPDATE product SET name=?, model=?, standard=?, supplier_name=?, purchase_price=?, sales_price=?, updated_at=datetime('now') WHERE id=?`,
        [name, model, standard, supplier_name, purchase_price, sales_price, productId],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'Product updated successfully' });
            }
        }
    );
    closeDb(db);
});

// 删除接口
router.get('/products/delete/:id', async (req, res) => {
    const db = await openDB();
    const productId = req.params.id;

    db.run(`DELETE FROM product WHERE id=?`, [productId], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Product deleted successfully' });
        }
    });
    closeDb(db);
});

module.exports = router;