const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const package = require('./package.json');

// 用户脚本头部信息
const userscriptHeaders = `// ==UserScript==
// @name         ${package.name}
// @namespace    http://tampermonkey.net/
// @version      ${package.version}
// @description  ${package.description}
// @author       ${package.author}
// @match        *://vrchat.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.vrchat.cloud
// @connect      vrchat.com
// @updateURL    https://github.com/gujimy/vrchat-avatar-db/releases/latest/download/vrchat_avatar_db.user.js
// @downloadURL  https://github.com/gujimy/vrchat-avatar-db/releases/latest/download/vrchat_avatar_db.user.js
// ==/UserScript==
`;

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'vrchat_avatar_db.user.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        {
            apply: (compiler) => {
                compiler.hooks.emit.tap('UserscriptPlugin', (compilation) => {
                    const asset = compilation.assets['vrchat_avatar_db.user.js'];
                    const content = asset.source();
                    compilation.assets['vrchat_avatar_db.user.js'] = {
                        source: () => userscriptHeaders + '\n' + content,
                        size: () => userscriptHeaders.length + content.length
                    };
                });
            }
        }
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        hot: true,
        port: 8080
    }
}; 