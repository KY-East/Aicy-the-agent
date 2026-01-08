/**
 * Aicy - 主应用模块
 * 对话式交互界面
 */

const App = {
    // 状态
    state: {
        currentCoin: 'BTC',
        data: null,
        isLoading: false,
        lastUpdate: null,
        chatHistory: []
    },

    /**
     * 初始化
     */
    init() {
        console.log('💕 Aicy 启动...');
        
        // 初始化多语言
        if (window.I18n) {
            I18n.init();
        }
        
        // 初始化记忆系统
        if (window.AicyMemory) {
            AicyMemory.init();
        }
        
        // 初始化图表
        if (typeof ChartModule !== 'undefined') {
            ChartModule.init();
        }
        
        // 绑定事件
        this.bindEvents();
        
        // 加载聊天记录
        this.loadChatHistory();
        
        // 加载数据
        this.loadData();
        
        // 初始化头像
        this.initAvatar();
    },

    /**
     * 加载聊天记录 (从 LocalStorage)
     */
    loadChatHistory() {
        try {
            const saved = localStorage.getItem('aicy_chat_history');
            if (saved) {
                const history = JSON.parse(saved);
                this.state.chatHistory = history;
                
                // 渲染历史消息
                const container = document.getElementById('chatMessages');
                if (container && history.length > 0) {
                    container.innerHTML = ''; // 清空默认消息
                    history.forEach(msg => {
                        this.renderMessage(msg.type, msg.text, msg.time, false);
                    });
                    console.log(`📜 已加载 ${history.length} 条聊天记录`);
                }
            }
        } catch (e) {
            console.error('加载聊天记录失败:', e);
        }
    },

    /**
     * 保存聊天记录到 LocalStorage
     */
    saveChatHistory() {
        try {
            // 最多保存 100 条消息
            const toSave = this.state.chatHistory.slice(-100);
            localStorage.setItem('aicy_chat_history', JSON.stringify(toSave));
        } catch (e) {
            console.error('保存聊天记录失败:', e);
        }
    },

    /**
     * 清空聊天记录
     */
    clearChatHistory() {
        this.state.chatHistory = [];
        localStorage.removeItem('aicy_chat_history');
        
        const container = document.getElementById('chatMessages');
        if (container) {
            container.innerHTML = '';
            // 添加欢迎消息
            this.addAicyMessage('聊天记录已清空。有什么我可以帮你的吗？');
        }
    },

    /**
     * 渲染消息到界面
     */
    renderMessage(type, text, time, save = true) {
        const container = document.getElementById('chatMessages');
        if (!container) return;
        
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${type}`;
        msgDiv.innerHTML = `
            <div class="message-content">
                <p>${text.replace(/\n/g, '</p><p>')}</p>
            </div>
            <span class="message-time">${time}</span>
        `;
        
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
        
        // 保存到历史
        if (save) {
            this.state.chatHistory.push({ type, text, time });
            this.saveChatHistory();
        }
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        // 语言切换
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.currentTarget.dataset.lang;
                if (window.I18n) {
                    I18n.setLanguage(lang);
                }
            });
        });
        
        // 币种切换
        document.querySelectorAll('.coin-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const coin = e.currentTarget.dataset.coin;
                this.switchCoin(coin);
            });
        });

        // 刷新按钮
        document.getElementById('refreshBtn')?.addEventListener('click', () => {
            this.loadData();
        });

        // 分析按钮
        document.getElementById('analyzeBtn')?.addEventListener('click', () => {
            this.analyzeMarket();
        });

        // 聊天输入
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');
        
        chatInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        sendBtn?.addEventListener('click', () => {
            this.sendMessage();
        });

        // 清空聊天记录按钮
        document.getElementById('clearChatBtn')?.addEventListener('click', () => {
            if (confirm('确定要清空所有聊天记录吗？')) {
                this.clearChatHistory();
            }
        });

        // 移动端 Aicy 侧边栏拖拽调整高度
        this.initMobileResize();

        // 移动端 Aicy 收起/展开
        this.initMobileCollapse();
    },

    /**
     * 初始化移动端拖拽调整 Aicy 侧边栏高度
     */
    initMobileResize() {
        const resizeHandle = document.getElementById('resizeHandle');
        const sidebar = document.getElementById('aicySidebar');
        
        if (!resizeHandle || !sidebar) return;
        
        let isResizing = false;
        let startY = 0;
        let startHeight = 0;

        const startResize = (e) => {
            // 只在移动端生效
            if (window.innerWidth > 900) return;
            
            isResizing = true;
            startY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            startHeight = sidebar.offsetHeight;
            
            document.body.style.cursor = 'ns-resize';
            document.body.style.userSelect = 'none';
            
            e.preventDefault();
        };

        const doResize = (e) => {
            if (!isResizing) return;
            
            const currentY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            const deltaY = startY - currentY; // 向上拖动增加高度
            const newHeight = Math.min(Math.max(startHeight + deltaY, 150), window.innerHeight * 0.8);
            
            sidebar.style.height = newHeight + 'px';
        };

        const stopResize = () => {
            if (!isResizing) return;
            
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';

            // 保存高度偏好
            localStorage.setItem('aicy_sidebar_height', sidebar.offsetHeight);
        };

        // 鼠标事件
        resizeHandle.addEventListener('mousedown', startResize);
        document.addEventListener('mousemove', doResize);
        document.addEventListener('mouseup', stopResize);

        // 触摸事件（移动端）
        resizeHandle.addEventListener('touchstart', startResize, { passive: false });
        document.addEventListener('touchmove', doResize, { passive: false });
        document.addEventListener('touchend', stopResize);

        // 恢复保存的高度
        const savedHeight = localStorage.getItem('aicy_sidebar_height');
        if (savedHeight && window.innerWidth <= 900) {
            sidebar.style.height = savedHeight + 'px';
        }
    },

    /**
     * 初始化移动端 Aicy 收起/展开功能
     */
    initMobileCollapse() {
        const sidebar = document.getElementById('aicySidebar');
        const collapseBtn = document.getElementById('collapseAicyBtn');
        const floatBtn = document.getElementById('aicyFloatBtn');
        
        if (!sidebar || !collapseBtn || !floatBtn) return;

        // 收起 Aicy
        const collapseAicy = () => {
            if (window.innerWidth > 900) return;
            
            sidebar.classList.add('collapsed');
            floatBtn.classList.remove('hidden');
            localStorage.setItem('aicy_collapsed', 'true');
        };

        // 展开 Aicy
        const expandAicy = () => {
            sidebar.classList.remove('collapsed');
            floatBtn.classList.add('hidden');
            localStorage.setItem('aicy_collapsed', 'false');
        };

        // 绑定事件
        collapseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            collapseAicy();
        });

        floatBtn.addEventListener('click', () => {
            expandAicy();
        });

        // 恢复保存的状态
        const wasCollapsed = localStorage.getItem('aicy_collapsed') === 'true';
        if (wasCollapsed && window.innerWidth <= 900) {
            sidebar.classList.add('collapsed');
            floatBtn.classList.remove('hidden');
        }

        // 监听窗口大小变化，电脑端始终展开
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) {
                sidebar.classList.remove('collapsed');
                floatBtn.classList.add('hidden');
            }
        });
    },

    /**
     * 初始化头像
     */
    initAvatar() {
        const avatar = document.getElementById('aicyAvatar');
        if (avatar) {
            avatar.onerror = () => {
                // 如果图片加载失败，显示占位符
                avatar.style.display = 'none';
                const container = avatar.parentElement;
                container.innerHTML = `
                    <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#00d4ff,#a855f7);display:flex;align-items:center;justify-content:center;font-family:Orbitron;font-size:18px;font-weight:700;color:#fff;">M</div>
                    <div class="avatar-glow"></div>
                `;
            };
        }
    },

    /**
     * 切换币种
     */
    switchCoin(coin) {
        document.querySelectorAll('.coin-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.coin === coin);
        });
        this.state.currentCoin = coin;
        this.loadData();
        
        // Aicy 响应
        this.addAicyMessage(`正在切换到 ${coin}，分析数据中...`);
    },

    /**
     * 加载数据
     */
    async loadData() {
        if (this.state.isLoading) return;
        this.state.isLoading = true;
        this.showLoading();

        try {
            const data = await API.fetchAllData(this.state.currentCoin);
            this.state.data = data;
            this.updateUI();
            this.state.lastUpdate = new Date();
            this.updateLastUpdateTime();

            if (data.error?.length > 0) {
                console.warn('⚠️ 部分数据获取失败:', data.error);
            }
        } catch (error) {
            console.error('❌ 数据加载失败:', error);
            this.addAicyMessage('数据加载遇到问题，请稍后重试。');
        } finally {
            this.state.isLoading = false;
            this.hideLoading();
        }
    },

    /**
     * 更新 UI
     */
    updateUI() {
        const { data } = this.state;
        if (!data) return;

        // 价格
        this.updatePrice(data.price);

        // 合约数据
        this.updateContractStats(data.price, data.contract);

        // RSI
        this.updateRSI(data.indicators);

        // 清算
        this.updateLiquidation(data.liquidation);

        // 情绪
        this.updateSentiment(data.sentiment);

        // 新增：买卖比
        this.updateTakerBuySell(data.takerBuySell);

        // 新增：OI 变化
        this.updateOIChange(data.oiChange);
        
        // 新增：大额挂单
        this.updateOrderbook(data.orderbook);
    },

    /**
     * 更新价格
     */
    updatePrice(price) {
        if (!price) return;

        const priceEl = document.getElementById('currentPrice');
        const changeEl = document.getElementById('priceChange');
        
        if (priceEl) {
            priceEl.textContent = '$' + this.formatNumber(price.price);
        }
        
        if (changeEl) {
            const pct = (price.priceChangePercent || 0).toFixed(2);
            changeEl.textContent = (pct >= 0 ? '+' : '') + pct + '%';
            changeEl.className = 'price-change ' + (pct >= 0 ? 'up' : 'down');
        }
    },

    /**
     * 更新合约统计
     */
    updateContractStats(price, contract) {
        // 资金费率
        const fundingRate = contract?.fundingRate?.rate || price?.avgFundingRate;
        const frEl = document.getElementById('fundingRate');
        if (frEl && fundingRate) {
            frEl.textContent = (fundingRate * 100).toFixed(4) + '%';
        }

        // 持仓量
        const oi = contract?.openInterest?.value || price?.openInterest;
        const oiEl = document.getElementById('openInterest');
        if (oiEl && oi) {
            oiEl.textContent = '$' + this.formatVolume(oi);
        }

        // 多空比
        const lsRatio = contract?.longShortRatio?.ratio || price?.longShortRatio;
        const lsEl = document.getElementById('longShortRatio');
        if (lsEl && lsRatio) {
            lsEl.textContent = parseFloat(lsRatio).toFixed(2);
        }

        // 大户多空比
        const topRatio = contract?.topTraderRatio?.ratio;
        const topEl = document.getElementById('topTraderRatio');
        if (topEl) {
            topEl.textContent = topRatio ? parseFloat(topRatio).toFixed(2) : '--';
        }
    },

    /**
     * 更新 RSI
     */
    updateRSI(indicators) {
        if (!indicators) return;

        const rsiMap = {
            'rsi15m': indicators.rsi15m,
            'rsi1h': indicators.rsi1h,
            'rsi4h': indicators.rsi4h,
            'rsi1d': indicators.rsi1d
        };

        Object.entries(rsiMap).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el && value) {
                el.textContent = value.toFixed(1);
                // 颜色
                if (value >= 70) el.classList.add('text-down');
                else if (value <= 30) el.classList.add('text-up');
                else el.classList.remove('text-up', 'text-down');
        }
        });
    },

    /**
     * 更新清算数据
     */
    updateLiquidation(liq) {
        if (!liq) return;

        const totalEl = document.getElementById('liqTotal');
        if (totalEl && liq.total24h) {
            totalEl.textContent = '$' + this.formatVolume(liq.total24h);
        }

        // 清算条
        const longBar = document.getElementById('liqLongBar');
        const shortBar = document.getElementById('liqShortBar');
        const longPct = document.getElementById('liqLongPercent');
        const shortPct = document.getElementById('liqShortPercent');

        if (longBar && liq.longPercent !== undefined) {
            longBar.style.width = liq.longPercent.toFixed(1) + '%';
        }
        if (shortBar && liq.shortPercent !== undefined) {
            shortBar.style.width = liq.shortPercent.toFixed(1) + '%';
        }
        if (longPct && liq.longPercent !== undefined) {
            longPct.textContent = liq.longPercent.toFixed(0) + '%';
            }
        if (shortPct && liq.shortPercent !== undefined) {
            shortPct.textContent = liq.shortPercent.toFixed(0) + '%';
        }
    },

    /**
     * 更新情绪指数
     */
    updateSentiment(sentiment) {
        if (!sentiment?.current) return;

        const { value, classification } = sentiment.current;

        const valueEl = document.getElementById('fgiValue');
        const labelEl = document.getElementById('fgiLabel');

        if (valueEl) {
            valueEl.textContent = value;
            // 颜色
            if (value <= 25) valueEl.style.color = '#ff3366';
            else if (value <= 45) valueEl.style.color = '#ff6b35';
            else if (value <= 55) valueEl.style.color = '#ffaa00';
            else if (value <= 75) valueEl.style.color = '#84cc16';
            else valueEl.style.color = '#00ff88';
        }

        if (labelEl) {
            labelEl.textContent = this.translateFGI(classification);
        }

        // 历史
        if (sentiment.yesterday) {
            const el = document.getElementById('fgiYesterday');
            if (el) el.textContent = sentiment.yesterday.value;
        }
        if (sentiment.lastWeek) {
            const el = document.getElementById('fgiWeek');
            if (el) el.textContent = sentiment.lastWeek.value;
        }
        if (sentiment.lastMonth) {
            const el = document.getElementById('fgiMonth');
            if (el) el.textContent = sentiment.lastMonth.value;
        }
    },

    /**
     * 更新主动买卖比
     */
    updateTakerBuySell(taker) {
        const ratioEl = document.getElementById('takerRatio');
        const buyBar = document.getElementById('takerBuyBar');
        const sellBar = document.getElementById('takerSellBar');
        const buyPct = document.getElementById('takerBuyPercent');
        const sellPct = document.getElementById('takerSellPercent');

        if (!taker) {
            if (ratioEl) ratioEl.textContent = '--';
            return;
        }

        if (ratioEl) {
            ratioEl.textContent = taker.ratio;
            ratioEl.className = 'taker-ratio';
            if (parseFloat(taker.ratio) > 1.1) {
                ratioEl.classList.add('buy-dominant');
            } else if (parseFloat(taker.ratio) < 0.9) {
                ratioEl.classList.add('sell-dominant');
            } else {
                ratioEl.classList.add('balanced');
            }
        }

        if (buyBar) buyBar.style.width = taker.buyPercent.toFixed(1) + '%';
        if (sellBar) sellBar.style.width = taker.sellPercent.toFixed(1) + '%';
        if (buyPct) buyPct.textContent = taker.buyPercent.toFixed(0) + '%';
        if (sellPct) sellPct.textContent = taker.sellPercent.toFixed(0) + '%';
    },

    /**
     * 更新 OI 变化 - 从 price 数据获取
     */
    updateOIChange(oiChange) {
        const valueEl = document.getElementById('oiChangeValue');
        const hintEl = document.getElementById('oiChangeHint');
        
        // 从 price 数据获取 OI 变化
        const price = this.state.data?.price;

        if (!price || (!price.oiChangePercent && !price.oiChange24h)) {
            if (valueEl) valueEl.textContent = '--';
            if (hintEl) hintEl.textContent = '24H 持仓变化';
            return;
        }

        if (valueEl) {
            const pct = price.oiChangePercent || 0;
            valueEl.textContent = (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%';
            valueEl.className = 'oi-change-value ' + (pct >= 0 ? 'positive' : 'negative');
        }

        if (hintEl) {
            const change = price.oiChange24h || 0;
            if (change >= 0) {
                hintEl.textContent = I18n.t('increase') + ' $' + this.formatVolume(change);
            } else {
                hintEl.textContent = I18n.t('decrease') + ' $' + this.formatVolume(Math.abs(change));
            }
        }
    },

    /**
     * 更新大额挂单 - 显示订单簿深度
     */
    updateOrderbook(orderbook) {
        const askPrice1 = document.getElementById('askPrice1');
        const askAmount1 = document.getElementById('askAmount1');
        const bidPrice1 = document.getElementById('bidPrice1');
        const bidAmount1 = document.getElementById('bidAmount1');

        if (!orderbook) {
            if (askPrice1) askPrice1.textContent = I18n.t('ask_5');
            if (askAmount1) askAmount1.textContent = '--';
            if (bidPrice1) bidPrice1.textContent = I18n.t('bid_5');
            if (bidAmount1) bidAmount1.textContent = '--';
            return;
        }

        // 显示卖盘深度（±5%范围内）- API 返回 asksUsd/bidsUsd
        if (askPrice1) askPrice1.textContent = I18n.t('ask_5');
        if (askAmount1) {
            const askTotal = orderbook.asksUsd || orderbook.askTotal || 0;
            askAmount1.textContent = askTotal > 0 ? '$' + this.formatVolume(askTotal) : '--';
        }

        // 显示买盘深度（±5%范围内）
        if (bidPrice1) bidPrice1.textContent = I18n.t('bid_5');
        if (bidAmount1) {
            const bidTotal = orderbook.bidsUsd || orderbook.bidTotal || 0;
            bidAmount1.textContent = bidTotal > 0 ? '$' + this.formatVolume(bidTotal) : '--';
        }
    },

    /**
     * 发送用户消息
     */
    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input?.value.trim();
        
        if (!message) return;
        
        // 显示用户消息
        this.addUserMessage(message);
        input.value = '';
        
        // Aicy 响应
        this.handleUserMessage(message);
    },

    /**
     * 处理用户消息
     */
    async handleUserMessage(message) {
        const lowerMsg = message.toLowerCase();
        
        // 简单的关键词响应
        if (lowerMsg.includes('分析') || lowerMsg.includes('策略')) {
            await this.analyzeMarket();
        } else if (lowerMsg.includes('价格') || lowerMsg.includes('多少')) {
            const price = this.state.data?.price?.price;
            this.addAicyMessage(`${this.state.currentCoin} 当前价格 $${this.formatNumber(price)}`);
        } else if (lowerMsg.includes('rsi')) {
            const rsi = this.state.data?.indicators;
            if (rsi) {
                this.addAicyMessage(`RSI 指标:\n• 15分钟: ${rsi.rsi15m?.toFixed(1) || '--'}\n• 1小时: ${rsi.rsi1h?.toFixed(1) || '--'}\n• 4小时: ${rsi.rsi4h?.toFixed(1) || '--'}\n• 日线: ${rsi.rsi1d?.toFixed(1) || '--'}`);
            }
        } else if (lowerMsg.includes('情绪') || lowerMsg.includes('恐惧')) {
            const fgi = this.state.data?.sentiment?.current;
            if (fgi) {
                this.addAicyMessage(`市场情绪: ${fgi.value} (${this.translateFGI(fgi.classification)})`);
            }
        } else {
            // 调用 DeepSeek API
            await this.askDeepSeek(message);
        }
    },

    /**
     * 市场分析
     */
    async analyzeMarket() {
        if (!this.state.data) {
            this.addAicyMessage('数据还在加载中，请稍等...');
            return;
        }

        this.addAicyMessage('正在分析市场数据...', false); // 临时消息不保存

        // 构建分析数据
        const { data } = this.state;
        const analysis = this.generateAnalysis(data);
        
        // 显示策略
        this.displayStrategy(analysis);
        
        // Aicy 消息
        this.addAicyMessage(analysis.summary);
    },

    /**
     * 生成分析
     */
    generateAnalysis(data) {
        const price = data.price;
        const indicators = data.indicators;
        const contract = data.contract;
        const sentiment = data.sentiment;
        
        // 评分系统
        let bullScore = 0;
        let bearScore = 0;
        
        // RSI 分析
        const rsi1h = indicators?.rsi1h || 50;
        if (rsi1h < 30) bullScore += 2;
        else if (rsi1h < 40) bullScore += 1;
        else if (rsi1h > 70) bearScore += 2;
        else if (rsi1h > 60) bearScore += 1;
        
        // 资金费率分析
        const fundingRate = contract?.fundingRate?.rate || price?.avgFundingRate || 0;
        if (fundingRate > 0.001) bearScore += 1; // 高费率可能回调
        else if (fundingRate < -0.001) bullScore += 1;
        
        // 多空比分析
        const lsRatio = contract?.longShortRatio?.ratio || price?.longShortRatio || 1;
        if (lsRatio > 1.5) bearScore += 1; // 过多做多可能回调
        else if (lsRatio < 0.7) bullScore += 1;
        
        // 情绪分析
        const fgiValue = sentiment?.current?.value || 50;
        if (fgiValue < 25) bullScore += 2; // 极度恐惧是买入机会
        else if (fgiValue < 40) bullScore += 1;
        else if (fgiValue > 75) bearScore += 2;
        else if (fgiValue > 60) bearScore += 1;
        
        // 判断方向
        let direction = 'NEUTRAL';
        let confidence = 0.5;
        
        const totalScore = bullScore + bearScore;
        if (bullScore > bearScore + 1) {
            direction = 'LONG';
            confidence = Math.min(0.9, 0.5 + (bullScore - bearScore) * 0.1);
        } else if (bearScore > bullScore + 1) {
            direction = 'SHORT';
            confidence = Math.min(0.9, 0.5 + (bearScore - bullScore) * 0.1);
        }
        
        // 计算价位
        const currentPrice = price?.price || 0;
        const entryPrice = currentPrice;
        const stopLoss = direction === 'LONG' 
            ? currentPrice * 0.97 
            : currentPrice * 1.03;
        const takeProfit = direction === 'LONG'
            ? currentPrice * 1.05
            : currentPrice * 0.95;
        
        // 风险等级
        let riskLevel = 'MEDIUM';
        if (Math.abs(fundingRate) > 0.001 || fgiValue < 20 || fgiValue > 80) {
            riskLevel = 'HIGH';
        } else if (fgiValue >= 40 && fgiValue <= 60 && Math.abs(lsRatio - 1) < 0.2) {
            riskLevel = 'LOW';
        }
        
        // 生成摘要
        let summary = `${this.state.currentCoin} 分析完成。\n\n`;
        
        if (direction === 'LONG') {
            summary += `📈 建议方向: 做多\n`;
        } else if (direction === 'SHORT') {
            summary += `📉 建议方向: 做空\n`;
        } else {
            summary += `⚖️ 建议: 观望\n`;
        }
        
        summary += `信心度: ${(confidence * 100).toFixed(0)}%\n`;
        summary += `风险等级: ${riskLevel === 'HIGH' ? '高' : riskLevel === 'LOW' ? '低' : '中'}\n\n`;
        
        summary += `分析依据:\n`;
        summary += `• RSI(1H): ${rsi1h.toFixed(1)} ${rsi1h < 30 ? '(超卖)' : rsi1h > 70 ? '(超买)' : '(中性)'}\n`;
        summary += `• 资金费率: ${(fundingRate * 100).toFixed(4)}%\n`;
        summary += `• 多空比: ${lsRatio.toFixed(2)}\n`;
        summary += `• 恐惧指数: ${fgiValue} (${this.translateFGI(sentiment?.current?.classification)})`;
        
        return {
            direction,
            confidence,
            entry: entryPrice,
            stopLoss,
            takeProfit,
            riskLevel,
            summary
        };
    },

    /**
     * 显示策略
     */
    displayStrategy(analysis) {
        const container = document.getElementById('strategyContent');
        if (!container) return;
        
        const dirClass = analysis.direction.toLowerCase();
        const dirText = analysis.direction === 'LONG' ? '做多' : 
                       analysis.direction === 'SHORT' ? '做空' : '观望';
        
        container.innerHTML = `
            <div class="strategy-result">
                <div class="strategy-direction ${dirClass}">
                    ${dirText}
                </div>
                <div class="strategy-details">
                    <div class="strategy-item">
                        <span class="strategy-item-label">信心度</span>
                        <span class="strategy-item-value">${(analysis.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div class="strategy-item">
                        <span class="strategy-item-label">风险</span>
                        <span class="strategy-item-value">${analysis.riskLevel === 'HIGH' ? '高' : analysis.riskLevel === 'LOW' ? '低' : '中'}</span>
                    </div>
                    <div class="strategy-item">
                        <span class="strategy-item-label">入场</span>
                        <span class="strategy-item-value">$${this.formatNumber(analysis.entry)}</span>
                    </div>
                    <div class="strategy-item">
                        <span class="strategy-item-label">止损</span>
                        <span class="strategy-item-value">$${this.formatNumber(analysis.stopLoss)}</span>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * 调用 Aicy Chat API（带好感度系统）
     */
    async askDeepSeek(question) {
        this.addAicyMessage(I18n.t('thinking'), false); // 临时消息不保存
        
        try {
            // 获取当前语言
            const language = window.I18n?.currentLang || 'zh';
            
            // 调用新的 Aicy Chat API
            const response = await fetch('/api/aicy/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: question,
                    language: language
                })
            });
            
            const result = await response.json();
            
            if (result.error) {
                console.error('Aicy API 返回错误:', result.error);
                this.removeLastAicyMessage();
                this.addAicyMessage(`API 错误: ${result.error}`);
                return;
            }
            
            // 打印好感度信息（调试用）
            if (result.affection) {
                console.log(`💕 好感度: +${result.affection.gained} → ${result.affection.total} (${result.affection.stageName})`);
            }
            
            if (result.reply) {
                // 移除"思考中"消息，添加真实回复
                this.removeLastAicyMessage();
                this.addAicyMessage(result.reply);
            } else {
                this.removeLastAicyMessage();
                this.addAicyMessage('抱歉，我暂时无法回答这个问题。');
            }
        } catch (error) {
            console.error('Aicy API 错误:', error);
            this.removeLastAicyMessage();
            this.addAicyMessage('网络连接出现问题，请稍后重试。');
        }
    },

    /**
     * 构建上下文
     */
    buildContext() {
        const data = this.state.data;
        if (!data) return '数据加载中...';
        
        let context = `${this.state.currentCoin}/USDT\n`;
        context += `价格: $${this.formatNumber(data.price?.price)}\n`;
        context += `24H涨跌: ${(data.price?.priceChangePercent || 0).toFixed(2)}%\n`;
        context += `RSI(1H): ${data.indicators?.rsi1h?.toFixed(1) || '--'}\n`;
        context += `资金费率: ${((data.contract?.fundingRate?.rate || data.price?.avgFundingRate || 0) * 100).toFixed(4)}%\n`;
        context += `多空比: ${(data.contract?.longShortRatio?.ratio || data.price?.longShortRatio || 1).toFixed(2)}\n`;
        context += `恐惧指数: ${data.sentiment?.current?.value || '--'}`;
        
        return context;
    },

    /**
     * 添加 Aicy 消息
     */
    addAicyMessage(text, save = true) {
        const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        this.renderMessage('aicy', text, time, save);
    },

    /**
     * 添加用户消息
     */
    addUserMessage(text) {
        const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        this.renderMessage('user', text, time, true);
    },

    /**
     * 移除最后一条 Aicy 消息
     */
    removeLastAicyMessage() {
        const container = document.getElementById('chatMessages');
        if (!container) return;
        
        const messages = container.querySelectorAll('.message.aicy');
        if (messages.length > 0) {
            messages[messages.length - 1].remove();
        }
    },

    /**
     * 更新时间
     */
    updateLastUpdateTime() {
        const el = document.getElementById('lastUpdate');
        if (el && this.state.lastUpdate) {
            el.textContent = this.state.lastUpdate.toLocaleTimeString('zh-CN');
        }
    },

    /**
     * 显示加载
     */
    showLoading() {
        document.getElementById('loadingOverlay')?.classList.add('active');
    },

    /**
     * 隐藏加载
     */
    hideLoading() {
        document.getElementById('loadingOverlay')?.classList.remove('active');
    },

    /**
     * 格式化数字
     */
    formatNumber(num) {
        if (!num) return '--';
        return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
    },

    /**
     * 格式化成交量
     */
    formatVolume(vol) {
        if (!vol) return '--';
        if (vol >= 1e9) return (vol / 1e9).toFixed(2) + 'B';
        if (vol >= 1e6) return (vol / 1e6).toFixed(2) + 'M';
        if (vol >= 1e3) return (vol / 1e3).toFixed(2) + 'K';
        return vol.toFixed(2);
    },

    /**
     * 翻译恐惧指数
     */
    translateFGI(classification) {
        const map = {
            'Extreme Fear': 'extreme_fear',
            'Fear': 'fear',
            'Neutral': 'neutral',
            'Greed': 'greed',
            'Extreme Greed': 'extreme_greed'
        };
        const key = map[classification];
        return key ? I18n.t(key) : (classification || '--');
    },

    /**
     * 语言切换后刷新动态内容
     */
    refreshDynamicContent() {
        // 如果有缓存的数据，重新更新显示
        if (this.state?.data) {
            this.updateOrderbook(this.state.data.orderbook);
            this.updateSentiment(this.state.data.sentiment);
            this.updateOIChange(this.state.data.price);
        }
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => App.init());
window.App = App;
