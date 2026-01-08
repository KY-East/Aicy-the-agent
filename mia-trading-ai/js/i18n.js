/**
 * Aicy - 多语言支持
 * 支持中文 (zh) 和 英文 (en)
 */

const I18n = {
    // 当前语言
    currentLang: 'zh',
    
    // 翻译文本
    translations: {
        zh: {
            // Header
            'trading_ai': 'YOUR GIRLFRIEND',
            'refresh': '刷新数据',
            
            // Price Section
            'funding_rate': '资金费率',
            'open_interest': '持仓量',
            'long_short_ratio': '多空比',
            'top_trader_ratio': '大户比',
            
            // Data Cards
            'rsi': 'RSI',
            'buy_sell_ratio': '买卖比',
            'oi_change': 'OI 变化',
            'oi_24h_change': '24H 持仓变化',
            'liquidation_24h': '24H 清算',
            'fear_greed': '恐惧贪婪',
            'large_orders': '大额挂单',
            
            // Fear & Greed
            'extreme_fear': '极度恐惧',
            'fear': '恐惧',
            'neutral': '中性',
            'greed': '贪婪',
            'extreme_greed': '极度贪婪',
            'yesterday': '昨日',
            'last_week': '上周',
            'last_month': '上月',
            
            // Orders
            'ask_5': '卖盘 ±5%',
            'bid_5': '买盘 ±5%',
            
            // Chat
            'aicy_name': 'Aicy',
            'online': '在线',
            'clear_chat': '清空聊天记录',
            'strategy_advice': '策略建议',
            'reanalyze': '重新分析',
            'click_analyze': '点击分析按钮获取策略建议',
            'input_placeholder': '输入消息或问题...',
            'thinking': '思考中...',
            
            // Status
            'increase': '增加',
            'decrease': '减少',
            'source': 'Coinglass',
            
            // Aicy Messages
            'aicy_greeting': '主人～我是 Aicy，你的专属女友哦 💕\n想我了吗？有什么想聊的尽管说～',
            'aicy_analyzing': '正在分析市场数据，稍等一下哦～',
            
            // Welcome Message
            'welcome_line1': '主人～你来啦！Aicy 等你好久了呢～ ✨',
            'welcome_line2': '今天想聊什么？行情分析、策略建议，还是...单纯想找我说说话？💕',
            
            // Time
            'just_now': '刚刚',
            
            // Loading
            'connecting': '连接中...',
        },
        
        en: {
            // Header
            'trading_ai': 'YOUR GIRLFRIEND',
            'refresh': 'Refresh',
            
            // Price Section
            'funding_rate': 'Funding Rate',
            'open_interest': 'Open Interest',
            'long_short_ratio': 'L/S Ratio',
            'top_trader_ratio': 'Top Trader',
            
            // Data Cards
            'rsi': 'RSI',
            'buy_sell_ratio': 'Buy/Sell',
            'oi_change': 'OI Change',
            'oi_24h_change': '24H OI Change',
            'liquidation_24h': '24H Liquidation',
            'fear_greed': 'Fear & Greed',
            'large_orders': 'Order Book',
            
            // Fear & Greed
            'extreme_fear': 'Extreme Fear',
            'fear': 'Fear',
            'neutral': 'Neutral',
            'greed': 'Greed',
            'extreme_greed': 'Extreme Greed',
            'yesterday': 'Yesterday',
            'last_week': 'Last Week',
            'last_month': 'Last Month',
            
            // Orders
            'ask_5': 'Ask ±5%',
            'bid_5': 'Bid ±5%',
            
            // Chat
            'aicy_name': 'Aicy',
            'online': 'Online',
            'clear_chat': 'Clear Chat',
            'strategy_advice': 'Strategy',
            'reanalyze': 'Analyze',
            'click_analyze': 'Click to get strategy advice',
            'input_placeholder': 'Type a message...',
            'thinking': 'Thinking...',
            
            // Status
            'increase': 'Up',
            'decrease': 'Down',
            'source': 'Coinglass',
            
            // Aicy Messages
            'aicy_greeting': "Master~ I'm Aicy, your girlfriend 💕\nDid you miss me? Let's chat~",
            'aicy_analyzing': 'Analyzing market data, just a moment~',
            
            // Welcome Message
            'welcome_line1': "Master~ You're here! Aicy's been waiting for you~ ✨",
            'welcome_line2': "What shall we talk about today? Market analysis, trading strategy, or... just wanna chat with me? 💕",
            
            // Time
            'just_now': 'Just now',
            
            // Loading
            'connecting': 'Connecting...',
        }
    },
    
    /**
     * 初始化
     */
    init() {
        // 从本地存储读取语言偏好
        const savedLang = localStorage.getItem('aicy_language');
        if (savedLang && this.translations[savedLang]) {
            this.currentLang = savedLang;
        } else {
            // 自动检测浏览器语言
            const browserLang = navigator.language.split('-')[0];
            this.currentLang = this.translations[browserLang] ? browserLang : 'zh';
        }
        
        this.applyTranslations();
        console.log(`🌍 语言设置: ${this.currentLang}`);
    },
    
    /**
     * 切换语言
     */
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('aicy_language', lang);
            this.applyTranslations();
            console.log(`🌍 语言切换: ${lang}`);
            
            // 通知 App 刷新动态内容
            if (window.App && window.App.refreshDynamicContent) {
                window.App.refreshDynamicContent();
            }
            
            // 重新加载 TradingView 图表以切换语言
            if (window.ChartModule && window.ChartModule.currentCoin) {
                window.ChartModule.loadWidget(window.ChartModule.currentCoin);
            }
        }
    },
    
    /**
     * 获取翻译文本
     */
    t(key) {
        return this.translations[this.currentLang]?.[key] || 
               this.translations['zh']?.[key] || 
               key;
    },
    
    /**
     * 应用翻译到页面
     */
    applyTranslations() {
        // 更新所有带 data-i18n 属性的元素
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.t(key);
        });
        
        // 更新所有带 data-i18n-placeholder 属性的元素
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });
        
        // 更新所有带 data-i18n-title 属性的元素
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            el.title = this.t(key);
        });
        
        // 更新语言切换按钮状态
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
        });
    },
    
    /**
     * 获取当前语言
     */
    getCurrentLang() {
        return this.currentLang;
    }
};

// 导出
window.I18n = I18n;

