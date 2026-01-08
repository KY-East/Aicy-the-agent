# MCP 配置指南

> MCP = Model Context Protocol，让AI能访问外部工具和数据

---

## 什么是MCP

MCP让Cursor中的AI可以：
- 访问外部API
- 执行特定工具
- 获取实时数据

---

## Cursor MCP 配置

### 配置位置
```
Cursor Settings → Features → MCP
```

或编辑配置文件：
- Windows: `%APPDATA%\Cursor\User\globalStorage\cursor.mcp\config.json`
- Mac: `~/Library/Application Support/Cursor/User/globalStorage/cursor.mcp/config.json`

---

## 推荐的MCP服务器

### 1. Web Search（搜索）
```json
{
  "mcpServers": {
    "web-search": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-web-search"]
    }
  }
}
```

### 2. Fetch（HTTP请求）
```json
{
  "mcpServers": {
    "fetch": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-fetch"]
    }
  }
}
```

### 3. Filesystem（文件系统）
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project"]
    }
  }
}
```

---

## 本项目推荐配置

```json
{
  "mcpServers": {
    "fetch": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-fetch"]
    },
    "web-search": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-web-search"]
    }
  }
}
```

### 作用
- **fetch**: 让AI可以直接测试API请求
- **web-search**: 让AI可以搜索最新文档

---

## 自定义MCP（高级）

如果需要让AI直接访问交易数据，可以创建自定义MCP：

```javascript
// mcp-server/index.js
const { Server } = require('@modelcontextprotocol/sdk/server');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio');

const server = new Server({
  name: 'aicy-trading',
  version: '1.0.0'
});

// 定义工具
server.setRequestHandler('tools/list', async () => ({
  tools: [{
    name: 'get_btc_price',
    description: '获取BTC实时价格',
    inputSchema: { type: 'object', properties: {} }
  }]
}));

// 实现工具
server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'get_btc_price') {
    const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
    const data = await res.json();
    return { content: [{ type: 'text', text: `BTC: $${data.price}` }] };
  }
});

new StdioServerTransport().connect(server);
```

---

## 验证MCP

在Cursor中输入：
```
@mcp 列出可用工具
```

如果配置正确，会显示已安装的MCP工具。

---

## 注意事项

1. MCP需要Node.js环境
2. 首次使用会自动下载依赖
3. 某些MCP可能需要API Key
4. 生产环境慎用（安全考虑）


