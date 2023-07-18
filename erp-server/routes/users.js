const express = require('express');
const router = express.Router();
const sqlExec = require('../db').sqlExec;

// 获取所有用户
router.get('/users', (req, res) => {
    sqlExec((db) => {
        // 执行数据库操作
        db.all('SELECT * FROM users', (err, rows) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.json(rows);
            }
        });
    });
})

// 获取特定用户
router.get('/users/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM users WHERE id = ?', id, (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});

// 创建用户
router.post('/users', (req, res) => {
    const { name, password } = req.body;
    db.run('INSERT INTO users (name, password) VALUES (?, ?)', [name, password], function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ id: this.lastID });
        }
    });
});

// 更新用户
router.post('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, password } = req.body;
    db.run('UPDATE users SET name = ?, password = ? WHERE id = ?', [name, password, id], function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (this.changes > 0) {
            res.sendStatus(200);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});

// 删除用户
router.get('/users/delete/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM users WHERE id = ?', id, function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (this.changes > 0) {
            res.sendStatus(200);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});
module.exports = router;