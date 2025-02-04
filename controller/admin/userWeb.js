const Validate = require("@/util/validate");
const User = require("@/model/web/user");
const { Op } = require("sequelize");

class UserWebController {
  async getUsers(ctx, next) {
    const Users = await User.findAll();
    ctx.send(Users);
  }

  async updateUser(ctx, next) {
    const { id } = ctx.request.query;
    const { email, avatar, createdAt, updatedAt } = ctx.request.body;
    // 参数校验
    await Validate.emptyCheck(email, "请输入邮箱", "email");
    await Validate.emptyCheck(avatar, "请输入头像", "avatar");
    await Validate.emptyCheck(createdAt, "请输入创建时间", "created");
    await Validate.emptyCheck(updatedAt, "请输入更新时间", "updated");

    // 查询用户是否存在
    const userInfo = await User.findOne({ where: { id } });
    if (!userInfo) {
      ctx.send("用户不存在");
      return;
    }
    // 查询邮箱是否存在
    const emailInfo = await User.findOne({ where: { email } });
    if (emailInfo) {
      ctx.send("邮箱已存在");
      return;
    }
    // 更新用户信息
    await User.update(
      { email, avatar, createdAt, updatedAt },
      { where: { id } }
    );
    ctx.send("更新成功");
  }

  async deleteUser(ctx, next) {
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

  async findUserByEmail(ctx, next) {
    const { email } = ctx.request.query;
    // 查询用户是否存在
    const userInfo = await User.findAll({ where: { email } });
    if (!userInfo) {
      ctx.send("用户不存在");
      return;
    }
    ctx.send(userInfo);
  }

  async findUserById(ctx, next) {
    const { id } = ctx.request.query;
    // 查询用户是否存在
    const userInfo = await User.findAll({ where: { id } });
    if (!userInfo) {
      ctx.send("用户不存在");
      return;
    }
    ctx.send(userInfo);
  }

  async findUserByTime(ctx, next) {
    const { startTime, endTime } = ctx.request.query;
    // 查询用户是否存在
    const users = await User.findAll({
      where: {
        createdAt: {
          [Op.between]: [
            new Date(new Date(startTime).setHours(0, 0, 0, 0)),
            new Date(new Date(endTime).setHours(23, 59, 59, 999)),
          ],
        },
      },
    });
    if (users.length === 0) {
      ctx.send("用户不存在");
      return;
    }
    ctx.send(users);
  }

  async findUser(ctx, next) {
    const { id, email, startTime, endTime } = ctx.request.query;
    console.log(id, email, startTime, endTime, "id, email, startTime, endTime");
    let whereClause = {};

    if (id) {
      whereClause.id = id;
    }
    if (email) {
      whereClause.email = email;
    }
    if (startTime && endTime) {
      console.log(startTime, endTime);
      whereClause.createdAt = {
        [Op.between]: [
          new Date(new Date(startTime).setHours(0, 0, 0, 0)),
          new Date(new Date(endTime).setHours(23, 59, 59, 999)),
        ],
      };
    }

    const users = await User.findAll({ where: whereClause });
    if (users.length === 0) {
      ctx.send("用户不存在");
      return;
    }
    ctx.send(users);
  }

  async getRecords(ctx, next) {
    const { id } = ctx.request.query;
    // 用户openid
    const user = await User.findOne({ where: { id } });
    const email = user.email;

    const key = `chat:${email}`;
    const sessionIds = await ctx.redis.zrevrange(key, 0, -1);
    let records = new Map();
    for (const itemids of sessionIds) {
      const id =
        itemids.substring(0, 4) +
        "-" +
        itemids.substring(4, 6) +
        "-" +
        itemids.substring(6, 8);
      if (!records.has(id)) {
        records.set(id, 1);
      } else {
        records.set(id, records.get(id) + 1);
      }
    }
    ctx.send(Object.fromEntries(records));
  }
}

module.exports = new UserWebController();
