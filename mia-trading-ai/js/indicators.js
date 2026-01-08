/**
 * 技术指标计算模块
 * 支持: RSI, MACD, 布林带, EMA, 支撑/阻力位
 */

const Indicators = {
    /**
     * 计算所有技术指标
     */
    calculateAll(klines15m, klines1h, klines4h, currentPrice) {
        return {
            rsi: {
                '15m': this.calculateRSI(klines15m, 14),
                '1h': this.calculateRSI(klines1h, 14),
                '4h': this.calculateRSI(klines4h, 14)
            },
            macd: {
                '15m': this.calculateMACD(klines15m),
                '1h': this.calculateMACD(klines1h)
            },
            bollingerBands: this.calculateBollingerBands(klines1h, 20, 2),
            ema: {
                ema9: this.calculateEMA(klines1h, 9),
                ema21: this.calculateEMA(klines1h, 21),
                ema50: this.calculateEMA(klines1h, 50)
            },
            levels: this.calculateKeyLevels(klines4h, currentPrice)
        };
    },

    /**
     * 计算 RSI (Relative Strength Index)
     */
    calculateRSI(klines, period = 14) {
        if (!klines || klines.length < period + 1) return null;

        const closes = klines.map(k => k.close);
        const changes = [];
        
        for (let i = 1; i < closes.length; i++) {
            changes.push(closes[i] - closes[i - 1]);
        }

        let avgGain = 0;
        let avgLoss = 0;

        // 计算初始平均值
        for (let i = 0; i < period; i++) {
            if (changes[i] > 0) {
                avgGain += changes[i];
            } else {
                avgLoss += Math.abs(changes[i]);
            }
        }

        avgGain /= period;
        avgLoss /= period;

        // 使用平滑方法计算后续值
        for (let i = period; i < changes.length; i++) {
            const change = changes[i];
            if (change > 0) {
                avgGain = (avgGain * (period - 1) + change) / period;
                avgLoss = (avgLoss * (period - 1)) / period;
            } else {
                avgGain = (avgGain * (period - 1)) / period;
                avgLoss = (avgLoss * (period - 1) + Math.abs(change)) / period;
            }
        }

        if (avgLoss === 0) return 100;
        
        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));

        return {
            value: Math.round(rsi * 100) / 100,
            status: this.getRSIStatus(rsi)
        };
    },

    /**
     * 获取 RSI 状态描述
     */
    getRSIStatus(rsi) {
        if (rsi >= 70) return { text: '超买', class: 'overbought', signal: 'sell' };
        if (rsi >= 60) return { text: '偏强', class: 'neutral', signal: 'neutral' };
        if (rsi <= 30) return { text: '超卖', class: 'oversold', signal: 'buy' };
        if (rsi <= 40) return { text: '偏弱', class: 'neutral', signal: 'neutral' };
        return { text: '中性', class: 'neutral', signal: 'neutral' };
    },

    /**
     * 计算 MACD
     */
    calculateMACD(klines, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
        if (!klines || klines.length < slowPeriod + signalPeriod) return null;

        const closes = klines.map(k => k.close);
        
        // 计算快线和慢线 EMA
        const emaFast = this.calculateEMAValues(closes, fastPeriod);
        const emaSlow = this.calculateEMAValues(closes, slowPeriod);
        
        // 计算 MACD 线 (DIF)
        const macdLine = [];
        for (let i = 0; i < closes.length; i++) {
            if (emaFast[i] !== null && emaSlow[i] !== null) {
                macdLine.push(emaFast[i] - emaSlow[i]);
            } else {
                macdLine.push(null);
            }
        }

        // 计算信号线 (DEA)
        const validMacd = macdLine.filter(v => v !== null);
        const signalLine = this.calculateEMAValues(validMacd, signalPeriod);

        // 获取最新值
        const currentMACD = macdLine[macdLine.length - 1];
        const currentSignal = signalLine[signalLine.length - 1];
        const currentHist = currentMACD - currentSignal;
        
        // 获取前一个值判断方向
        const prevMACD = macdLine[macdLine.length - 2];
        const prevSignal = signalLine[signalLine.length - 2];
        const prevHist = prevMACD - prevSignal;

        // 判断信号
        let signal = 'neutral';
        let signalText = '中性';
        
        if (currentHist > 0 && prevHist <= 0) {
            signal = 'bullish';
            signalText = '金叉';
        } else if (currentHist < 0 && prevHist >= 0) {
            signal = 'bearish';
            signalText = '死叉';
        } else if (currentHist > 0) {
            if (currentHist > prevHist) {
                signal = 'bullish';
                signalText = '多头增强';
            } else {
                signal = 'neutral';
                signalText = '多头减弱';
            }
        } else if (currentHist < 0) {
            if (currentHist < prevHist) {
                signal = 'bearish';
                signalText = '空头增强';
            } else {
                signal = 'neutral';
                signalText = '空头减弱';
            }
        }

        // 检查背离
        const divergence = this.checkMACDDivergence(klines, macdLine);

        return {
            macd: Math.round(currentMACD * 100) / 100,
            signal: Math.round(currentSignal * 100) / 100,
            histogram: Math.round(currentHist * 100) / 100,
            trend: signal,
            trendText: signalText,
            divergence: divergence
        };
    },

    /**
     * 检查 MACD 背离
     */
    checkMACDDivergence(klines, macdLine) {
        if (klines.length < 20 || macdLine.length < 20) return null;

        const recentKlines = klines.slice(-20);
        const recentMACD = macdLine.slice(-20).filter(v => v !== null);

        // 找价格和MACD的局部低点/高点
        const priceLows = this.findLocalExtremes(recentKlines.map(k => k.low), 'low');
        const priceHighs = this.findLocalExtremes(recentKlines.map(k => k.high), 'high');
        const macdLows = this.findLocalExtremes(recentMACD, 'low');
        const macdHighs = this.findLocalExtremes(recentMACD, 'high');

        // 简单背离检测
        if (priceLows.length >= 2 && macdLows.length >= 2) {
            const lastPriceLow = priceLows[priceLows.length - 1];
            const prevPriceLow = priceLows[priceLows.length - 2];
            const lastMacdLow = macdLows[macdLows.length - 1];
            const prevMacdLow = macdLows[macdLows.length - 2];

            // 底背离: 价格新低，MACD没有新低
            if (lastPriceLow.value < prevPriceLow.value && lastMacdLow.value > prevMacdLow.value) {
                return { type: 'bullish', text: '底背离 📈' };
            }
        }

        if (priceHighs.length >= 2 && macdHighs.length >= 2) {
            const lastPriceHigh = priceHighs[priceHighs.length - 1];
            const prevPriceHigh = priceHighs[priceHighs.length - 2];
            const lastMacdHigh = macdHighs[macdHighs.length - 1];
            const prevMacdHigh = macdHighs[macdHighs.length - 2];

            // 顶背离: 价格新高，MACD没有新高
            if (lastPriceHigh.value > prevPriceHigh.value && lastMacdHigh.value < prevMacdHigh.value) {
                return { type: 'bearish', text: '顶背离 📉' };
            }
        }

        return null;
    },

    /**
     * 找局部极值点
     */
    findLocalExtremes(data, type) {
        const extremes = [];
        for (let i = 2; i < data.length - 2; i++) {
            if (type === 'low') {
                if (data[i] < data[i-1] && data[i] < data[i-2] && 
                    data[i] < data[i+1] && data[i] < data[i+2]) {
                    extremes.push({ index: i, value: data[i] });
                }
            } else {
                if (data[i] > data[i-1] && data[i] > data[i-2] && 
                    data[i] > data[i+1] && data[i] > data[i+2]) {
                    extremes.push({ index: i, value: data[i] });
                }
            }
        }
        return extremes;
    },

    /**
     * 计算 EMA 数组
     */
    calculateEMAValues(data, period) {
        const ema = [];
        const multiplier = 2 / (period + 1);
        
        for (let i = 0; i < data.length; i++) {
            if (i < period - 1) {
                ema.push(null);
            } else if (i === period - 1) {
                // 初始 EMA 使用 SMA
                let sum = 0;
                for (let j = 0; j < period; j++) {
                    sum += data[j];
                }
                ema.push(sum / period);
            } else {
                ema.push((data[i] - ema[i - 1]) * multiplier + ema[i - 1]);
            }
        }
        
        return ema;
    },

    /**
     * 计算 EMA (返回最新值)
     */
    calculateEMA(klines, period) {
        if (!klines || klines.length < period) return null;
        
        const closes = klines.map(k => k.close);
        const emaValues = this.calculateEMAValues(closes, period);
        
        return Math.round(emaValues[emaValues.length - 1] * 100) / 100;
    },

    /**
     * 计算布林带
     */
    calculateBollingerBands(klines, period = 20, stdDev = 2) {
        if (!klines || klines.length < period) return null;

        const closes = klines.map(k => k.close);
        const currentPrice = closes[closes.length - 1];
        
        // 计算 SMA (中轨)
        let sum = 0;
        for (let i = closes.length - period; i < closes.length; i++) {
            sum += closes[i];
        }
        const middle = sum / period;

        // 计算标准差
        let squaredDiffSum = 0;
        for (let i = closes.length - period; i < closes.length; i++) {
            squaredDiffSum += Math.pow(closes[i] - middle, 2);
        }
        const std = Math.sqrt(squaredDiffSum / period);

        // 计算上下轨
        const upper = middle + (stdDev * std);
        const lower = middle - (stdDev * std);

        // 计算当前价格在布林带中的位置 (0-100)
        const position = ((currentPrice - lower) / (upper - lower)) * 100;

        // 判断状态
        let status = { text: '中性', class: 'neutral' };
        if (position >= 80) {
            status = { text: '接近上轨', class: 'overbought' };
        } else if (position <= 20) {
            status = { text: '接近下轨', class: 'oversold' };
        } else if (position >= 50) {
            status = { text: '中轨上方', class: 'neutral' };
        } else {
            status = { text: '中轨下方', class: 'neutral' };
        }

        return {
            upper: Math.round(upper * 100) / 100,
            middle: Math.round(middle * 100) / 100,
            lower: Math.round(lower * 100) / 100,
            position: Math.round(position),
            status: status
        };
    },

    /**
     * 计算关键支撑/阻力位
     */
    calculateKeyLevels(klines, currentPrice) {
        if (!klines || klines.length < 50) return null;

        // 收集所有高低点
        const highs = klines.map(k => k.high);
        const lows = klines.map(k => k.low);
        const closes = klines.map(k => k.close);

        // 计算枢轴点
        const lastHigh = highs[highs.length - 1];
        const lastLow = lows[lows.length - 1];
        const lastClose = closes[closes.length - 1];
        
        const pivot = (lastHigh + lastLow + lastClose) / 3;
        
        // 经典枢轴点支撑/阻力
        const r1 = 2 * pivot - lastLow;
        const r2 = pivot + (lastHigh - lastLow);
        const r3 = lastHigh + 2 * (pivot - lastLow);
        
        const s1 = 2 * pivot - lastHigh;
        const s2 = pivot - (lastHigh - lastLow);
        const s3 = lastLow - 2 * (lastHigh - pivot);

        // 找历史高低点作为额外支撑/阻力
        const recentHighs = this.findSignificantLevels(highs.slice(-50), 'high', currentPrice);
        const recentLows = this.findSignificantLevels(lows.slice(-50), 'low', currentPrice);

        // 合并并排序
        let supports = [s1, s2, s3, ...recentLows].filter(l => l < currentPrice);
        let resistances = [r1, r2, r3, ...recentHighs].filter(l => l > currentPrice);

        // 去重并排序
        supports = [...new Set(supports.map(s => Math.round(s)))].sort((a, b) => b - a).slice(0, 3);
        resistances = [...new Set(resistances.map(r => Math.round(r)))].sort((a, b) => a - b).slice(0, 3);

        return {
            supports: supports.map(s => this.formatPrice(s)),
            resistances: resistances.map(r => this.formatPrice(r)),
            pivot: this.formatPrice(pivot)
        };
    },

    /**
     * 找显著价位
     */
    findSignificantLevels(data, type, currentPrice) {
        const levels = [];
        const threshold = currentPrice * 0.02; // 2% 容差

        for (let i = 2; i < data.length - 2; i++) {
            if (type === 'high') {
                if (data[i] > data[i-1] && data[i] > data[i-2] && 
                    data[i] > data[i+1] && data[i] > data[i+2]) {
                    // 检查是否接近已有级别
                    const isUnique = !levels.some(l => Math.abs(l - data[i]) < threshold);
                    if (isUnique) levels.push(data[i]);
                }
            } else {
                if (data[i] < data[i-1] && data[i] < data[i-2] && 
                    data[i] < data[i+1] && data[i] < data[i+2]) {
                    const isUnique = !levels.some(l => Math.abs(l - data[i]) < threshold);
                    if (isUnique) levels.push(data[i]);
                }
            }
        }
        
        return levels;
    },

    /**
     * 格式化价格
     */
    formatPrice(price) {
        if (price >= 1000) {
            return Math.round(price).toLocaleString();
        } else if (price >= 1) {
            return price.toFixed(2);
        } else {
            return price.toFixed(4);
        }
    },

    /**
     * 获取 EMA 趋势判断
     */
    getEMATrend(ema9, ema21, ema50, currentPrice) {
        if (!ema9 || !ema21 || !ema50) return { text: '--', class: 'neutral' };

        // 判断趋势
        if (ema9 > ema21 && ema21 > ema50 && currentPrice > ema9) {
            return { text: '强势上涨', class: 'bullish' };
        } else if (ema9 > ema21 && currentPrice > ema9) {
            return { text: '上涨趋势', class: 'bullish' };
        } else if (ema9 < ema21 && ema21 < ema50 && currentPrice < ema9) {
            return { text: '强势下跌', class: 'bearish' };
        } else if (ema9 < ema21 && currentPrice < ema9) {
            return { text: '下跌趋势', class: 'bearish' };
        } else {
            return { text: '震荡整理', class: 'neutral' };
        }
    }
};

// 导出
window.Indicators = Indicators;
























