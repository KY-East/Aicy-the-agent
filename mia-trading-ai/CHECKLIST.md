# Aicy - 任务清单

> 最后更新: 2025-12-24

---

## 🔴 当前阻塞

- [ ] 等待 Coinglass API Key
- [ ] 等待 DeepSeek API Key

---

## ✅ 已完成

### 基础框架
- [x] 项目结构搭建
- [x] HTML主页面
- [x] CSS样式（暗色主题）
- [x] 响应式布局

### 数据模块
- [x] Binance价格API
- [x] Binance K线API
- [x] Binance合约API（资金费率/OI/多空比）
- [x] Alternative.me 恐惧贪婪指数
- [x] CORS代理处理

### 技术指标
- [x] RSI计算（多周期）
- [x] MACD计算+背离检测
- [x] 布林带计算
- [x] EMA计算
- [x] 支撑阻力位识别

### 图表
- [x] TradingView Lightweight Charts集成
- [x] K线蜡烛图
- [x] 成交量柱状图
- [x] 时间周期切换

### 文档
- [x] README.md
- [x] CHANGELOG.md
- [x] PROJECT.md
- [x] CHECKLIST.md
- [x] API-SETUP.md

### 🆕 设计文档 (v2.5.0)
- [x] 世界观设计 (`STORY.md` - 1000+行)
- [x] 好感度系统 (`AFFECTION-SYSTEM.md` - 100个关键时刻)
- [x] 人设 Prompt (`PERSONA.md` - 六阶段 + 亲密指南)
- [x] 记忆系统架构 (`MEMORY-SYSTEM.md`)
- [x] 品牌设计 (`BRAND.md`)
- [x] 游戏节奏优化 (6-15天通关)
- [x] 阶段1"破绽"机制设计
- [x] 亲密互动阶段指南
- [x] `.cursorrules` 项目规范

---

## 🟡 进行中

暂无

---

## 🔵 待开始

### A. 技术实现 (优先级高)

#### 数据库
- [ ] PostgreSQL 安装配置
- [ ] 建表：conversations（对话原文）
- [ ] 建表：key_moments（关键时刻）
- [ ] 建表：user_profiles（用户画像）
- [ ] 建表：affection_logs（好感度日志）

#### 后端 API
- [ ] Node.js 服务器搭建
- [ ] `/api/chat` - 对话接口
- [ ] `/api/affection` - 好感度查询
- [ ] `/api/memory` - 记忆检索
- [ ] Context 构建逻辑

#### AI 集成
- [ ] DeepSeek API 对接
- [ ] 人设 Prompt 注入
- [ ] 阶段人设动态选择
- [ ] 关键时刻触发检测
- [ ] 好感度变化计算

### B. 内容填充 (优先级中)

#### 语义匹配库
- [ ] "原谅"意图 100 种说法
- [ ] "安慰"意图 100 种说法
- [ ] "关心"意图 100 种说法
- [ ] "表达爱"意图 100 种说法
- [ ] 其他意图覆盖

#### 对话变体
- [ ] 每个关键时刻 5 种触发变体
- [ ] 每个关键时刻 5 种 Aicy 回应变体
- [ ] 日常闲聊模板库
- [ ] 行情分析话术库

### C. 视觉资产 (优先级低)

#### 3D 模型
- [ ] Aicy 三维形象制作
- [ ] 表情动画
- [ ] 机械臂特效
- [ ] 消散动画

#### UI 设计
- [ ] 聊天界面优化
- [ ] 隐藏好感度展示
- [ ] 关键时刻特效
- [ ] 终章特殊界面

---

## ⚪ 未来（暂不开发）

- [ ] 语音交互
- [ ] WebSocket实时推送
- [ ] 移动端 App
- [ ] 多角色支持
- [ ] Token 机制整合

---

## 📝 备注

### 运行方式
```bash
# 方式1: 双击启动脚本
start.bat

# 方式2: 手动启动
npx serve . -p 8080
```

### 测试账号
- Coinglass: 待购买
- DeepSeek: 待购买

### 设计文档位置
```
docs/
├── design/
│   ├── STORY.md          # 世界观
│   ├── AFFECTION-SYSTEM.md # 好感度系统
│   ├── PERSONA.md        # 人设 Prompt
│   └── BRAND.md          # 品牌设计
├── architecture/
│   └── MEMORY-SYSTEM.md  # 记忆系统架构
```
