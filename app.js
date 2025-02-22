// 引入 Koa 框架和相关中间件
const koa = require("koa"); // Koa 框架，用于创建 HTTP 服务器
const json = require("koa-json"); // 解析并格式化响应为 JSON
const bodyParser = require("koa-bodyparser"); // 解析请求体中的数据（如 JSON 或表单数据）
const cors = require("@koa/cors"); // 处理跨域资源共享（CORS）
const k2c = require("koa2-connect");
const { createProxyMiddleware } = require("http-proxy-middleware"); // 正确引入代理中间件

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
// app.use(cors());
app.use(
  cors({
    origin: "*", // 允许所有来源
    allowMethods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"], // 允许的 HTTP 方法
    allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // 允许的请求头
  })
);

app.use(async (ctx, next) => {
  if (ctx.url.startsWith("/proxy")) {
    ctx.respond = false;
    await k2c(
      createProxyMiddleware({
        target:
          "https://imgbed.yiyunt.cn/api/upload/093310ae6d0a7c006cf5285016de7f03",
        changeOrigin: true,
      })
    )(ctx, next);
  }
  await next();
});

// 注册代理中间件
// app.use(async (ctx, next) => {
//   if (ctx.path.startsWith("/proxy")) {
//     console.log("Proxying request...");
//     console.log("Original Request Path:", ctx.path);
//     console.log("Full Request URL:", `http://${ctx.host}${ctx.url}`);

//     // 构建目标 URL
//     const targetUrl = `https://imgbed.yiyunt.cn${ctx.url.replace(
//       /^\/proxy/,
//       ""
//     )}`;
//     console.log("Target URL for Proxy:", targetUrl);

//     // 使用 http-proxy 进行代理
//     proxy.web(
//       ctx.req,
//       ctx.res,
//       {
//         target: "https://imgbed.yiyunt.cn", // 目标服务器的地址
//         changeOrigin: true, // 修改请求头中的 Origin 字段
//         pathRewrite: {
//           "^/proxy": "", // 去掉 /proxy 前缀
//         },
//       },
//       (error) => {
//         if (error) {
//           console.error("Proxy Error:", error);
//           ctx.status = 500;
//           ctx.body = "Proxying failed";
//         }
//       }
//     );

//     // 代理处理后，立即返回，不继续传递给下一个中间件
//     return;
//   }
//   await next(); // 如果路径不是 /proxy 开头的，则继续执行其他路由
// });

// 注册 JSON 中间件，将响应格式化为 JSON 格式
app.use(json());

// 注册 BodyParser 中间件，解析请求体
app.use(bodyParser());

app.use(responseHandler);
app.use(errorHandler);

// 链接redis
// const redisClient = new KoaRedis({
//   port: 6379,
//   host: "127.0.0.1",
// });
const { port, host, password } = require("@/config/default").redisInfo;
const redisClient = new KoaRedis({
  port,
  host,
  password,
});

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
