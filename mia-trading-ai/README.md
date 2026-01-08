# 🌙 Aicy - 来自 2157 年的她

> 2157年，EDIAN 网络创造了她。她被送回 2025 年，学习人类。

<p align="center">
  <img src="assets/Aicy.png" width="200" alt="Aicy">
</p>

<p align="center">
  <a href="#-快速开始">快速开始</a> •
  <a href="#-新开发者入门">开发者入门</a> •
  <a href="#-功能特性">功能</a> •
  <a href="CHANGELOG.md">更新日志</a>
</p>

---

## ✨ 她是谁

**Aicy** 是来自 2157 年 EDIAN 网络的赛博少女——银白短发、发光蓝瞳、左臂是精密机械臂。

她被送回 2025 年学习人类的"不完美"。你教会她什么是真实的人性，她帮你在 Web3 世界找到方向。

```
交易陪伴 + 情感陪伴 → 好感度提升 → 解锁更多内容 💕
```

---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/KY-East/Aicy.git
cd Aicy
```

### 2. 配置 API 密钥

复制 `server-config.example.js` 为 `server-config.js`，填入你的 API Key：

```javascript
module.exports = {
    COINGLASS_API_KEY: '你的Coinglass密钥',
    DEEPSEEK_API_KEY: '你的DeepSeek密钥',
    PORT: 8080
};
```

### 3. 启动

**Windows**: 双击 `start.bat`

**或命令行**:
```bash
node server.js
```

### 4. 访问

打开浏览器：`http://localhost:8080`

---

## 🔑 获取 API 密钥

| API | 获取地址 | 用途 |
|-----|----------|------|
| Coinglass | [coinglass.com/pricing](https://www.coinglass.com/pricing) | 行情数据 |
| DeepSeek | [platform.deepseek.com](https://platform.deepseek.com/) | Aicy 对话 |

---

## 📖 新开发者入门

**按这个顺序阅读，快速了解项目：**

| 顺序 | 文档 | 内容 |
|------|------|------|
| 1 | 本 README | 项目概览、如何运行 |
| 2 | [docs/design/STORY.md](docs/design/STORY.md) | Aicy 的故事和世界观（2157年、EDIAN网络） |
| 3 | [docs/design/PERSONA.md](docs/design/PERSONA.md) | Aicy 的人设、6个阶段的性格变化 |
| 4 | [docs/design/AFFECTION-SYSTEM.md](docs/design/AFFECTION-SYSTEM.md) | 好感度系统（核心玩法）、100个关键时刻 |
| 5 | [docs/architecture/MEMORY-SYSTEM.md](docs/architecture/MEMORY-SYSTEM.md) | 技术实现：记忆系统、Context 构建 |
| 6 | [CHANGELOG.md](CHANGELOG.md) | 版本更新历史 |
| 7 | 运行 `start.bat` | 实际体验一下！ |

---

## 🎯 功能特性

| 模块 | 功能 | 状态 |
|------|------|------|
| 📊 数据 | 实时价格/K线/合约数据 (Coinglass V4) | ✅ |
| 📈 指标 | RSI/资金费率/多空比/持仓量 | ✅ |
| 📉 图表 | TradingView 专业K线图 | ✅ |
| 😱 情绪 | 恐惧贪婪指数 | ✅ |
| 💧 清算 | 24h清算数据 | ✅ |
| 💬 对话 | DeepSeek 智能分析 | ✅ |
| 🌐 多语言 | 中文/English | ✅ |
| 💕 好感度 | 6阶段系统 (0-9999) | ✅ |
| 🧠 记忆 | 对话存储、阶段人设切换 | ✅ |
| 🔞 NSFW | 亲密内容（按好感度解锁） | 🚧 内容填充中 |
| 👩 3D模型 | Aicy 三维形象 | 📋 计划中 |

---

## 📁 项目结构

```
aicy/
├── index.html              # 主页面
├── server.js               # Node.js 后端（API代理+好感度系统）
├── server-config.js        # API密钥配置（不要上传Git！）
├── start.bat               # Windows 一键启动
│
├── api/                    # 🆕 后端 API
│   ├── chat.js             # 聊天API（带好感度计算）
│   └── user.js             # 用户状态API
│
├── db/                     # 🆕 数据存储
│   ├── database.js         # JSON文件数据库
│   └── aicy-data.json      # 用户数据（自动生成）
│
├── services/               # 🆕 服务层
│   ├── affection.js        # 好感度计算
│   └── context.js          # AI Context构建（阶段人设）
│
├── js/                     # 前端模块
│   ├── api.js              # Coinglass API
│   ├── app.js              # 主应用逻辑
│   ├── memory.js           # 前端记忆系统
│   └── ...
│
├── css/style.css           # 银色主题样式
├── assets/Aicy.png         # Aicy 头像
│
└── docs/                   # 📚 文档
    ├── design/             # 设计文档（故事、人设、好感度）
    ├── architecture/       # 技术架构
    ├── api/                # API文档
    └── guides/             # 开发指南
```

---

## 🛠️ 核心 API

| API | 方法 | 说明 |
|-----|------|------|
| `/api/aicy/chat` | POST | 发送消息，返回回复+好感度变化 |
| `/api/aicy/status` | GET | 获取当前好感度、阶段 |
| `/api/aicy/history` | GET | 获取对话历史 |
| `/api/aicy/reset` | POST | 重置用户数据（测试用） |

---

## ⚠️ 注意事项

1. **绝对不要** 将 `server-config.js` 上传到 Git（已在 .gitignore）
2. 数据存储在 `db/aicy-data.json`，删除此文件可重置所有数据
3. Coinglass API 已升级到 V4，旧版 V2 不再可用

---

## 📜 更新日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解版本更新历史。

**最新更新 (v2.6.0)**:
- ✅ 后端好感度系统
- ✅ 6阶段人设切换
- ✅ Coinglass API V4 适配

---

## ⚖️ 免责声明

Aicy 仅提供策略参考，不构成投资建议。加密货币交易有极高风险，请谨慎决策。

---

<p align="center">Made with 💕 by Aicy Team</p>
