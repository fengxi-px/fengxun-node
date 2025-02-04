const db = require('@/config/db');
const { DataTypes } = require('sequelize');
const dayjs = require('dayjs');

const User = db.define('user-info', {
    // 用户id
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, //设为主键，保证唯一性，不能重复
        autoIncrement: true,
    },
    // 昵称
    nickname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // 头像
    avatar: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // 用户唯一标识
    openid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        // primaryKey: true,
    }
})

module.exports = User;