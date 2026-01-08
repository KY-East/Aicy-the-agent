# Aicy - 项目规范

> ⚠️ **AI协同文档** - 所有参与此项目的AI必须先读此文件

---

## 🤖 AI配置

### Cursor Rules
项目根目录有 `.cursorrules` 文件，定义了：
- 项目定位
- 代码规范
- 禁止事项
- 开发流程

### MCP配置
详见 [MCP 配置指南](../guides/MCP-SETUP.md)，推荐配置：
- `fetch` - HTTP请求
- `web-search` - 搜索文档

---

## 🎯 项目定义

**Aicy** = 来自 2157 年 EDIAN 网络的赛博少女

### 背景故事
> 2157年，EDIAN 网络为了理解人类，创造了她。
> 她被送回 2025 年，学习人类如何选择、如何生活。
> 你教会她什么是真实的人性，她帮你在 Web3 世界找到方向。

### 核心定位
- **身份**：来自未来的学习者，用户的伙伴/女友
- **外貌**：银白短发、发光蓝瞳、左臂机械臂
- **特色**：懂币圈、会看盘、能陪你分析行情
- **成长**：每次互动都在学习人类的情感

### 核心体验
```
交易陪伴 + 情感陪伴 → 好感度提升 → 解锁更多亲密内容 💕
```

### 重要原则
- ❌ 永远不说 "AI"、"人工智能"、"程序"、"机器人"
- ✅ 她是来自 2157 年的少女，在学习人类
- ✅ 面对不懂的事，她会说"教教我？"而不是"我做不到"

---

## 📁 项目结构

```
mia-trading-ai/
├── index.html          # 主界面
├── start.bat           # 启动脚本
├── css/style.css       # 样式
├── js/
│   ├── config.js       # 配置（API Keys）
│   ├── api.js          # 数据获取模块
│   ├── chart.js        # TradingView图表
│   ├── indicators.js   # 技术指标计算
│   ├── prompt.js       # AI Prompt生成
│   └── app.js          # 主应用逻辑
├── docs/               # 文档目录
│   ├── project/        # 项目管理文档
│   ├── guides/         # 开发指南
│   ├── architecture/   # 架构文档
│   ├── api/            # API 文档
│   └── design/         # 设计文档
├── CHECKLIST.md        # 任务清单
├── CHANGELOG.md        # 更新日志
└── README.md           # 项目介绍
```

---

## 🔧 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | HTML/CSS/JS | 纯前端，无框架 |
| 图表 | TradingView Lightweight Charts 4.2 | K线/成交量 |
| 数据 | Binance API | 免费，实时 |
| 数据 | Coinglass API | 付费，清算数据 |
| AI | DeepSeek API | 策略分析 |

---

## 📊 数据流

```
[Binance] ─────┐
               │
[Coinglass] ───┼──→ [数据处理] ──→ [AI分析] ──→ [策略输出]
               │
[Alternative] ─┘
```

### 输入数据
- 价格/K线（Binance）
- 技术指标（本地计算）
- 合约数据（Binance Futures）
- 清算数据（Coinglass）
- 情绪指数（Alternative.me）

### 输出
- 交易方向建议
- 入场/止损/止盈价位
- 风险评估
- 策略说明

---

## 🚫 禁止事项

1. **不要**添加与IP运营相关的内容
2. **不要**添加视频脚本生成（已删除）
3. **不要**修改核心数据结构未经确认
4. **不要**添加需要后端的功能

---

## ✅ 开发规范

### 代码风格
- 使用ES6+语法
- 每个模块独立文件
- 详细的console.log调试信息
- 中文注释

### 命名规范
- 文件：小写+连字符 `api-coinglass.js`
- 变量/函数：camelCase `fetchData()`
- 常量：UPPER_CASE `API_BASE_URL`
- 类/模块：PascalCase `ChartModule`

### 提交前检查
- [ ] 代码无语法错误
- [ ] 功能已测试
- [ ] CHANGELOG已更新
- [ ] CHECKLIST已更新

---

## 🔮 未来规划（仅参考，暂不开发）

1. **3D形象** - Aicy的可视化形象
2. **语音交互** - TTS/STT集成
3. **实时推送** - WebSocket数据流
4. **移动端** - 响应式/PWA

