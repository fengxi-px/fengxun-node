const Validate = require("@/util/validate");
const User = require("@/model/web/user");
const generateToken = require("@/config/jwt");

class UserController {
  async login(ctx, next) {
    let id = -1;
    const { email, password } = ctx.request.body;
    // 参数校验
    await Validate.emptyCheck(email, "请输入邮箱", "email");
    await Validate.emptyCheck(password, "请输入密码", "password");
    // 查询用户是否存在
    const userInfo = await User.findOne({ where: { email } });
    if (!userInfo) {
      // 创建用户
      const newUser = await User.create({
        email,
        password,
        avatar:
          "https://kecheng-chabaidao.oss-cn-hangzhou.aliyuncs.com/kecheng/1736844800237248.jpeg",
      });
      id = newUser.id;
      ctx.send({
        token: generateToken(email),
        id,
        email,
        avatar,
      });
      return;
    }
    if (userInfo.password === password && userInfo.email === email) {
      id = userInfo.id;
      const { avatar } = userInfo;
      ctx.send({ token: generateToken(email), id, email, avatar });
      return;
    }
    ctx.send("密码错误");
  }
}

module.exports = new UserController();
