const { Sequelize } = require('sequelize');
const { database, userName, password, host } = require('./default').db;

const db = new Sequelize(database, userName, password, {
    host,
    dialect: 'mysql',
    logging: false,
    define: {
        freezeTableName: true, // 防止修改表名为复数
        // timestamps: false, // 防止自动添加时间戳
    },
    timezone: '+08:00', // 东八时区
    sync: {
        // 是否强制同步
        force: false, // 不会强制删除现有表并且重新创建
    },
});

db.sync(); //如果表不存在，就创建表，（如果已经存在，不执行任何操作）
module.exports = db;