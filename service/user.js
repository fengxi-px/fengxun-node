const { appid, secret, code2session } = require('@/config/default').weixin;
const qs = require('querystring');
const axios = require('axios');
const User = require('@/model/user');

class UserService {
    // 获取openid
    async getOpenid(code) {
        const params = qs.stringify({
            appid,
            secret,
            js_code: code,
            grant_type: 'authorization_code'
        });
        const res = await axios.get(`${code2session}?${params}`);
        if (res.data.errcode) {
            throw { msg: "获取code出错", code: 400, error: res.data }
        } else {
            return res.data.openid;
        }
    }
}

module.exports = UserService;