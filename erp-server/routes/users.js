const express = require('express');
const router = express.Router();
const sqlExec = require('../db').sqlExec;
const jwt = require('jsonwebtoken');

function toNumArray(str) {
    const numberArray = str.split(',')
        .map((item) => item.trim())
        .filter((item) => item !== '')
        .map((item) => Number(item))
        .filter((item) => !isNaN(item));

    return numberArray;
}

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
                res.json(toNumArray(result[0].resource_id));
            }
        })
    });
});


router.post('/role/:name', (req, res) => {
    console.log(req.body)
    const { name } = req.params;
    const { permissions } = req.body;

    if (!name || !permissions) {
        return res.status(400).json({ error: 'Invalid Params.' });
    }

    const permiss = toNumArray(permissions).join(',')
    const query = 'update permission set resource_id = ? where role_name = ?';

    sqlExec((db) => {
        db.all(query, [permiss, name], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.json('Update Role Permission Success');
            }
        })
    });
})

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
                res.json(toNumArray(result[0]?.resource_id));
            }
        })
    });
});

// 获取所有用户
router.get('/user/list', (req, res) => {
    sqlExec((db) => {
        // 执行数据库操作
        db.all('SELECT user.id,user.name,user.phone,user.email,user_role.role_name as role FROM user left join user_role on user.name = user_role.user_name', (err, rows) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.json(rows);
            }
        });
    });
})

// 创建用户
router.post('/user', (req, res) => {
    const { name, phone, email, password, role } = req.body;
    console.log(req.body)
    if (!name || !password || !role) {
        return res.status(400).json({ error: 'Invalid Params.' });
    }

    sqlExec((db) => {
        db.run('INSERT INTO user (name, phone, email, password) VALUES (?, ?, ?, ?)',
            [name, phone, email, password], function (err) {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    sqlExec((db) => {
                        db.run('INSERT INTO user_role(user_name,role_name) values(?,?)',
                            [name, role], function (err) {
                                if (err) {
                                } else {
                                    res.status(200).json({ error: 'Create User Success' });
                                }
                            })
                    })
                }
            })
    });
});

// 更新用户
router.post('/user/:name', (req, res) => {
    console.log(req.body)
    const { name } = req.params;
    const { phone, email, password, image, role } = req.body;

    if (!name) {
        res.status(400).json({ error: 'User Must Be Not NULL.' });
        return;
    }

    let setStr = "";
    if (phone) {
        setStr = `phone = '${phone}',`
    }
    if (email) {
        setStr += `email = '${email}',`
    }
    if (password) {
        setStr += `password = '${password}',`
    }
    if (image) {
        setStr += `image = '${image}',`
    }
    let userSql = '';
    if (setStr) {
        setStr = setStr.slice(0, -1)
        userSql = `UPDATE user SET ${setStr} where name = '${name}';`;
    }

    let roleSql = ''
    if (role) {
        roleSql = `update user_role set role_name = '${role}' where user_name = '${name}';`;
    }

    const query = userSql + roleSql;
    if (!query) {
        res.status(400).json({ error: 'Invalid Parameter' });
        return;
    }

    console.log(query)

    sqlExec((db) => {
        db.exec(query, function (err) {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.status(200).json({ error: 'Update User Success.' });
            }
        });
    });
});

// 删除用户
router.get('/user/delete/:name', (req, res) => {
    const { name } = req.params;
    sqlExec((db) => {
        db.exec(`DELETE FROM user WHERE name = '${name}'; delete from user_role where user_name = '${name}'`, function (err) {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.sendStatus(200).json({ error: 'Delete User Success.' });
            }
        });
    });
});

module.exports = router;