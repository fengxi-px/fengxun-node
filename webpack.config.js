const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './app.js',  // 替换为你项目的入口文件
    target: 'node',  // 告诉 Webpack 目标环境是 Node.js
    externals: [nodeExternals()],  // 不打包 node_modules 中的依赖
    output: {
        filename: 'bundle.js',  // 输出的文件名称
        path: path.resolve(__dirname, 'dist'),  // 输出文件的目录
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '.'),  // 根据实际路径设置别名
        },
    },
    mode: 'production',  // 设置为生产模式
};
