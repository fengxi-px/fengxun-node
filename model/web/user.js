const db = require("@/config/db");
const { DataTypes } = require("sequelize");

const User = db.define("user-web", {
  // 用户id
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, //设为主键，保证唯一性，不能重复
    autoIncrement: true,
  },
  // 昵称
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  // 密码
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // 头像
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = User;
