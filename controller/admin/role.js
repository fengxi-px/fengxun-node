const Validate = require('@/util/validate');
const Role = require('@/model/admin/role');

class RoleController {
    async addRole(ctx, next) {
        const { name, permission } = ctx.request.body;
        // 参数校验
        await Validate.emptyCheck(name, "请输入角色名称", "name");
        await Validate.emptyCheck(permission, "请输入角色权限", "permission");
        // 创建角色
        const role = await Role.create({ name, permission });
        const id = role.id;
        ctx.send({ id });
    }

    async getRoles(ctx, next) {
        const Roles = await Role.findAll();
        ctx.send(Roles);
    }

    async getRole(ctx, next) {
        const { id } = ctx.request.query;
        // 查询角色是否存在
        const roleInfo = await Role.findOne({ where: { id } });
        if (!roleInfo) {
            ctx.send("角色不存在");
            return;
        }
        ctx.send(roleInfo);
    }

    async updateRole(ctx, next) {
        const { id } = ctx.request.query;
        const { name, permission } = ctx.request.body;
        // 参数校验
        await Validate.emptyCheck(name, "请输入角色名称", "name");
        await Validate.emptyCheck(permission, "请输入角色权限", "permission");
        // 查询角色是否存在
        const roleInfo = await Role.findOne({ where: { id } });
        if (!roleInfo) {
            ctx.send("角色不存在");
            return;
        }
        // 更新角色信息
        await Role.update({ name, permission }, { where: { id } });
        ctx.send("更新成功");
    }

    async deleteRole(ctx, next) {
        const { id } = ctx.request.query;
        // 查询角色是否存在
        const roleInfo = await Role.findOne({ where: { id } });
        if (!roleInfo) {
            ctx.send("角色不存在");
            return;
        }
        // 删除角色
        await Role.destroy({ where: { id } });
        ctx.send("删除成功");
    }

    async findRoleByName(ctx, next) {
        const { name } = ctx.request.query;
        // 查询角色是否存在
        const roleInfo = await Role.findOne({ where: { name } });
        if (!roleInfo) {
            ctx.send("角色不存在");
            return;
        }
        ctx.send(roleInfo);
    }

    async findRoleById(ctx, next) {
        const { id } = ctx.request.query;
        // 查询角色是否存在
        const roleInfo = await Role.findOne({ where: { id } });
        if (!roleInfo) {
            ctx.send("角色不存在");
            return;
        }
        ctx.send(roleInfo);
    }

    async findRole(ctx, next) {
        const { id, name } = ctx.request.query;
        let whereClause = {};

        if (id) {
            whereClause.id = id;
        }
        if (name) {
            whereClause.name = name;
        }

        const roles = await Role.findAll({ where: whereClause });
        if (roles.length === 0) {
            ctx.send("角色不存在");
            return;
        }
        ctx.send(roles);
    }

}

module.exports = new RoleController;