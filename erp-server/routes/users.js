const express = require('express');
const router = express.Router();
const sqlExec = require('../db').sqlExec;
const jwt = require('jsonwebtoken');


// 查询用户权限的资源信息
function queryUserPermissions(db, userName, callback) {
    const query = `
      SELECT resource.* 
      FROM user
      JOIN user_role ON user.name = user_role.user_name
      JOIN role ON user_role.role_name = role.name
      JOIN permission ON role.name = permission.role_name
      JOIN resource ON permission.resource_id = resource.id
      WHERE user.name = ?
    `;

    db.all(query, [userName], (err, rows) => {
        if (err) {
            callback(err);
            return;
        }

        // 将parent_id翻译成嵌套JSON
        const resources = buildNestedJSON(rows);
        callback(null, resources);
    });
}

// 递归构建嵌套JSON
function buildNestedJSON(rows, parentId = null) {
    const result = [];

    rows.forEach(row => {
        if (row.parent_id === parentId) {
            const resource = {
                id: row.id,
                name: row.name,
                title: row.title,
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

router.get('/user/:name/permission', (req, res) => {
    const { name } = req.params;
    sqlExec((db) => {
        queryUserPermissions(db, name, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.json(result);
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