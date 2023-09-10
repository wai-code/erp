const { secretKey } = require('../config')
const jwt = require('jsonwebtoken');

const whitelist = [
    '/api/login'
];

function authInterceptor(req, res, next) {
    if (isInWhitelist(req.url)) {
        // URL 在白名单中，跳过校验，继续处理下一个中间件
        next();
    } else {
        // URL 不在白名单中，执行用户登录校验逻辑
        checkToken(req, res, next);
    }
}

function isInWhitelist(url) {
    // 判断 URL 是否在白名单中
    return whitelist.includes(url);
}

function checkToken(req, res, next) {
    const token = req.header('token');

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }

        req.headers['username'] =  decoded.username;
        next()
    });
}


module.exports = authInterceptor;
