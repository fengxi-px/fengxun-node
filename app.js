// 引入 Koa 框架和相关中间件
const koa = require("koa"); // Koa 框架，用于创建 HTTP 服务器
const json = require("koa-json"); // 解析并格式化响应为 JSON
const bodyParser = require("koa-bodyparser"); // 解析请求体中的数据（如 JSON 或表单数据）
const cors = require("@koa/cors"); // 处理跨域资源共享（CORS）

const KoaRedis = require("ioredis");

// 配置别名
const { addAliases } = require("module-alias");
addAliases({
  "@": __dirname,
});

const router = require("@/router"); // 引入路由模块

// 统一接口响应数据格式:中间件
const responseHandler = require("@/config/response");

// 捕获错误中间件
const errorHandler = require("@/config/errorhandler");

// 创建 Koa 应用实例
const app = new koa();

// 注册 CORS 中间件，允许跨域请求
app.use(cors());

// 注册 JSON 中间件，将响应格式化为 JSON 格式
app.use(json());

// 注册 BodyParser 中间件，解析请求体
app.use(bodyParser());

app.use(responseHandler);
app.use(errorHandler);

// 链接redis
const redisClient = new KoaRedis({
  port: 6379,
  host: "127.0.0.1",
});
// const { port, host, password } = require("@/config/default").redisInfo;
// const redisClient = new KoaRedis({
//   port,
//   host,
//   password,
// });

// 将redis注册进中间件
app.use(async (ctx, next) => {
  ctx.redis = redisClient;
  await next();
});

// 将路由注册到 Koa 应用上
app.use(router.routes()).use(router.allowedMethods());

// 启动 Koa 应用，监听 3000 端口
app.listen(3000, () => {
  // 当服务器启动成功时，输出日志到控制台
  console.log("Server is running on port 3000");
});
