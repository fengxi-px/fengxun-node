const Validate = require('@/util/validate');
const User = require('@/model/user');
const { Op } = require('sequelize');

class UserWXController {
    async getUsers(ctx, next) {
        const Users = await User.findAll();
        ctx.send(Users);
    }

    async updateUser(ctx, next) {
        const { id } = ctx.request.query;
        const { nickname, avatar, createdAt, updatedAt } = ctx.request.body;
        // 参数校验
        await Validate.emptyCheck(nickname, "请输入昵称", "nickname");
        await Validate.emptyCheck(avatar, "请输入头像", "avatar");
        await Validate.emptyCheck(createdAt, "请输入创建时间", "created");
        await Validate.emptyCheck(updatedAt, "请输入更新时间", "updated");

        // 查询用户是否存在
        const userInfo = await User.findOne({ where: { id } });
        if (!userInfo) {
            ctx.send("用户不存在");
            return;
        }
        // 更新用户信息
        await User.update({ nickname, avatar, createdAt, updatedAt }, { where: { id } });
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

    async findUserByName(ctx, next) {
        const { nickname } = ctx.request.query;
        // 查询用户是否存在
        const userInfo = await User.findAll({ where: { nickname } });
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
                    [Op.between]: [new Date(new Date(startTime).setHours(0, 0, 0, 0)), new Date(new Date(endTime).setHours(23, 59, 59, 999))]
                }
            }
        });
        if (users.length === 0) {
            ctx.send("用户不存在");
            return;
        }
        ctx.send(users);
    }

    async findUser(ctx, next) {
        const { id, nickname, startTime, endTime } = ctx.request.query;
        let whereClause = {};

        if (id) {
            whereClause.id = id;
        }
        if (nickname) {
            whereClause.nickname = nickname;
        }
        if (startTime && endTime) {
            whereClause.createdAt = {
                [Op.between]: [new Date(new Date(startTime).setHours(0, 0, 0, 0)), new Date(new Date(endTime).setHours(23, 59, 59, 999))]
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
        const openid = user.openid;

        const key = `chat:${openid}`;
        const sessionIds = await ctx.redis.zrevrange(key, 0, -1);
        let records = new Map();
        for (const itemids of sessionIds) {
            const id = itemids.substring(0, 4) + '-' + itemids.substring(4, 6) + '-' + itemids.substring(6, 8);
            if (!records.has(id)) {
                records.set(id, 1);
            } else {
                records.set(id, records.get(id) + 1);
            }
        }
        ctx.send(Object.fromEntries(records));
    }
}

module.exports = new UserWXController();