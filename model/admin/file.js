const db = require('@/config/db');
const { DataTypes } = require('sequelize');

const File = db.define('file-admin', {
    // 文件id
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, //设为主键，保证唯一性，不能重复
        autoIncrement: true,
    },
    // 文件名
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // 文件路径
    url:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    // 文件拥有者
    owner:{
        type: DataTypes.STRING,
        allowNull: false,
    }
})

module.exports = File;