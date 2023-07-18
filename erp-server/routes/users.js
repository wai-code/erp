const express = require('express');
const router = express.Router();
const sqlExec = require('../db').sqlExec;

// 获取所有用户
router.get('/user/list', (req, res) => {
    sqlExec((db) => {
        // 执行数据库操作
        db.all('SELECT * FROM user', (err, rows) => {
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
router.get('/user/:id', (req, res) => {
    const { id } = req.params;
    sqlExec((db) => {
        db.get('SELECT * FROM user WHERE id = ?', id, (err, row) => {
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
});

// 创建用户
router.post('/user', (req, res) => {
    const { name, phone, email, password, image } = req.body;

    sqlExec((db) => {
        db.run('INSERT INTO user (name, phone, email, password, image) VALUES (?, ?, ?, ?, ?)',
            [name, phone, email, password, image], function (err) {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    res.json({ id: this.lastID });
                }
            });
    });
});
// 更新用户
router.post('/user/:id', (req, res) => {
    const { id } = req.params;
    const { name, phone, email, password, image } = req.body;
    sqlExec((db) => {
        db.run('UPDATE user SET name = ?, phone = ?, email = ?, password = ?, image = ?,  WHERE id = ?',
            [name, phone, email, password, image, id], function (err) {
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
});
// 删除用户
router.get('/user/delete/:id', (req, res) => {
    const { id } = req.params;
    sqlExec((db) => {
        db.run('DELETE FROM user WHERE id = ?', id, function (err) {
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
});
module.exports = router;