function responseInterceptor(req, res, next) {
    // 拦截和处理所有的响应
    res.intercept = function (data) {
        const formattedResponse = {
            status: 'success',
            data: data
        };
        res.json(formattedResponse);
    };

    // 调用下一个中间件
    next();
}

module.exports = responseInterceptor;
