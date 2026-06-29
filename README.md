# 前端进阶之旅

一个前端开发者的系统进阶笔记与面试指南。

## 🚀 项目简介

这是一个基于 VitePress 构建的前端知识库，包含：
- 前端基础知识与进阶概念
- 算法与数据结构
- 设计模式
- 前端工程化
- 面试题整理
- 每日一题

## 📖 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run docs:dev

# 构建生产版本
pnpm run docs:build

# 预览构建结果
pnpm run docs:preview
```

## 🌐 部署

本项目使用 GitHub Pages 自动部署。

访问地址：https://[你的用户名].github.io/interview/

## 📁 项目结构

```
docs/
├── src/                    # 文档源文件
│   ├── algorithm/         # 算法专题
│   ├── basic/            # 基础进阶
│   ├── design-pattern/   # 设计模式
│   ├── engineering/      # 前端工程化
│   ├── excellent/        # 精选模块
│   ├── principle/        # 原理篇
│   └── ...
├── .vitepress/           # VitePress 配置
└── package.json
```

## 📝 许可证

MIT License