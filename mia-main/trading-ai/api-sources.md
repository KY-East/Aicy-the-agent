# API 数据来源

> 获取市场分析所需数据的各种方式

## ⚠️ TradingView API 情况

**TradingView 不提供公开 API**，即使是 Premium 用户也没有。

| 版本 | API 访问 | 说明 |
|------|----------|------|
| 免费版 | ❌ | 无 |
| Pro | ❌ | 无 |
| Pro+ | ❌ | 无 |
| Premium | ❌ | 无 |
| Enterprise | ✅ | 仅限券商/交易所合作 |

---

## ✅ 替代方案

### 1. Binance API（推荐 ⭐⭐⭐⭐⭐）

**完全免费，无需认证即可获取**

| 数据类型 | API 端点 | 说明 |
|----------|----------|------|
| 实时价格 | `GET /api/v3/ticker/price` | 单个或所有交易对价格 |
| 24H行情 | `GET /api/v3/ticker/24hr` | 涨跌幅、成交量等 |
| K线数据 | `GET /api/v3/klines` | 任意时间周期的OHLCV |
| 订单簿 | `GET /api/v3/depth` | 买卖盘深度 |

**文档：** https://binance-docs.github.io/apidocs/spot/en/

**K线数据可以计算：**
- ✅ RSI
- ✅ MACD
- ✅ 布林带
- ✅ ATR
- ✅ 支撑/阻力位

**示例请求：**
```bash
# 获取BTC/USDT当前价格
curl "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"

# 获取BTC/USDT 1小时K线（最近100根）
curl "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=100"

# 获取BTC/USDT 24小时行情
curl "https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT"
```

---

### 2. Coinglass（合约专属数据）

**网站：** https://www.coinglass.com/

| 数据类型 | 免费 | API | 说明 |
|----------|------|-----|------|
| 资金费率 | ✅ | ✅ | 各交易所永续合约费率 |
| 清算数据 | ✅ | ✅ | 24H爆仓金额、多空比例 |
| 持仓量 | ✅ | ✅ | Open Interest 变化 |
| 多空比 | ✅ | ✅ | Long/Short Ratio |

**API 文档：** https://coinglass.com/api

**关键页面（手动获取）：**
- 资金费率：https://www.coinglass.com/FundingRate
- 清算数据：https://www.coinglass.com/LiquidationData
- 多空比：https://www.coinglass.com/LongShortRatio

---

### 3. 其他免费 API

| 来源 | 数据类型 | 免费限制 | 链接 |
|------|----------|----------|------|
| CoinGecko | 价格、市值、历史数据 | 50次/分钟 | https://www.coingecko.com/api |
| CoinMarketCap | 价格、排名 | 需API Key，10000次/月 | https://coinmarketcap.com/api |
| Alternative.me | Fear & Greed Index | 无限制 | https://alternative.me/crypto/fear-and-greed-index/ |

---

### 4. 宏观数据来源

| 数据 | 来源 | 获取方式 |
|------|------|----------|
| 美联储降息概率 | CME FedWatch Tool | 网页手动查看 |
| 经济数据日程 | Investing.com 财经日历 | 网页手动查看 |
| 重要新闻 | CoinDesk / The Block | RSS 或手动 |

**CME FedWatch：** https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html

---

## 🛠 Python 库推荐

### 数据获取

```python
# Binance 官方库
pip install python-binance

# 统一加密货币交易所库（支持100+交易所）
pip install ccxt

# HTTP请求
pip install requests
```

### 技术指标计算

```python
# TA-Lib（最专业，需要先安装C库）
pip install TA-Lib

# pandas-ta（纯Python，易安装）
pip install pandas-ta

# 数据处理
pip install pandas numpy
```

---

## 📋 推荐工作流

### 流程图

```
┌─────────────────────────────────────────────────────────┐
│                    数据获取层                            │
├─────────────────────────────────────────────────────────┤
│  Binance API          Coinglass           手动输入      │
│  (K线、价格)          (资金费率、清算)     (宏观事件)    │
└────────────┬──────────────┬───────────────┬─────────────┘
             │              │               │
             ▼              ▼               ▼
┌─────────────────────────────────────────────────────────┐
│                    数据处理层                            │
├─────────────────────────────────────────────────────────┤
│  Python 计算技术指标：RSI、MACD、布林带、ATR             │
│  识别关键支撑/阻力位                                     │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    分析输出层                            │
├─────────────────────────────────────────────────────────┤
│  格式化数据 → 发送给 AI → 生成分析报告                   │
└─────────────────────────────────────────────────────────┘
```

### 实现优先级

| 优先级 | 任务 | 难度 | 预计时间 |
|--------|------|------|----------|
| P0 | 手动从TradingView记录数据 | ⭐ | 立即可用 |
| P1 | 用Binance API获取K线+价格 | ⭐⭐ | 1-2小时 |
| P2 | 用pandas-ta计算技术指标 | ⭐⭐ | 1-2小时 |
| P3 | 集成Coinglass数据 | ⭐⭐⭐ | 2-4小时 |
| P4 | 自动化脚本+定时任务 | ⭐⭐⭐⭐ | 1天 |

---

## 📅 更新记录

| 日期 | 更新内容 |
|------|----------|
| 2025-12-01 | 初始版本 |



