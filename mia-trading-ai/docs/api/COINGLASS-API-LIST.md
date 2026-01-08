# CoinGlass API 接口列表

> CoinGlass API 提供了丰富的接口，涵盖了广泛的加密市场数据类型，包括合约（Futures）、现货（Spot）、期权（Options）、ETF、链上数据（On-Chain）以及各类指标数据（Index）。

---

## 交易市场

| API 地址 | 描述 |
|----------|------|
| `/futures/supported-coins` | 获取支持的合约币种 |
| `/futures/supported-exchange-pairs` | 获取支持的交易所和交易对 |
| `/api/futures/pairs-markets` | 合约交易对详情 |
| `/api/futures/coins-markets` | 合约币种市场行情 |
| `/futures/price-change-list` | 币种价格变化列表 |
| `/api/price/ohlc-history` | 交易对价格 K 线历史 |

---

## 持仓

| API 地址 | 描述 |
|----------|------|
| `/api/futures/openInterest/ohlc-history` | 合约持仓量 K 线历史 |
| `/api/futures/openInterest/ohlc-aggregated-history` | 合约聚合持仓量 K 线历史 |
| `/api/futures/openInterest/ohlc-aggregated-stablecoin` | 聚合稳定币保证金合约持仓量 K 线 |
| `/api/futures/openInterest/ohlc-aggregated-coin-margin-history` | 聚合币本位保证金合约持仓量 K 线 |
| `/api/futures/openInterest/exchange-list` | 各交易所持仓量列表 |
| `/api/futures/openInterest/exchange-history-chart` | 各交易所持仓量图表历史 |

---

## 资金费率

| API 地址 | 描述 |
|----------|------|
| `/api/futures/fundingRate/ohlc-history` | 资金费率 K 线历史 |
| `/api/futures/fundingRate/oi-weight-ohlc-history` | OI 加权资金费率 K 线 |
| `/api/futures/fundingRate/vol-weight-ohlc-history` | 成交量加权资金费率 K 线 |
| `/api/futures/fundingRate/exchange-list` | 各交易所资金费率 |
| `/api/futures/fundingRate/accumulated-exchange-list` | 各交易所累计资金费率 |
| `/api/futures/fundingRate/arbitrage` | 资金费率套利机会 |

---

## 多空比

| API 地址 | 描述 |
|----------|------|
| `/api/futures/global-long-short-account-ratio/history` | 全网账户多空比历史 |
| `/api/futures/top-long-short-account-ratio/history` | 大户账户多空比历史 |
| `/api/futures/top-long-short-position-ratio/history` | 大户账户持仓多空比 |
| `/api/futures/taker-buy-sell-volume/exchange-list` | 各交易所主动买卖比 |

---

## 爆仓

| API 地址 | 描述 |
|----------|------|
| `/api/futures/liquidation/history` | 合约交易对爆仓历史 |
| `/api/futures/liquidation/aggregated-history` | 合约币种爆仓历史 |
| `/api/futures/liquidation/coin-list` | 币种爆仓列表 |
| `/api/futures/liquidation/exchange-list` | 交易所爆仓列表 |
| `/api/futures/liquidation/order` | 爆仓订单 |
| `/api/futures/liquidation/heatmap/model1` | 合约交易对爆仓热力图（模型1） |
| `/api/futures/liquidation/heatmap/model2` | 合约交易对爆仓热力图（模型2） |
| `/api/futures/liquidation/heatmap/model3` | 合约交易对爆仓热力图（模型3） |
| `/api/futures/liquidation/aggregated-heatmap/model1` | 合约币种爆仓热力图（模型1） |
| `/api/futures/liquidation/aggregated-heatmap/model2` | 合约币种爆仓热力图（模型2） |
| `/api/futures/liquidation/aggregated-heatmap/model3` | 合约币种爆仓热力图（模型3） |
| `/api/futures/liquidation/map` | 合约交易对爆仓地图 |
| `/api/futures/liquidation/aggregated-map` | 合约币种爆仓地图 |

---

## 订单薄（合约）

| API 地址 | 描述 |
|----------|------|
| `/api/futures/orderbook/ask-bids-history` | 合约交易对挂单深度历史（±范围） |
| `/api/futures/orderbook/aggregated-ask-bids-history` | 合约币种挂单深度历史（±范围） |
| `/api/futures/orderbook/history` | 合约订单簿热力图 |
| `/api/futures/orderbook/large-limit-order` | 大额挂单数据 |
| `/api/futures/orderbook/large-limit-order-history` | 大额挂单历史 |

---

## Hyperliquid 鲸鱼

| API 地址 | 描述 |
|----------|------|
| `/api/hyperliquid/whale-alert` | Hyperliquid 巨鲸预警 |
| `/api/hyperliquid/whale-position` | Hyperliquid 巨鲸仓位 |

---

## 主动买卖（合约）

| API 地址 | 描述 |
|----------|------|
| `/api/futures/taker-buy-sell-volume/history` | 合约交易对主动买卖成交历史 |
| `/api/futures/aggregated-taker-buy-sell-volume/history` | 合约币种主动买卖成交历史 |

---

## 现货

| API 地址 | 描述 |
|----------|------|
| `/api/spot/supported-coins` | 支持的现货币种列表 |
| `/api/spot/supported-exchange-pairs` | 支持的现货交易所和交易对 |
| `/api/spot/coins-markets` | 现货币种市场 |
| `/api/spot/pairs-markets` | 现货交易对市场 |
| `/api/spot/price/history` | 现货价格历史 |

---

## 订单薄（现货）

| API 地址 | 描述 |
|----------|------|
| `/api/spot/orderbook/ask-bids-history` | 现货交易对挂单深度历史（±范围） |
| `/api/spot/orderbook/aggregated-ask-bids-history` | 现货币种挂单深度历史（±范围） |
| `/api/spot/orderbook/history` | 现货订单簿热力图 |
| `/api/spot/orderbook/large-limit-order` | 现货大额挂单数据 |
| `/api/spot/orderbook/large-limit-order-history` | 现货大额挂单历史 |

---

## 主动买卖（现货）

| API 地址 | 描述 |
|----------|------|
| `/api/spot/taker-buy-sell-volume/history` | 现货交易对主动买卖成交历史 |
| `/api/spot/aggregated-taker-buy-sell-volume/history` | 现货币种主动买卖成交历史 |

---

## 期权

| API 地址 | 描述 |
|----------|------|
| `/api/option/max-pain` | 最大痛点价数据 |
| `/api/option/info` | 期权信息 |
| `/api/option/exchange-oi-history` | 各交易所期权持仓量历史 |
| `/api/option/exchange-vol-history` | 各交易所期权成交量历史 |

---

## 链上数据

| API 地址 | 描述 |
|----------|------|
| `/api/exchange/assets` | 交易所资产透明度概况 |
| `/api/exchange/balance/list` | 交易所余额列表 |
| `/api/exchange/balance/chart` | 交易所余额变化图表 |
| `/api/exchange/chain/tx/list` | 交易所链上转账记录（ERC-20） |

---

## ETF

| API 地址 | 描述 |
|----------|------|
| `/api/etf/bitcoin/list` | 比特币 ETF 列表 |
| `/api/hk-etf/bitcoin/flow-history` | 香港比特币 ETF 流入流出历史 |
| `/api/etf/bitcoin/net-assets/history` | 比特币 ETF 净资产历史 |
| `/api/etf/bitcoin/flow-history` | 比特币 ETF 流入流出历史 |
| `/api/etf/bitcoin/premium-discount/history` | 比特币 ETF 溢价/折价历史 |
| `/api/etf/bitcoin/history` | 比特币 ETF 历史 |
| `/api/etf/bitcoin/price/history` | 比特币 ETF 价格历史 |
| `/api/etf/bitcoin/detail` | 比特币 ETF 详情 |
| `/api/etf/ethereum/net-assets-history` | 以太坊 ETF 净资产历史 |
| `/api/etf/ethereum/list` | 以太坊 ETF 列表 |
| `/api/etf/ethereum/flow-history` | 以太坊 ETF 流入流出历史 |
| `/api/grayscale/holdings-list` | 灰度持仓列表 |
| `/api/grayscale/premium-history` | 灰度溢价历史 |

---

## 指标

| API 地址 | 描述 |
|----------|------|
| `/api/futures/rsi/list` | RSI 相对强弱指标列表 |
| `/api/futures/basis/history` | 合约基差历史 |
| `/api/borrow-interest-rate/history` | 借贷利率历史 |
| `/api/coinbase-premium-index` | Coinbase 溢价指数 |
| `/api/bitfinex-margin-long-short` | Bitfinex 杠杆多空比 |
| `/api/index/ahr999` | AHR999 指标 |
| `/api/index/puell-multiple` | Puell 多重指标 |
| `/api/index/stock-flow` | Stock-to-Flow 模型 |
| `/api/index/pi-cycle-indicator` | Pi Cycle 顶部指标 |
| `/api/index/golden-ratio-multiplier` | 黄金比例乘数 |
| `/api/index/bitcoin/profitable-days` | 比特币盈利天数 |
| `/api/index/bitcoin/rainbow-chart` | 比特币彩虹图 |
| `/api/index/fear-greed-history` | 加密恐惧与贪婪指数 |
| `/api/index/stableCoin-marketCap-history` | 稳定币市值历史 |
| `/api/index/bitcoin/bubble-index` | 比特币泡沫指数 |
| `/api/bull-market-peak-indicator` | 牛市顶部指标 |
| `/api/index/2-year-ma-multiplier` | 2 年均线乘数 |
| `/api/index/200-week-moving-average-heatmap` | 200 周移动均线热力图 |

---

## 使用说明

**Base URL**: `https://open-api-v4.coinglass.com`

**认证方式**: 在请求头中添加 `CG-API-KEY: YOUR_API_KEY`

**示例请求**:
```bash
curl -X GET "https://open-api-v4.coinglass.com/api/futures/coins-markets" \
     -H "CG-API-KEY: your_api_key_here" \
     -H "accept: application/json"
```

---

*文档更新时间: 2024-12*


