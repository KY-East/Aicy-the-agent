# API 配置指南

## 1️⃣ Coinglass API

### 获取API Key
1. 登录 [Coinglass](https://www.coinglass.com/)
2. 进入 Account → API Management
3. 创建新的 API Key
4. 复制保存

### API端点（Standard Plan）

| 功能 | 端点 | 说明 |
|------|------|------|
| 清算数据 | `/api/futures/liquidation/v2/24h` | 24H清算统计 |
| 清算历史 | `/api/futures/liquidation/history` | 历史清算记录 |
| 清算热力图 | `/api/futures/liquidation-heatmap` | 价格区间清算分布 |
| 资金费率 | `/api/futures/funding-rates-history` | 历史资金费率 |
| 持仓量 | `/api/futures/open-interest-history` | OI历史数据 |
| 多空比 | `/api/futures/long-short-history` | 多空比历史 |

### 请求格式
```javascript
fetch('https://open-api-v4.coinglass.com/api/futures/liquidation/v2/24h?symbol=BTC', {
  headers: {
    'accept': 'application/json',
    'CG-API-KEY': 'your_api_key'
  }
})
```

---

## 2️⃣ DeepSeek API

### 获取API Key
1. 访问 [DeepSeek Platform](https://platform.deepseek.com/)
2. 注册/登录账号
3. 进入 API Keys 页面
4. 创建新Key

### 定价
- 约 ¥0.01-0.02/次请求（比GPT便宜10倍）

### 请求格式
```javascript
fetch('https://api.deepseek.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_api_key'
  },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: '分析BTC市场...' }]
  })
})
```

---

## 3️⃣ 配置方式

### 方式A：网页配置（推荐）
打开网页 → 点击"配置API" → 填入Key → 保存

### 方式B：修改config.js
```javascript
// js/config.js
const CONFIG = {
  coinglass: 'your_coinglass_key',
  deepseek: 'your_deepseek_key'
};
```

---

## 4️⃣ 免费数据源（已接入）

| 来源 | 数据 | 限制 |
|------|------|------|
| Binance | 价格/K线/资金费率/OI | 无限制 |
| Alternative.me | 恐惧贪婪指数 | 无限制 |

---

## 相关文档

- [Coinglass API 完整列表](./COINGLASS-API-LIST.md)
- [内部 API 说明](./API.md)


