const express = require('express');
const router = express.Router();
const sqlExec = require('../db').sqlExec;
const jwt = require('jsonwebtoken');

// 递归构建嵌套JSON
function buildNestedJSON(rows, parentId = null) {
    const result = [];

    rows.forEach(row => {
        if (row.parent_id === parentId) {
            const resource = {
                id: row.id,
                icon: row.icon,
                name: row.name,
                label: row.label,
                type: row.type,
                url: row.url,
                children: buildNestedJSON(rows, row.id)
            };

            result.push(resource);
        }
    });

    return result;
}

router.post('/login', (req, res) => {
    const { name, password } = req.body;
    const secretKey = name; // 自定义的秘钥，用于签名令牌

    // 在真实应用中，应该根据用户名查询数据库验证密码
    sqlExec(db => {
        db.get('SELECT * FROM user WHERE name = ?', name, (err, row) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            if (row && row.name === name && row.password === password) {
                const token = jwt.sign({ name, password }, secretKey, { expiresIn: '1h' });
                res.json({ token });
                return;
            }

            res.status(401).json({ message: 'Invalid credentials.' });
        });
    })
});


router.get('/role/list', (req, res) => {
    sqlExec((db) => {
        db.all('SELECT role.* from role', (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            res.json(result);
        })
    });
});


router.get('/resource/list', (req, res) => {
    sqlExec((db) => {
        db.all('SELECT resource.* from resource', (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
                return
            }

            // 将parent_id翻译成嵌套JSON
            const resources = buildNestedJSON(result);
            res.json(resources);
        })
    });
});

router.get('/user/:name/permission', (req, res) => {
    const { name } = req.params;
    const query = `
        SELECT DISTINCT p.resource_id
        FROM user_role ur
        JOIN permission p ON ur.role_name = p.role_name
        WHERE ur.user_name = ?
    `;
    sqlExec((db) => {
        db.all(query, name, (err, result) => {

            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.json(result.map(item => item.resource_id));
            }
        })
    });
});


router.get('/role/:name/permission', (req, res) => {
    const { name } = req.params;
    const query = `
        SELECT DISTINCT resource_id
        FROM permission 
        WHERE role_name = ?
    `;
    sqlExec((db) => {
        db.all(query, name, (err, result) => {

            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.json(result.map(item => item.resource_id));
            }
        })
    });
});

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