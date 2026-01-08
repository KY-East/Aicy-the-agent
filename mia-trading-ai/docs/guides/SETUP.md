# 🚀 环境搭建指南

本指南帮助你在本地运行 Aicy 项目。

## 📋 前置要求

- **Node.js** 18.0+ ([下载](https://nodejs.org/))
- **Git** ([下载](https://git-scm.com/))
- 现代浏览器（Chrome、Firefox、Edge）

## 🔧 安装步骤

### 1. 克隆项目

```bash
git clone https://github.com/YOUR_USERNAME/mia-trading-ai.git
cd mia-trading-ai
```

### 2. 切换到开发分支

```bash
git checkout Aicy
```

### 3. 配置 API Key

在 `js/config.js` 中配置：

```javascript
const CONFIG = {
    COINGLASS_API_KEY: '你的 Coinglass API Key',
    DEEPSEEK_API_KEY: '你的 DeepSeek API Key',
    // ...
};
```

#### 获取 API Key

| API | 获取地址 | 用途 |
|-----|----------|------|
| Coinglass | [coinglass.com](https://www.coinglass.com/zh/pricing) | 行情数据 |
| DeepSeek | [platform.deepseek.com](https://platform.deepseek.com/) | Aicy 对话 |

### 4. 启动服务器

**Windows:**
```bash
# 双击 start.bat
# 或命令行
node server.js
```

**Mac/Linux:**
```bash
node server.js
```

### 5. 访问应用

打开浏览器访问：`http://localhost:3000`

---

## 🔍 验证安装

### 检查清单

- [ ] 页面正常显示
- [ ] TradingView 图表加载
- [ ] 行情数据显示（不是 Loading...）
- [ ] 可以与 Aicy 对话
- [ ] 语言切换正常

### 常见问题

#### 1. 端口被占用

```bash
# 查看占用进程
netstat -ano | findstr :3000

# 或使用其他端口
# 修改 server.js 中的 PORT
```

#### 2. API 数据不显示

- 检查 API Key 是否正确
- 检查网络是否能访问 Coinglass
- 查看浏览器控制台错误

#### 3. Aicy 不回复

- 检查 DeepSeek API Key
- 确保服务器正在运行
- 查看服务器控制台日志

---

## 📁 开发模式

### 文件修改后

- **HTML/CSS/JS** - 刷新浏览器即可
- **server.js** - 需要重启服务器

### 调试

1. 打开浏览器开发者工具（F12）
2. 查看 Console 日志
3. 查看 Network 请求

---

## 🐛 问题排查

### 查看日志

```bash
# 服务器日志
node server.js

# 浏览器日志
F12 → Console
```

### 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| `EADDRINUSE` | 端口占用 | 换端口或关闭占用进程 |
| `401 Unauthorized` | API Key 错误 | 检查配置 |
| `CORS error` | 跨域问题 | 确保通过 server.js 访问 |
| `Network Error` | 网络问题 | 检查网络连接 |

---

## ❓ 需要帮助？

1. 查看 [FAQ](../FAQ.md)
2. 提交 [Issue](../../issues)
3. 联系团队成员

