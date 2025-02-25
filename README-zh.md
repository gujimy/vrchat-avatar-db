# VRChat 模型数据库管理器

[English Documentation](README.md) | [日本語ドキュメント](README-jp.md)

一个用于管理 VRChat 模型的 Tampermonkey 脚本。

<p align="center">
  <a href="https://github.com/gujimy/vrchat-avatar-db/releases/latest/download/vrchat_avatar_db.user.js">
    <img src="https://img.shields.io/badge/安装-脚本-green.svg?style=for-the-badge" alt="安装脚本">
  </a>
</p>

## 功能截图

![模型数据库主界面](img/1.png)

*图片 1: 模型数据库管理主界面*

![模型详情页保存按钮](img/2.png)

*图片 2: 在模型详情页添加的"保存到模型数据库"按钮*

![导入导出功能](img/3.png)

*图片 3: 模型数据导入导出功能*

## 功能特点

- 模型数据库管理
- 导入/导出模型数据（支持多种格式）
- 搜索和排序功能
- 批量删除功能
- PC/Quest 平台支持度显示
- 性能等级显示
- 一键切换模型
- 在模型详情页直接保存模型到数据库
- 多语言支持（中文、日文、英文）
- 自定义 UI 与 VRChat 界面风格一致

## 开发

### 环境要求

- Node.js >= 14
- npm >= 6

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

构建后的文件将生成在 `dist` 目录下。

## 使用方法

1. 安装 Tampermonkey 浏览器扩展
2. 创建新脚本
3. 将 `dist/vrchat_avatar_db.user.js` 的内容复制到新脚本中
4. 保存并启用脚本
5. 在 VRChat 网站上使用左侧导航栏中的"模型数据库"按钮访问
6. 在模型详情页面可以使用"保存到模型数据库"按钮直接保存当前模型

## 目录结构

```
.
├── src/
│   ├── components/    # UI组件
│   ├── services/      # 数据库和API服务
│   │   ├── database.js  # 数据库操作
│   │   ├── i18n.js      # 国际化服务
│   │   └── utils.js     # 工具函数
│   ├── styles/        # CSS样式
│   └── main.js        # 入口文件
├── dist/             # 构建输出目录
├── webpack.config.js  # webpack配置
└── package.json
```

## 国际化支持

本脚本支持以下语言：

- 中文
- 日文
- 英文

系统会自动检测浏览器语言并选择合适的显示语言。

## 许可证

MIT 