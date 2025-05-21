# 中医处方平台 MVP v0.5

基于Next.js构建的中医处方平台前端原型，实现基本的处方创建、预览和扫描功能。

## 特性

- 医师端：创建处方、设置药品数量、处方预览与生成二维码
- 患者端：查看处方、查找附近药房
- 药房端：扫描处方二维码、药房管理功能

## 技术栈

- Next.js / React
- TypeScript
- Tailwind CSS
- 模拟数据（无后端）

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 部署

该项目可通过Vercel进行部署。

## 构建状态

- 修复了Medicine类型定义，确保包含所有需要的字段
- 优化了组件渲染逻辑，提高代码健壮性 

## ESLint Configuration

Currently, this project uses ESLint v8 with an `.eslintrc.json` configuration file.

**Future Plans:** We plan to migrate to ESLint v9 and its Flat Config system (`eslint.config.js`) once the project is upgraded to Next.js version 15 or later, as Next.js 15 provides better official support for ESLint v9.

## Available Scripts 