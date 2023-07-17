const whitelist = [
    '/api/public', // 白名单中的 URL，无需校验用户登录信息
    '/api/other-public'
];

function authInterceptor(req, res, next) {
    if (isInWhitelist(req.url)) {
        // URL 在白名单中，跳过校验，继续处理下一个中间件
        next();
    } else {
        // URL 不在白名单中，执行用户登录校验逻辑
        const isLoggedIn = checkUserLoggedIn(req);

        if (isLoggedIn) {
            // 用户已登录，继续处理下一个中间件
            next();
        } else {
            // 用户未登录，返回未授权的响应
            res.status(401).json({ error: 'Unauthorized' });
        }
    }
}

function isInWhitelist(url) {
    // 判断 URL 是否在白名单中
    return whitelist.includes(url);
}

function checkUserLoggedIn(req) {
    // 校验用户登陆信息
    return true;
}


module.exports = authInterceptor;
