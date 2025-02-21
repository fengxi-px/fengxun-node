const Router = require("@koa/router"); // Koa 路由，用于处理 HTTP 请求的路由逻辑
const UserController = require("@/controller/user"); // 引入用户控制器
const ZhipuAIController = require("@/controller/zhipuAi"); // 引入智谱清言控制器
const voice = require("@/controller/voice"); // 引入阿里云控制器
const saveChatHistory = require("@/controller/chathistory"); // 引入聊天记录控制器

// 权限处理
const authority = require("@/config/auth");

// 创建路由实例
const router = new Router();

// 用户相关接口
// 登录接口
router.post("/login", UserController.login);

// 智谱清言接口
// 文生文
router.post("/createCompletions", ZhipuAIController.createCompletions);
// router.post('/createCompletions', authority, ZhipuAIController.createCompletions);
// 文生图
router.post("/createImages", authority, ZhipuAIController.createImages);

//获取阿里云token
router.get("/alitoken", voice.aliToken);

// 存储聊天记录
router.post("/save-chat-history", authority, saveChatHistory.saveChatHistory);
//获取用户的全部聊天记录列表
router.get("/fetch-chat-history", authority, saveChatHistory.fetchChatHistory);
//点击聊天列表获取对应的聊天内容
router.get("/only-chat-history", authority, saveChatHistory.onliChatHistory);

// web
const WebUserController = require("@/controller/web/user");
const WebZhipuAIController = require("@/controller/web/zhipuAi");
const WebsaveChatHistory = require("@/controller/web/chathistory");
// 登录
router.post("/web/login", WebUserController.login);
// 文生文
router.post(
  "/web/createCompletions",
  authority,
  WebZhipuAIController.createCompletions
);
// 文生图
router.post("/web/createImages", authority, WebZhipuAIController.createImages);
//存储聊天记录
router.post(
  "/web/save-chat-history",
  authority,
  WebsaveChatHistory.saveChatHistory
);
//获取用户的全部聊天记录列表
router.get(
  "/web/fetch-chat-history",
  authority,
  WebsaveChatHistory.fetchChatHistory
);
//点击聊天列表获取对应的聊天内容
router.get(
  "/web/only-chat-history",
  authority,
  WebsaveChatHistory.onliChatHistory
);
// 删除聊天记录
router.delete(
  "/web/delete-chat-history",
  authority,
  WebsaveChatHistory.deleteChatHistory
);

// admin
const AdminUserController = require("@/controller/admin/user");
const AdminUserWXController = require("@/controller/admin/userWX");
const AdminRoleController = require("@/controller/admin/role");
const AdminUserWebController = require("@/controller/admin/userWeb");
// 用户相关接口
// 登录接口
router.post("/admin/login", AdminUserController.login);
// 获取用户列表
router.get("/admin/getUsers", authority, AdminUserController.getUsers);
// 更新用户信息
router.post("/admin/update", authority, AdminUserController.update);
// 删除用户
router.delete("/admin/delete", authority, AdminUserController.delete);
// 通过昵称查询用户
router.get(
  "/admin/findUserByName",
  authority,
  AdminUserController.findUserByName
);
// 通过用户id查询用户
router.get("/admin/findUserById", authority, AdminUserController.findUserById);
// 集合性查询
router.get("/admin/findUser", authority, AdminUserController.findUser);
// get UserInfo
router.get("/admin/getUserInfo", authority, AdminUserController.getUserInfo);
// 上传文件
router.post("/admin/addFile", authority, AdminUserController.addFile);
// 获取文件列表
router.get("/admin/getFiles", authority, AdminUserController.getFilesByOwner);
// 删除文件
router.delete("/admin/deleteFile", authority, AdminUserController.deleteFile);

// wx用户相关接口
// 获取用户列表
router.get("/admin/getUsersWX", authority, AdminUserWXController.getUsers);
// 更新用户信息
router.post("/admin/updateWX", authority, AdminUserWXController.updateUser);
// 删除用户
router.delete("/admin/deleteWX", authority, AdminUserWXController.deleteUser);
// 通过昵称查询用户
router.get(
  "/admin/findUserWXByName",
  authority,
  AdminUserWXController.findUserByName
);
// 通过用户id查询用户
router.get(
  "/admin/findUserWXById",
  authority,
  AdminUserWXController.findUserById
);
// 通过时间查询用户
router.get(
  "/admin/findUserWXByTime",
  authority,
  AdminUserWXController.findUserByTime
);
// 集合性查询
router.get("/admin/findUserWX", authority, AdminUserWXController.findUser);
// 获取用户使用记录
router.get("/admin/getRecords", authority, AdminUserWXController.getRecords);

// Web用户相关接口
// 获取用户列表
router.get("/admin/getUsersWeb", authority, AdminUserWebController.getUsers);
// 更新用户信息
router.post("/admin/updateWeb", authority, AdminUserWebController.updateUser);
// 删除用户
router.delete("/admin/deleteWeb", authority, AdminUserWebController.deleteUser);
// 通过昵称查询用户
router.get(
  "/admin/findUserWebByEmail",
  authority,
  AdminUserWebController.findUserByEmail
);
// 通过用户id查询用户
router.get(
  "/admin/findUserWebById",
  authority,
  AdminUserWebController.findUserById
);
// 通过时间查询用户
router.get(
  "/admin/findUserWebByTime",
  authority,
  AdminUserWebController.findUserByTime
);
// 集合性查询
router.get("/admin/findUserWeb", authority, AdminUserWebController.findUser);
// 获取用户使用记录
router.get(
  "/admin/getUserWebRecords",
  authority,
  AdminUserWebController.getRecords
);

// 角色相关接口
// 添加角色
router.post("/admin/addRole", authority, AdminRoleController.addRole);
// 获取角色列表
router.get("/admin/getRoles", authority, AdminRoleController.getRoles);
// 更新角色信息
router.post("/admin/updateRole", authority, AdminRoleController.updateRole);
// 删除角色
router.delete("/admin/deleteRole", authority, AdminRoleController.deleteRole);
// 通过角色名称查询角色
router.get(
  "/admin/findRoleByName",
  authority,
  AdminRoleController.findRoleByName
);
// 通过角色id查询角色
router.get("/admin/findRoleById", authority, AdminRoleController.getRole);
// 集合性查询
router.get("/admin/findRole", authority, AdminRoleController.findRole);

module.exports = router;
