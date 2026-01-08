/**
 * API Module - 全部数据来自 Coinglass
 * 数据源: Coinglass API v4
 */

const API = {
    // 使用后端代理（API Key 在后端注入，前端看不到）
    baseUrl: '/api/coinglass',
    
    /**
     * 通过后端代理访问 API
     * 前端不再需要 API Key，后端自动注入
     */
    async proxyFetch(url, options = {}) {
        options.headers = {
            ...options.headers,
            'accept': 'application/json'
        };
        return fetch(url, options);
    },

    /**
     * 获取所有数据
     */
    async fetchAllData(coin = 'BTC') {
        const results = {
            price: null,
            liquidation: null,
            sentiment: null,
            contract: null,
            indicators: null,
            takerBuySell: null,  // 新增：主动买卖比
            oiChange: null,      // 新增：OI 变化
            orderbook: null,     // 新增：订单簿大额挂单
            error: []
        };

        const symbol = coin + 'USDT';

        // 并行获取数据
        const promises = [
            this.fetchMarketData(coin)
                .then(data => results.price = data)
                .catch(e => results.error.push('价格数据: ' + e.message)),
            this.fetchLiquidationData(coin)
                .then(data => results.liquidation = data)
                .catch(e => results.error.push('清算数据: ' + e.message)),
            this.fetchFearGreedIndex()
                .then(data => results.sentiment = data)
                .catch(e => results.error.push('情绪指数: ' + e.message)),
            this.fetchContractData(symbol)
                .then(data => results.contract = data)
                .catch(e => results.error.push('合约数据: ' + e.message)),
            this.fetchRSI(symbol)
                .then(data => results.indicators = data)
                .catch(e => results.error.push('RSI指标: ' + e.message)),
            // 新增数据
            this.fetchTakerBuySell(symbol)
                .then(data => results.takerBuySell = data)
                .catch(e => results.error.push('买卖比: ' + e.message)),
            this.fetchOIChange(coin)
                .then(data => results.oiChange = data)
                .catch(e => results.error.push('OI变化: ' + e.message)),
            this.fetchLargeOrders(symbol)
                .then(data => results.orderbook = data)
                .catch(e => results.error.push('大额挂单: ' + e.message))
        ];

        await Promise.all(promises);
        return results;
    },

    /**
     * 获取市场价格数据 - Coinglass
     */
    async fetchMarketData(coin) {
        try {
            const marketsUrl = `${this.baseUrl}/api/futures/coins-markets`;
            console.log('📡 请求价格数据:', marketsUrl);
        
            const marketsRes = await this.proxyFetch(marketsUrl);
            if (!marketsRes.ok) throw new Error(`HTTP ${marketsRes.status}`);
        
            const marketsResult = await marketsRes.json();
            console.log('✅ 价格数据:', marketsResult);

            if (marketsResult.code === '0' && marketsResult.data) {
                // 从数组中找到对应币种
                const coinData = marketsResult.data.find(item => item.symbol === coin);
                if (coinData) {
                    console.log('✅ 找到币种数据:', coinData);
                    // 计算24H变化百分比
                    const priceChangePercent = parseFloat(coinData.price_change_percent_24h || 0);
                    const openInterest = parseFloat(coinData.open_interest_usd || 0);
                    const oiChange24h = parseFloat(coinData.open_interest_change_usd_24h || coinData.oi_change_24h || 0);
                    const oiChangePercent = parseFloat(coinData.open_interest_change_percent_24h || coinData.oi_change_percent_24h || 0);

        return {
                        price: parseFloat(coinData.current_price || 0),
                        priceChangePercent: priceChangePercent,
                        high24h: 0,
                        low24h: 0,
                        volume24h: parseFloat(coinData.volume_usd_24h || 0),
                        // 额外数据
                        avgFundingRate: parseFloat(coinData.avg_funding_rate_by_oi || 0),
                        openInterest: openInterest,
                        openInterestQuantity: parseFloat(coinData.open_interest_quantity || 0),
                        marketCap: parseFloat(coinData.market_cap_usd || 0),
                        longShortRatio: parseFloat(coinData.long_short_ratio_24h || 1),
                        // OI 变化数据
                        oiChange24h: oiChange24h,
                        oiChangePercent: oiChangePercent
                    };
                }
            }
            return null;
        } catch (e) {
            console.error('❌ 获取价格数据失败:', e);
            throw e;
        }
    },

    /**
     * 获取清算数据 - Coinglass
     */
    async fetchLiquidationData(coin) {
        try {
            const url = `${this.baseUrl}/api/futures/liquidation/aggregated-history?exchange_list=Binance&symbol=${coin}&interval=1d&limit=1`;
            console.log('📡 请求清算数据:', url);
            
            const response = await this.proxyFetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const result = await response.json();
            console.log('✅ 清算数据:', result);

            if (result.code === '0' && result.data?.length > 0) {
                const data = result.data[0];
                const longLiq = parseFloat(data.aggregated_long_liquidation_usd || 0);
                const shortLiq = parseFloat(data.aggregated_short_liquidation_usd || 0);
                const total = longLiq + shortLiq;
                return {
                    total24h: total,
                    longLiq24h: longLiq,
                    shortLiq24h: shortLiq,
                    longPercent: total > 0 ? (longLiq / total * 100) : 50,
                    shortPercent: total > 0 ? (shortLiq / total * 100) : 50
                };
            }
            return null;
        } catch (e) {
            console.error('❌ 获取清算数据失败:', e);
            throw e;
        }
    },

    /**
     * 获取合约数据（资金费率、持仓量、多空比、大户多空比）- Coinglass
     */
    async fetchContractData(symbol) {
        try {
            const coin = symbol.replace('USDT', '');
            // API 端点
            const oiUrl = `${this.baseUrl}/api/futures/openInterest/chart?symbol=${coin}&interval=h1&limit=1`;
            const lsUrl = `${this.baseUrl}/api/futures/global-long-short-account-ratio/history?exchange=Binance&symbol=${symbol}&interval=h1&limit=1`;
            // 大户多空比端点
            const topLsUrl = `${this.baseUrl}/api/futures/top-long-short-account-ratio/history?exchange=Binance&symbol=${symbol}&interval=h1&limit=1`;

            const [oiRes, lsRes, topLsRes] = await Promise.all([
                this.proxyFetch(oiUrl).catch(() => null),
                this.proxyFetch(lsUrl).catch(() => null),
                this.proxyFetch(topLsUrl).catch(() => null)
            ]);

            const contract = {
                fundingRate: null,
                openInterest: null,
                longShortRatio: null,
                topTraderRatio: null  // 大户多空比
            };

            // 持仓量 - 使用 exchange-list
            if (oiRes?.ok) {
                const data = await oiRes.json();
                console.log('✅ 持仓量数据:', data);
                if (data.code === '0' && data.data) {
                    // 计算总持仓量
                    let totalOI = 0;
                    if (Array.isArray(data.data)) {
                        data.data.forEach(item => {
                            totalOI += parseFloat(item.open_interest || item.openInterest || 0);
                        });
                    } else if (data.data.open_interest) {
                        totalOI = parseFloat(data.data.open_interest);
                    }
                    if (totalOI > 0) {
                        contract.openInterest = {
                            value: totalOI
                        };
                    }
                }
            }

            // 全网多空比
            if (lsRes?.ok) {
                const data = await lsRes.json();
                if (data.code === '0' && data.data?.length > 0) {
                    const lsData = data.data[0];
                    contract.longShortRatio = {
                        ratio: parseFloat(lsData.global_account_long_short_ratio || lsData.close || 1),
                        longPercent: parseFloat(lsData.global_account_long_percent || 50),
                        shortPercent: parseFloat(lsData.global_account_short_percent || 50)
                    };
                }
            }

            // 大户多空比
            if (topLsRes?.ok) {
                const data = await topLsRes.json();
                console.log('✅ 大户多空比原始数据:', data);
                if (data.code === '0' && data.data?.length > 0) {
                    const topData = data.data[0];
                    contract.topTraderRatio = {
                        ratio: parseFloat(topData.top_account_long_short_ratio || topData.longShortRatio || topData.close || 1),
                        longPercent: parseFloat(topData.top_account_long_percent || topData.longPercent || 50),
                        shortPercent: parseFloat(topData.top_account_short_percent || topData.shortPercent || 50)
                    };
                    console.log('✅ 大户多空比:', contract.topTraderRatio);
                }
            }

            console.log('✅ 合约数据:', contract);
            return contract;
        } catch (e) {
            console.error('❌ 获取合约数据失败:', e);
            return null;
        }
    },

    /**
     * 获取 RSI 指标 - Coinglass
     * 字段名使用下划线格式：rsi_15m, rsi_1h, rsi_4h, rsi_24h
     */
    async fetchRSI(symbol) {
        try {
            const url = `${this.baseUrl}/api/futures/rsi/list`;
            console.log('📡 请求RSI数据:', url);
        
            const response = await this.proxyFetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const result = await response.json();
            
            if (result.code === '0' && result.data) {
                // 找到对应币种的数据（symbol 是 BTC，不是 BTCUSDT）
                const coin = symbol.replace('USDT', '');
                const coinData = result.data.find(item => item.symbol === coin);
                
                if (coinData) {
                    console.log('✅ RSI数据:', coinData);
                return {
                        rsi15m: parseFloat(coinData.rsi_15m || 0),
                        rsi1h: parseFloat(coinData.rsi_1h || 0),
                        rsi4h: parseFloat(coinData.rsi_4h || 0),
                        rsi1d: parseFloat(coinData.rsi_24h || 0),
                        currentPrice: parseFloat(coinData.current_price || 0)
                };
            }
            }
            return null;
        } catch (e) {
            console.error('❌ 获取RSI数据失败:', e);
            throw e;
        }
    },

    /**
     * 获取恐惧贪婪指数 - Coinglass
     */
    async fetchFearGreedIndex() {
        try {
            const url = `${this.baseUrl}/api/index/fear-greed-history?limit=31`;
            console.log('📡 请求恐惧贪婪指数:', url);
            
            const response = await this.proxyFetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const result = await response.json();
            console.log('✅ 恐惧贪婪指数原始数据:', result);
            console.log('✅ data 结构:', typeof result.data, result.data ? Object.keys(result.data) : 'null');

            // 处理返回数据 - 返回英文键用于翻译
            const getClassification = (value) => {
                if (value <= 20) return 'Extreme Fear';
                if (value <= 40) return 'Fear';
                if (value <= 60) return 'Neutral';
                if (value <= 80) return 'Greed';
                return 'Extreme Greed';
            };

            if (result.code === '0' && result.data) {
                const data = result.data;
                
                // 格式1: data 包含 data_list 数组
                if (data.data_list && Array.isArray(data.data_list)) {
                    const dataList = data.data_list;
                    console.log('✅ 恐惧贪婪指数数据列表长度:', dataList.length);
                    
                    if (dataList.length > 0) {
                        const current = parseInt(dataList[0] || 0);
                        const yesterday = dataList[1] !== undefined ? parseInt(dataList[1]) : null;
                        const lastWeek = dataList[7] !== undefined ? parseInt(dataList[7]) : null;
                        const lastMonth = dataList[30] !== undefined ? parseInt(dataList[30]) : null;
                        
                        return {
                            current: {
                                value: current,
                                classification: getClassification(current)
                            },
                            yesterday: yesterday !== null ? { value: yesterday } : null,
                            lastWeek: lastWeek !== null ? { value: lastWeek } : null,
                            lastMonth: lastMonth !== null ? { value: lastMonth } : null
                        };
                    }
                }
                
                // 格式2: data 是数组
                if (Array.isArray(data) && data.length > 0) {
                    const current = parseInt(data[0].value || data[0] || 0);
                    return {
                        current: {
                            value: current,
                            classification: getClassification(current)
                        },
                        yesterday: data[1] ? { value: parseInt(data[1].value || data[1] || 0) } : null,
                        lastWeek: data[7] ? { value: parseInt(data[7].value || data[7] || 0) } : null,
                        lastMonth: data[30] ? { value: parseInt(data[30].value || data[30] || 0) } : null
                    };
                }
                
                // 格式3: data 直接包含 value 字段
                if (data.value !== undefined) {
                    const current = parseInt(data.value);
                    return {
                        current: {
                            value: current,
                            classification: getClassification(current)
                        },
                        yesterday: null,
                        lastWeek: null,
                        lastMonth: null
                    };
                }
            }
            
            // 格式4: result 直接包含 data_list
            if (result.code === '0' && result.data_list && Array.isArray(result.data_list)) {
                const dataList = result.data_list;
                if (dataList.length > 0) {
                    const current = parseInt(dataList[0] || 0);
                return {
                    current: {
                            value: current,
                            classification: getClassification(current)
                    },
                        yesterday: dataList[1] !== undefined ? { value: parseInt(dataList[1]) } : null,
                        lastWeek: dataList[7] !== undefined ? { value: parseInt(dataList[7]) } : null,
                        lastMonth: dataList[30] !== undefined ? { value: parseInt(dataList[30]) } : null
                };
            }
            }
            
            return null;
        } catch (e) {
            console.error('❌ 获取恐惧贪婪指数失败:', e);
            throw e;
        }
    },

    /**
     * 获取主动买卖比 - Coinglass
     * 添加必需的 exchange_list 参数
     */
    async fetchTakerBuySell(symbol) {
        try {
            const coin = symbol.replace('USDT', '');
            // 使用历史端点，添加 exchange_list
            const url = `${this.baseUrl}/api/futures/aggregated-taker-buy-sell-volume/history?exchange_list=Binance,OKX,Bybit&symbol=${coin}&interval=h1&limit=1`;
            console.log('📡 请求买卖比数据:', url);
            
            const response = await this.proxyFetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const result = await response.json();
            console.log('✅ 买卖比数据:', result);

            if (result.code === '0' && result.data?.length > 0) {
                const data = result.data[0];
                const buyVol = parseFloat(data.aggregated_buy || data.buy || data.buyVolume || 0);
                const sellVol = parseFloat(data.aggregated_sell || data.sell || data.sellVolume || 0);
                const total = buyVol + sellVol;
                
            return {
                    buyVolume: buyVol,
                    sellVolume: sellVol,
                    ratio: sellVol > 0 ? (buyVol / sellVol).toFixed(2) : '1.00',
                    buyPercent: total > 0 ? (buyVol / total * 100) : 50,
                    sellPercent: total > 0 ? (sellVol / total * 100) : 50
            };
            }
            return null;
        } catch (e) {
            console.error('❌ 获取买卖比数据失败:', e);
            return null;
        }
    },

    /**
     * 获取 OI 变化 - 从 coins-markets 数据计算
     * 返回 null，在 updateUI 中从 price 数据获取
     */
    async fetchOIChange(coin) {
        // OI 变化将从 coins-markets 数据中提取
        // 直接返回 null，在 app.js 中处理
            return null;
    },

    /**
     * 获取大额挂单 - Coinglass
     */
    async fetchLargeOrders(symbol) {
        try {
            // 使用订单簿深度历史 (±5% 范围)
            const url = `${this.baseUrl}/api/futures/orderbook/ask-bids-history?exchange=Binance&symbol=${symbol}&range=5&interval=h1&limit=1`;
            console.log('📡 请求大额挂单数据:', url);
            
            const response = await this.proxyFetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const result = await response.json();
            console.log('✅ 大额挂单数据:', JSON.stringify(result));

            if (result.code === '0' && result.data) {
                // 处理数据 - data 可能是数组或对象
                const dataItem = Array.isArray(result.data) ? result.data[0] : result.data;
                
                // API 返回: bids_usd(买盘美元), asks_usd(卖盘美元), bids_quantity, asks_quantity
                const asksUsd = parseFloat(dataItem?.asks_usd || 0);
                const bidsUsd = parseFloat(dataItem?.bids_usd || 0);
                const asksQty = parseFloat(dataItem?.asks_quantity || 0);
                const bidsQty = parseFloat(dataItem?.bids_quantity || 0);
                
                console.log('✅ 大额挂单解析:', { asksUsd, bidsUsd, asksQty, bidsQty });

            return {
                    asksUsd: asksUsd,
                    bidsUsd: bidsUsd,
                    asksQuantity: asksQty,
                    bidsQuantity: bidsQty
                };
            }
            return null;
        } catch (e) {
            console.error('❌ 获取大额挂单数据失败:', e);
            return null;
        }
    },

    /**
     * 调用 DeepSeek AI 分析（通过后端代理，Key 在后端注入）
     */
    async analyzeWithDeepSeek(prompt) {
        try {
            // 使用后端代理，不再传 API Key
            const response = await fetch('/api/deepseek', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });

            if (!response.ok) {
                throw new Error(`DeepSeek API 错误: ${response.status}`);
            }
            
            const data = await response.json();
            return data.choices[0]?.message?.content || '';
        } catch (e) {
            console.error('❌ DeepSeek 分析失败:', e);
            throw e;
        }
    }
};

// 导出
window.API = API;
