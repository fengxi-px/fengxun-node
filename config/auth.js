const basicAuth = require('basic-auth');
var jwt = require("jsonwebtoken");
const { secretkey } = require('./default').userToken;

const authority = async (ctx, next) => {
    // 获取token
    const userToken = basicAuth(ctx.req);
    if (!userToken || !userToken.name) {
        throw { msg: "没有登陆, 没有访问权限", code: 401 };
    }
    try {
        // 解析token
        var decode = jwt.verify(userToken.name, secretkey);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw { msg: "token已过期，请重新登录", code: 401 };
        }
        throw { msg: "没有访问权限", code: 401 };
    }
    ctx.auth = {
        uid: decode.uid,
    };
    await next();
}

module.exports = authority;