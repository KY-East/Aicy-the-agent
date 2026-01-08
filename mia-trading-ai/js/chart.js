/**
 * TradingView Widget 模块
 * 使用官方嵌入式图表（自带实时数据）
 */

const ChartModule = {
    widget: null,
    currentCoin: 'BTC',

    // 币种对应的TradingView符号
    symbolMap: {
        BTC: 'BINANCE:BTCUSDT',
        ETH: 'BINANCE:ETHUSDT',
        SOL: 'BINANCE:SOLUSDT'
    },

    /**
     * 初始化图表
     */
    init() {
        console.log('📈 初始化 TradingView Widget...');
        this.loadWidget('BTC');
    },

    /**
     * 加载 TradingView Widget
     */
    loadWidget(coin) {
        this.currentCoin = coin;
        const symbol = this.symbolMap[coin] || 'BINANCE:BTCUSDT';
        const container = document.getElementById('tradingview_chart');
        
        if (!container) {
            console.error('❌ 图表容器不存在');
            return;
        }

        // 清空容器
        container.innerHTML = '';

        // 根据当前语言设置 locale
        const locale = window.I18n?.getCurrentLang() === 'en' ? 'en' : 'zh_CN';

        // 创建 TradingView Widget
        this.widget = new TradingView.widget({
            "autosize": true,
            "symbol": symbol,
            "interval": "15",
            "timezone": "Asia/Shanghai",
            "theme": "dark",
            "style": "1",
            "locale": locale,
            "toolbar_bg": "#0a0e17",
            "enable_publishing": false,
            "hide_top_toolbar": false,
            "hide_legend": false,
            "save_image": false,
            "container_id": "tradingview_chart",
            "studies": [
                "RSI@tv-basicstudies",
                "MACD@tv-basicstudies"
            ]
        });

        console.log(`✅ TradingView Widget 加载完成: ${symbol}`);
    },

    /**
     * 切换币种
     */
    switchCoin(coin) {
        if (coin !== this.currentCoin) {
            console.log(`🔄 切换币种: ${coin}`);
            this.loadWidget(coin);
            }
    },

    /**
     * 加载数据（兼容旧接口）
     */
    loadData(coin) {
        this.switchCoin(coin);
    }
};

// 导出
window.ChartModule = ChartModule;
