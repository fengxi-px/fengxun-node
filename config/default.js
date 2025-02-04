module.exports = {
  // mysql配置
  // db: {
  //   database: "fengxun",
  //   userName: "fengxun",
  //   password: "H26iKkRJSNipZd6K",
  //   host: "47.76.36.248",
  // },
  db: {
    database: "fengxun",
    userName: "root",
    password: "px1120040806",
    host: "localhost",
  },
  // 小程序配置
  weixin: {
    appid: "wx18599d3f74609799",
    secret: "326b76c544a5b714da7b3b76afac1520",
    code2session: "https://api.weixin.qq.com/sns/jscode2session",
  },
  // 智谱清言配置
  zhipu: {
    apiKey: "a0d9368f791741b9aec663bdc94a79e8.Uy6lLXWjk0rK3lwI",
  },
  // 阿里云
  aliyun: {
    accessKeyID: "LTAI5tFg1a9TFoFKoshQHTXi",
    accessKeySecret: "iQS9IGUDtDh8poUtJX6YlYChHNF5o1",
  },
  // 登录token签名和有效期
  userToken: {
    secretkey: "dhvgdfytrytuui687990",
    expiresIn: 60 * 60 * 24 * 100,
  },
  // redis
  redisInfo: {
    port: 6379,
    host: "47.76.36.248",
    password: "123456",
  },
};
