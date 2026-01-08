# Mia 2.0 实盘交易知识体系文档

> 专业知识普及 + 机制详解 + 90天执行计划

[![Deploy Status](https://github.com/yourusername/mia-trading-docs/workflows/Deploy%20VitePress%20site%20to%20GitHub%20Pages/badge.svg)](https://github.com/yourusername/mia-trading-docs/actions)

## 📖 关于这个项目

这是一份完整的加密货币交易知识体系文档，专为 Mia 和幕后团队设计，涵盖从零基础到建立交易IP的完整路径。

### ✨ 特点

- 📚 **完整的知识体系** - 从CEX到DEX，从现货到合约
- 🔧 **手把手的SOP** - 每个操作都有详细步骤
- 📅 **90天执行计划** - Day 1到Day 90的完整路径
- ⚠️ **安全风险防范** - 重点强调安全铁律和常见错误
- 🚀 **商业化路径** - 从学习者到IP的转变

## 🚀 快速开始

### 在线访问

访问部署好的网站：[https://yourusername.github.io/mia-trading-docs](https://yourusername.github.io/mia-trading-docs)

### 本地运行

1. 克隆仓库

```bash
git clone https://github.com/yourusername/mia-trading-docs.git
cd mia-trading-docs
```

2. 安装依赖

```bash
npm install
```

3. 启动开发服务器

```bash
npm run docs:dev
```

4. 在浏览器打开 `http://localhost:5173`

### 构建

```bash
npm run docs:build
```

构建后的文件在 `.vitepress/dist` 目录。

### 预览构建结果

```bash
npm run docs:preview
```

## 📂 项目结构

```
Mia/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions自动部署
├── .vitepress/
│   ├── config.mts              # VitePress配置
│   └── dist/                   # 构建输出目录
├── knowledge/                  # 专业知识模块
│   ├── module-1.md             # 模块1: CEX基础操作
│   ├── module-2.md             # 模块2: 链上操作与Meme币
│   ├── module-3.md             # 模块3: 合约交易
│   ├── module-4.md             # 模块4: 一级市场与打新
│   └── module-5.md             # 模块5: 技术分析基础
├── execution/                  # 执行框架
│   ├── day-1-7.md              # Day 1-7: 基础搭建周
│   ├── day-8-30.md             # Day 8-30: 技能习得月
│   └── day-31-90.md            # Day 31-90: IP建立季
├── reference/                  # 快速参考
│   ├── quick-reference.md      # 快速查询表
│   ├── common-mistakes.md      # 新手常见错误
│   ├── security-rules.md       # 安全铁律
│   └── tools.md                # 推荐工具
├── index.md                    # 首页
├── package.json                # 项目配置
├── .gitignore                  # Git忽略文件
└── README.md                   # 本文件
```

## 🎯 文档内容

### 第一部分：专业知识体系

- **模块1:** 中心化交易所(CEX)基础操作
- **模块2:** 链上操作与Meme币狩猎
- **模块3:** 合约交易深度解析
- **模块4:** 一级市场与打新机制
- **模块5:** 技术分析基础工具

### 第二部分：执行框架

- **Day 1-7:** 基础搭建周
- **Day 8-30:** 技能习得月
- **Day 31-90:** IP建立季

### 附录

- 快速查询表
- 新手最容易犯的10个错误
- 必须牢记的安全铁律
- 推荐工具速查

## 🔧 技术栈

- [VitePress](https://vitepress.dev/) - 静态站点生成器
- [Vue 3](https://vuejs.org/) - 框架
- [GitHub Pages](https://pages.github.com/) - 托管
- [GitHub Actions](https://github.com/features/actions) - CI/CD

## 🚢 部署

### 部署到 GitHub Pages

1. 在GitHub仓库设置中启用GitHub Pages
   - Settings → Pages
   - Source: GitHub Actions

2. 推送到main分支，GitHub Actions会自动部署

```bash
git add .
git commit -m "update docs"
git push origin main
```

3. 等待GitHub Actions完成部署
4. 访问 `https://yourusername.github.io/mia-trading-docs`

### 自定义域名（可选）

1. 在GitHub仓库设置中添加自定义域名
   - Settings → Pages → Custom domain

2. 在域名DNS设置中添加CNAME记录
   - 指向: `yourusername.github.io`

3. 等待DNS生效（可能需要几小时）

## 📝 更新文档

### 修改现有内容

1. 编辑对应的Markdown文件
2. 提交更改
3. 推送到main分支
4. GitHub Actions自动部署

### 添加新页面

1. 在对应目录创建新的Markdown文件
2. 在 `.vitepress/config.mts` 中添加导航/侧边栏配置
3. 提交更改并推送

## ⚠️ 重要提示

- 📖 本文档仅供学习参考，不构成任何投资建议
- 🔒 所有交易操作都有风险，请谨慎操作
- 💰 只投资你能承受损失的资金
- 🔐 务必做好账户安全设置

## 🤝 贡献

欢迎提交Issue和Pull Request来改进文档！

### 贡献流程

1. Fork本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 📧 联系方式

- 项目链接: [https://github.com/yourusername/mia-trading-docs](https://github.com/yourusername/mia-trading-docs)
- 问题反馈: [Issues](https://github.com/yourusername/mia-trading-docs/issues)

---

**⚠️ 风险提示：** 加密货币交易有极高风险，可能导致本金全部损失。本文档仅供学习参考。

**💪 记住：** 市场永远在，保护好本金才有机会！

**🚀 Good luck!**


