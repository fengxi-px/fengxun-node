const Validate = require("@/util/validate");
const User = require("@/model/admin/user");
const generateToken = require("@/config/jwt");
const Role = require("@/model/admin/role");
const File = require("@/model/admin/file");

class UserController {
  async login(ctx, next) {
    const { nickname, email, password } = ctx.request.body;
    let id = -1;
    // 参数校验
    await Validate.emptyCheck(nickname, "请输入昵称", "nickname");
    await Validate.emptyCheck(email, "请输入邮箱", "email");
    await Validate.emptyCheck(password, "请输入密码", "password");

    // 查询用户是否存在
    const userInfo = await User.findOne({ where: { email } });
    if (!userInfo) {
      // 创建用户
      console.log("创建用户");
      const newUser = await User.create({
        nickname,
        email,
        password,
        role: "default user",
        avatar:
          "https://kecheng-chabaidao.oss-cn-hangzhou.aliyuncs.com/kecheng/1736844800237248.jpeg",
      });
      id = newUser.id;
      const { role, avatar } = newUser;
      ctx.send({
        token: generateToken(email),
        nickname,
        id,
        email,
        role,
        avatar,
      });
      return;
    }
    if (userInfo.password === password && userInfo.nickname === nickname) {
      id = userInfo.id;
      const { role, avatar } = userInfo;
      const roleInfo = await Role.findOne({ where: { name: role } });
      ctx.send({
        token: generateToken(email),
        nickname,
        id,
        email,
        role,
        avatar,
        permissions: roleInfo.permission,
      });
      return;
    }
    ctx.send("密码错误");
  }

  async getUserInfo(ctx, next) {
    const { id } = ctx.request.query;
    // 参数校验
    await Validate.emptyCheck(id, "请输入ID", "useId");

    // 查询用户是否存在
    const userInfo = await User.findOne({ where: { id } });
    const { nickname, role, avatar, email } = userInfo;
    const roleInfo = await Role.findOne({ where: { name: role } });
    // console.log(roleInfo, "roleInfo.permission", role, id);
    ctx.send({
      token: generateToken(email),
      nickname,
      id,
      email,
      role,
      avatar,
      permissions: roleInfo.permission,
    });
    return;
  }

  async getUsers(ctx, next) {
    const Users = await User.findAll();
    ctx.send(Users);
  }

  async update(ctx, next) {
    const { id } = ctx.request.query;
    const { nickname, avatar, role, email, phone } = ctx.request.body;
    // 参数校验
    await Validate.emptyCheck(nickname, "请输入昵称", "nickname");
    await Validate.emptyCheck(email, "请输入邮箱", "email");
    await Validate.emptyCheck(role, "请输入角色", "role");
    await Validate.emptyCheck(avatar, "请输入头像", "avatar");

    // 查询用户是否存在
    const userInfo = await User.findOne({ where: { id } });
    if (!userInfo) {
      ctx.send("用户不存在");
      return;
    }
    // 更新用户信息
    await User.update(
      { nickname, avatar, role, email, phone },
      { where: { id } }
    );
    ctx.send("更新成功");
  }

  async delete(ctx, next) {
    const { id } = ctx.request.query;
    // 查询用户是否存在
    const userInfo = await User.findOne({ where: { id } });
    if (!userInfo) {
      ctx.send("用户不存在");
      return;
    }
    // 删除用户
    await User.destroy({ where: { id } });
    ctx.send("删除成功");
  }

  async findUserByName(ctx, next) {
    const { nickname } = ctx.request.query;
    // 查询用户是否存在
    const userInfo = await User.findOne({ where: { nickname } });
    if (!userInfo) {
      ctx.send("用户不存在");
      return;
    }
    ctx.send(userInfo);
  }

  async findUserById(ctx, next) {
    const { id } = ctx.request.query;
    // 查询用户是否存在
    let userInfo = await User.findOne({ where: { id } });
    if (!userInfo) {
      ctx.send("用户不存在");
      return;
    }
    ctx.send(userInfo);
  }

  async findUser(ctx, next) {
    const { id, nickname } = ctx.request.query;
    let whereClause = {};

    if (id) {
      whereClause.id = id;
    }
    if (nickname) {
      whereClause.nickname = nickname;
    }

    const users = await User.findAll({ where: whereClause });
    if (users.length === 0) {
      ctx.send("用户不存在");
      return;
    }
    ctx.send(users);
  }

  async addFile(ctx, next) {
    const { name, url, owner } = ctx.request.body;
    // 参数校验
    await Validate.emptyCheck(name, "请输入文件名", "name");
    await Validate.emptyCheck(url, "请输入文件路径", "url");
    await Validate.emptyCheck(owner, "请输入文件拥有者", "owner");

    // 创建文件
    await File.create({ name, url, owner });
    ctx.send("创建成功");
  }
  
  async getFilesByOwner(ctx, next) {
    const { owner } = ctx.request.query;
    // 参数校验
    await Validate.emptyCheck(owner, "请输入文件拥有者", "owner");

    // 查询文件
    const files = await File.findAll({ where: { owner } });
    if (files.length === 0) {
      ctx.send("文件不存在");
      return;
    }
    ctx.send(files);
  }

  async deleteFile(ctx, next) {
    const { id } = ctx.request.query;
    // 查询文件是否存在
    const fileInfo = await File.findOne({ where: { id } });
    if (!fileInfo) {
      ctx.send("文件不存在");
      return;
    }
    // 删除文件
    await File.destroy({ where: { id } });
    ctx.send("删除成功");
  }

}

module.exports = new UserController();
