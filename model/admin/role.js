const db = require('@/config/db');
const { DataTypes } = require('sequelize');

const Role = db.define('role-admin', {
    // 角色id
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, //设为主键，保证唯一性，不能重复
        autoIncrement: true,
    },
    // 角色名称
    name: {
        type: DataTypes.STRING,
        unique: true, //设为唯一，保证唯一性，不能重复
        allowNull: false,
    },
    // 角色权限
    permission: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

module.exports = Role;