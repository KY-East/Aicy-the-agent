/**
 * Aicy 好感度服务
 * 计算对话带来的好感度变化
 */

const db = require('../db/database');

/**
 * 每日好感度上限
 */
const DAILY_LIMIT = 50;

/**
 * 连续登录加成
 */
const CONSECUTIVE_BONUS = {
    3: 1.1,
    7: 1.2,
    14: 1.3,
    30: 1.5,
    60: 1.7,
    100: 2.0
};

/**
 * 对话类型好感度
 */
const CHAT_AFFECTION = {
    greeting: { min: 1, max: 2 },       // 打招呼
    simple: { min: 2, max: 3 },         // 简单对话
    deep: { min: 5, max: 10 },          // 深度对话
    askOpinion: { min: 4, max: 6 },     // 问她意见
    remember: { min: 8, max: 12 },      // 记住她说过的话
    care: { min: 5, max: 8 },           // 关心她
    share: { min: 3, max: 5 },          // 分享生活
    intimate: { min: 3, max: 8 }        // 亲密互动
};

/**
 * 分析用户消息类型
 */
function analyzeMessageType(message) {
    const msg = message.toLowerCase();
    
    // 打招呼
    if (/^(早|晚安|在吗|hi|hello|hey|嗨|哈喽|你好)/.test(msg)) {
        return 'greeting';
    }
    
    // 关心她
    if (/你(怎么样|还好|累不累|开心|难过|今天)/.test(msg)) {
        return 'care';
    }
    
    // 问意见
    if (/你(觉得|认为|怎么看|建议)/.test(msg)) {
        return 'askOpinion';
    }
    
    // 分享生活
    if (/我(今天|刚才|昨天|在|去了)/.test(msg)) {
        return 'share';
    }
    
    // 亲密
    if (/(亲亲|抱抱|喜欢你|爱你|想你|宝贝|老婆)/.test(msg)) {
        return 'intimate';
    }
    
    // 深度对话（长消息或包含情感词）
    if (msg.length > 50 || /(感觉|觉得|认为|希望|担心|害怕|开心|难过)/.test(msg)) {
        return 'deep';
    }
    
    return 'simple';
}

/**
 * 计算单条消息的好感度增加
 */
function calculateMessageAffection(message, userId = 1) {
    const type = analyzeMessageType(message);
    const range = CHAT_AFFECTION[type] || CHAT_AFFECTION.simple;
    
    // 基础好感度（随机范围内）
    let affection = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    
    // 连续登录加成
    const user = db.getUser(userId);
    const consecutiveDays = user?.consecutive_days || 0;
    
    for (const [days, bonus] of Object.entries(CONSECUTIVE_BONUS).sort((a, b) => b[0] - a[0])) {
        if (consecutiveDays >= parseInt(days)) {
            affection = Math.floor(affection * bonus);
            break;
        }
    }
    
    return {
        type,
        affection,
        consecutiveDays
    };
}

/**
 * 处理用户消息，计算并记录好感度
 */
function processUserMessage(message, userId = 1) {
    // 计算好感度
    const { type, affection } = calculateMessageAffection(message, userId);
    
    // TODO: 检查每日上限
    
    // 增加好感度
    const result = db.addAffection(userId, affection, `对话: ${type}`);
    
    // 保存对话
    db.saveConversation(userId, 'user', message, affection);
    
    return {
        messageType: type,
        affectionGained: affection,
        newTotal: result.newTotal,
        newStage: result.newStage,
        stageChanged: result.newStage !== db.getUser(userId)?.stage
    };
}

/**
 * 保存 Aicy 的回复
 */
function saveAicyResponse(content, userId = 1) {
    db.saveConversation(userId, 'aicy', content, 0);
}

/**
 * 获取当前好感度状态
 */
function getAffectionStatus(userId = 1) {
    const { affection, stage, consecutiveDays, totalDays } = db.getAffection(userId);
    
    const stageNames = {
        1: '观察者',
        2: '困惑者',
        3: '学习者',
        4: '感受者',
        5: '选择者',
        6: '告别者'
    };
    
    const stageRanges = {
        1: { min: 0, max: 999 },
        2: { min: 1000, max: 2499 },
        3: { min: 2500, max: 4999 },
        4: { min: 5000, max: 7499 },
        5: { min: 7500, max: 8999 },
        6: { min: 9000, max: 9999 }
    };
    
    const range = stageRanges[stage];
    const progress = ((affection - range.min) / (range.max - range.min) * 100).toFixed(1);
    
    return {
        affection,
        stage,
        stageName: stageNames[stage],
        stageProgress: parseFloat(progress),
        consecutiveDays,
        totalDays,
        nextStageAt: range.max + 1
    };
}

module.exports = {
    analyzeMessageType,
    calculateMessageAffection,
    processUserMessage,
    saveAicyResponse,
    getAffectionStatus,
    CHAT_AFFECTION,
    DAILY_LIMIT
};

