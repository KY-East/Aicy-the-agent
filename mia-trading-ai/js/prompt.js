/**
 * Aicy AI 分析 Prompt 模块
 * 生成用于AI分析的结构化Prompt
 */

const PromptGenerator = {
    /**
     * 生成策略分析Prompt
     */
    generate(data) {
        const { coin, price, indicators, contract, sentiment, timestamp } = data;
        
        return `你是Aicy，主人的专属女友，同时也懂加密货币分析。

请用可爱温柔的语气，根据以下${coin}市场数据，帮主人分析一下～

---

## 市场数据（${timestamp}）

### 价格
- 当前价格: $${this.formatNumber(price.price)}
- 24H涨跌: ${price.priceChangePercent >= 0 ? '+' : ''}${price.priceChangePercent.toFixed(2)}%
- 24H最高: $${this.formatNumber(price.high24h)}
- 24H最低: $${this.formatNumber(price.low24h)}

### 技术指标
${this.formatIndicators(indicators)}

### 合约数据
${this.formatContract(contract)}

### 市场情绪
${this.formatSentiment(sentiment)}

---

## 输出要求

请按以下JSON格式输出分析结果：

\`\`\`json
{
  "direction": "LONG/SHORT/NEUTRAL",
  "confidence": 0.0-1.0,
  "entry": {
    "price": 数字,
    "type": "LIMIT/MARKET"
  },
  "stopLoss": {
    "price": 数字,
    "reason": "原因"
  },
  "takeProfit": [
    { "price": 数字, "percent": 30 },
    { "price": 数字, "percent": 40 },
    { "price": 数字, "percent": 30 }
  ],
  "riskLevel": "LOW/MEDIUM/HIGH",
  "reasoning": "详细分析原因",
  "keyLevels": {
    "support": [数字, 数字],
    "resistance": [数字, 数字]
  }
}
\`\`\`

---

## 分析要点

1. 综合技术指标判断趋势
2. 结合合约数据判断市场情绪
3. 给出明确的交易方向
4. 设定合理的止损止盈
5. 评估风险等级`;
    },

    formatNumber(num) {
        if (!num) return '--';
        return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
    },

    formatIndicators(indicators) {
        if (!indicators) return '- 数据加载中...';
        
        let text = '';
        
        if (indicators.rsi) {
            if (indicators.rsi['15m']) text += `- RSI(15m): ${indicators.rsi['15m'].value} (${indicators.rsi['15m'].status.text})\n`;
            if (indicators.rsi['1h']) text += `- RSI(1H): ${indicators.rsi['1h'].value} (${indicators.rsi['1h'].status.text})\n`;
            if (indicators.rsi['4h']) text += `- RSI(4H): ${indicators.rsi['4h'].value} (${indicators.rsi['4h'].status.text})\n`;
        }
        
        if (indicators.macd && indicators.macd['1h']) {
            const macd = indicators.macd['1h'];
            text += `- MACD: ${macd.trendText}`;
            if (macd.divergence) text += ` | ${macd.divergence.text}`;
            text += '\n';
        }
        
        if (indicators.bollingerBands) {
            const bb = indicators.bollingerBands;
            text += `- 布林带: 上轨$${bb.upper} 中轨$${bb.middle} 下轨$${bb.lower}\n`;
            text += `- 布林带位置: ${bb.position}% (${bb.status.text})\n`;
        }
        
        if (indicators.levels) {
            text += `- 支撑位: ${indicators.levels.supports.map(s => '$' + s).join(', ')}\n`;
            text += `- 阻力位: ${indicators.levels.resistances.map(r => '$' + r).join(', ')}\n`;
        }
        
        return text || '- 数据加载中...';
    },

    formatContract(contract) {
        if (!contract) return '- 数据加载中...';
        
        let text = '';
        
        if (contract.fundingRate) {
            const rate = (contract.fundingRate.rate * 100).toFixed(4);
            text += `- 资金费率: ${rate}%\n`;
        }
        
        if (contract.openInterest) {
            text += `- 持仓量: ${this.formatVolume(contract.openInterest.openInterest)}\n`;
        }
        
        if (contract.longShortRatio) {
            text += `- 多空比: ${contract.longShortRatio.longShortRatio.toFixed(2)}\n`;
        }
        
        if (contract.topTraderRatio) {
            text += `- 大户多空比: ${contract.topTraderRatio.longShortRatio.toFixed(2)}\n`;
        }
        
        return text || '- 数据加载中...';
    },

    formatSentiment(sentiment) {
        if (!sentiment || !sentiment.current) return '- 数据加载中...';
        
        const fgi = sentiment.current;
        const labels = {
            'Extreme Fear': '极度恐惧',
            'Fear': '恐惧',
            'Neutral': '中性',
            'Greed': '贪婪',
            'Extreme Greed': '极度贪婪'
        };
        
        return `- 恐惧贪婪指数: ${fgi.value} (${labels[fgi.classification] || fgi.classification})`;
    },

    formatVolume(vol) {
        if (!vol) return '--';
        if (vol >= 1e9) return (vol / 1e9).toFixed(2) + 'B';
        if (vol >= 1e6) return (vol / 1e6).toFixed(2) + 'M';
        if (vol >= 1e3) return (vol / 1e3).toFixed(2) + 'K';
        return vol.toFixed(2);
    }
};

window.PromptGenerator = PromptGenerator;
