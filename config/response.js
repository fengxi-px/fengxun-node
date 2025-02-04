// 统一接口响应数据格式
const responseHandler = async (ctx, next) => {
    ctx.send = (data = null, code = 200, msg = 'SUCCESS', error = null, serviceCode = 0) => {
        ctx.body = {
            data, // 返回前端的数据
            msg, //提示
            error, // 错误信息
            serviceCode //业务状态码
        };
        ctx.status = code;
    }
    await next();
};
module.exports = responseHandler;