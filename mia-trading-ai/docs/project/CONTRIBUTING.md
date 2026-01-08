# 🤝 贡献指南 | Contributing Guide

感谢你对 Aicy 项目的兴趣！本指南将帮助你了解如何参与项目开发。

## 📋 目录

- [行为准则](#行为准则)
- [如何开始](#如何开始)
- [开发流程](#开发流程)
- [提交规范](#提交规范)
- [Issue 规范](#issue-规范)
- [Pull Request 规范](#pull-request-规范)
- [代码审查](#代码审查)

---

## 行为准则

- 尊重每一位贡献者
- 保持友好和专业的交流
- 接受建设性的批评
- 专注于项目目标

---

## 如何开始

### 1. Fork 项目

```bash
# 克隆你的 fork
git clone https://github.com/YOUR_USERNAME/mia-trading-ai.git
cd mia-trading-ai

# 添加上游仓库
git remote add upstream https://github.com/ORIGINAL_OWNER/mia-trading-ai.git
```

### 2. 设置开发环境

参考 [环境搭建指南](../guides/SETUP.md)

### 3. 创建功能分支

```bash
# 同步最新代码
git fetch upstream
git checkout Aicy
git merge upstream/Aicy

# 创建功能分支
git checkout -b feature/你的功能名
```

---

## 开发流程

### Git 工作流

```
main (稳定版)
  ↑
Aicy (开发主分支)
  ↑
feature/* | fix/* | docs/* (功能分支)
```

### 分支命名规范

| 类型 | 格式 | 示例 |
|------|------|------|
| 新功能 | `feature/功能名` | `feature/affection-system` |
| Bug修复 | `fix/问题描述` | `fix/english-translation` |
| 文档 | `docs/文档名` | `docs/api-guide` |
| 样式 | `style/描述` | `style/mobile-ui` |
| 重构 | `refactor/模块名` | `refactor/memory-system` |

---

## 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<类型>(<范围>): <描述>

[可选的正文]

[可选的脚注]
```

### 提交类型

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式（不影响功能） |
| `refactor` | 代码重构 |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建/工具变更 |

### 示例

```bash
# 好的提交信息
feat(chat): 添加好感度系统
fix(i18n): 修复英文界面"思考中"显示中文的问题
docs(readme): 更新部署说明
style(mobile): 优化移动端侧边栏动画

# 不好的提交信息
update code
fix bug
修改了一些东西
```

---

## Issue 规范

### 报告 Bug

使用 Bug Report 模板，包含：
- 问题描述
- 复现步骤
- 期望行为
- 实际行为
- 环境信息（浏览器、系统）
- 截图（如有）

### 功能请求

使用 Feature Request 模板，包含：
- 功能描述
- 使用场景
- 可能的实现方案

### Issue 标签

| 标签 | 说明 |
|------|------|
| `bug` | Bug 报告 |
| `feature` | 新功能请求 |
| `enhancement` | 功能增强 |
| `documentation` | 文档相关 |
| `priority-high` | 高优先级 |
| `priority-low` | 低优先级 |
| `good-first-issue` | 适合新手 |
| `help-wanted` | 需要帮助 |

---

## Pull Request 规范

### 提交 PR 前

- [ ] 代码已自测通过
- [ ] 遵循代码规范
- [ ] 更新相关文档
- [ ] 提交信息规范

### PR 描述模板

```markdown
## 变更类型
- [ ] 新功能
- [ ] Bug 修复
- [ ] 文档更新
- [ ] 代码重构

## 描述
简要描述这个 PR 做了什么

## 相关 Issue
Closes #issue编号

## 测试
描述如何测试这些变更

## 截图
如果是 UI 变更，请附上截图
```

---

## 代码审查

### 审查者职责

- 检查代码质量和规范
- 验证功能实现
- 提出建设性建议
- 及时回复

### 被审查者职责

- 认真对待每条评论
- 及时回复和修改
- 保持耐心和开放态度

### 审查标准

1. **功能性** - 代码是否实现了预期功能
2. **可读性** - 代码是否易于理解
3. **一致性** - 是否符合项目风格
4. **安全性** - 是否有安全隐患
5. **性能** - 是否有性能问题

---

## 🎉 感谢贡献！

每一个贡献都很重要，感谢你帮助 Aicy 变得更好！

有问题？欢迎在 Issue 或 Discord 中讨论。

