const logger = require('@/loggerMiddleware');

// 捕获错误中间件
const errorHandler = async (ctx, next) => {
    try {
        await next();
    } catch (errorData) {
        logger.error("捕获到异常错误", errorData);
        console.log(errorData);

        // 接收参数校验的错误
        if (errorData.code) {
            const { code, msg, error } = errorData;
            const errorVal = error || null;
            ctx.send(null, code, msg, errorVal);
        } else if (errorData.error) {
            const { message, code } = errorData.error;
            ctx.send(null, 200, 'SUCCESS', message, code);
        } else {
            const error = errorData.message || "异常错误,请查看服务器端日志";
            const status = errorData.status || errorData.statusCode || 500;
            ctx.send(null, status, "服务器端异常错误", error);
        }
    }
}

module.exports = errorHandler;