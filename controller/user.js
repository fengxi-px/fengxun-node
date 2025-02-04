const Validate = require("@/util/validate");
const User = require("@/model/user");
const UserService = require("@/service/user");
const generateToken = require("@/config/jwt");

class UserController {
  async login(ctx, next) {
    const { nickName, avatar, code } = ctx.request.body;
    // 参数校验
    await Validate.emptyCheck(nickName, "请输入昵称", "nickName");
    await Validate.emptyCheck(avatar, "请上传头像", "avatar");
    await Validate.emptyCheck(code, "缺少code", "code");
    console.log(nickName, avatar, code);
    // 获取openid
    const openid = await new UserService().getOpenid(code);
    // 查询用户是否存在
    const userInfo = await User.findOne({ where: { openid } });
    if (!userInfo) {
      // 创建用户
      console.log("创建用户");
      await User.create({ openid, nickname: nickName, avatar });
    }
    console.log(openid, "openid");
    ctx.send({ token: generateToken(openid), nickName, avatar });
  }
}

module.exports = new UserController();
