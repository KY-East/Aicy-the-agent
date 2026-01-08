# 📡 API 文档

本文档描述 Aicy 使用的后端 API 接口。

## 🔗 API 概览

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/coinglass/*` | GET | Coinglass 数据代理 |
| `/api/deepseek` | POST | DeepSeek AI 对话 |

---

## 📊 Coinglass API 代理

### 基础用法

```javascript
// 前端调用
const response = await fetch('/api/coinglass/futures/openInterest/chart?symbol=BTC&interval=1h');
const data = await response.json();
```

### 可用端点

#### 1. 合约持仓量

```
GET /api/coinglass/futures/openInterest/chart

参数:
  symbol: BTC | ETH | SOL
  interval: 1h | 4h | 1d

响应:
{
  "code": "0",
  "data": [
    {
      "t": 1703318400000,  // 时间戳
      "o": 12345678901     // 持仓量 (USD)
    }
  ]
}
```

#### 2. 多空比

```
GET /api/coinglass/futures/globalLongShortAccountRatio

参数:
  symbol: BTC | ETH | SOL
  interval: 1h | 4h | 1d

响应:
{
  "code": "0",
  "data": [
    {
      "longRate": 0.55,
      "shortRate": 0.45
    }
  ]
}
```

#### 3. 资金费率

```
GET /api/coinglass/futures/fundingRate

参数:
  symbol: BTC | ETH | SOL

响应:
{
  "code": "0",
  "data": [
    {
      "uMarginList": [
        {
          "exchangeName": "Binance",
          "rate": 0.0001
        }
      ]
    }
  ]
}
```

#### 4. 恐惧贪婪指数

```
GET /api/coinglass/index/fear-greed-history

响应:
{
  "code": "0",
  "data": [
    {
      "value": 75,
      "classification": "Greed"
    }
  ]
}
```

#### 5. 现货订单簿

```
GET /api/coinglass/spot/orderbook

参数:
  symbol: BTC | ETH | SOL

响应:
{
  "code": "0",
  "data": {
    "bids": [[95000, 10.5], [94990, 8.2]],
    "asks": [[95100, 12.3], [95110, 9.1]]
  }
}
```

---

## 🤖 DeepSeek AI API

### 发送对话

```
POST /api/deepseek

请求体:
{
  "messages": [
    {
      "role": "system",
      "content": "你是 Aicy..."
    },
    {
      "role": "user",
      "content": "你好"
    }
  ],
  "stream": true
}

响应: Server-Sent Events (SSE)
```

### 前端调用示例

```javascript
async function sendToAicy(messages) {
    const response = await fetch('/api/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages,
            stream: true
        })
    });
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        // 处理 SSE 数据...
    }
}
```

---

## 🔐 认证

### API Key 配置

在 `js/config.js` 中配置：

```javascript
const CONFIG = {
    COINGLASS_API_KEY: 'your_coinglass_key',
    DEEPSEEK_API_KEY: 'your_deepseek_key'
};
```

### 安全注意

- ⚠️ **不要** 将 API Key 提交到 Git
- ✅ 使用服务端代理隐藏 Key
- ✅ 在生产环境使用环境变量

---

## ⚠️ 错误处理

### 错误码

| 状态码 | 说明 | 处理方式 |
|--------|------|----------|
| 200 | 成功 | - |
| 400 | 请求错误 | 检查参数 |
| 401 | 未授权 | 检查 API Key |
| 429 | 请求过多 | 降低频率 |
| 500 | 服务器错误 | 重试 |

### 错误响应格式

```json
{
  "error": true,
  "message": "Invalid API key",
  "code": "AUTH_ERROR"
}
```

### 前端错误处理

```javascript
try {
    const data = await fetchData();
} catch (error) {
    if (error.status === 401) {
        console.error('API Key 无效');
    } else if (error.status === 429) {
        console.error('请求过于频繁，请稍后重试');
    } else {
        console.error('未知错误:', error);
    }
}
```

---

## 📈 速率限制

| API | 限制 |
|-----|------|
| Coinglass | 100 次/分钟 |
| DeepSeek | 10 次/分钟 |

### 建议

- 缓存不常变化的数据
- 避免重复请求
- 实现请求队列

---

## 🧪 测试

### 使用 curl 测试

```bash
# 测试 Coinglass 代理
curl http://localhost:3000/api/coinglass/index/fear-greed-history

# 测试 DeepSeek
curl -X POST http://localhost:3000/api/deepseek \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"hello"}]}'
```

### 使用浏览器测试

打开开发者工具 → Network，查看 API 请求和响应。

---

## 📝 更新记录

- 2025-12-23: 创建 API 文档

