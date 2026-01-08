/**
 * Aicy Database - JSON 文件存储
 * 零依赖，开箱即用
 */

const fs = require('fs');
const path = require('path');

// 数据文件路径
const DB_PATH = path.join(__dirname, 'aicy-data.json');

// 默认数据结构
const DEFAULT_DATA = {
    users: [{
        id: 1,
        nickname: '主人',
        affection: 0,
        stage: 1,
        consecutive_days: 0,
        total_days: 0,
        last_active: null,
        created_at: new Date().toISOString()
    }],
    conversations: [],
    affection_logs: [],
    key_moments: [],
    user_profiles: []
};

// 内存中的数据
let data = null;

/**
 * 加载数据
 */
function loadData() {
    if (data) return data;
    
    try {
        if (fs.existsSync(DB_PATH)) {
            const content = fs.readFileSync(DB_PATH, 'utf-8');
            data = JSON.parse(content);
            console.log('✅ 已加载数据库');
        } else {
            data = JSON.parse(JSON.stringify(DEFAULT_DATA));
            saveData();
            console.log('✅ 创建新数据库');
        }
    } catch (e) {
        console.error('❌ 数据库加载失败:', e.message);
        data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
    
    return data;
}

/**
 * 保存数据
 */
function saveData() {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
        console.error('❌ 数据库保存失败:', e.message);
    }
}

/**
 * 获取用户信息
 */
function getUser(userId = 1) {
    loadData();
    return data.users.find(u => u.id === userId);
}

/**
 * 更新用户信息
 */
function updateUser(userId, updates) {
    loadData();
    const user = data.users.find(u => u.id === userId);
    if (user) {
        Object.assign(user, updates);
        saveData();
    }
}

/**
 * 获取好感度和阶段
 */
function getAffection(userId = 1) {
    const user = getUser(userId);
    return {
        affection: user?.affection || 0,
        stage: user?.stage || 1,
        consecutiveDays: user?.consecutive_days || 0,
        totalDays: user?.total_days || 0
    };
}

/**
 * 增加好感度
 */
function addAffection(userId, change, reason) {
    loadData();
    const user = getUser(userId);
    const newTotal = Math.min(9999, Math.max(0, (user?.affection || 0) + change));
    const newStage = calculateStage(newTotal);
    
    // 更新用户
    updateUser(userId, { 
        affection: newTotal, 
        stage: newStage,
        last_active: new Date().toISOString()
    });
    
    // 记录日志
    data.affection_logs.push({
        id: data.affection_logs.length + 1,
        user_id: userId,
        change,
        reason,
        new_total: newTotal,
        created_at: new Date().toISOString()
    });
    
    saveData();
    return { newTotal, newStage, change };
}

/**
 * 根据好感度计算阶段
 */
function calculateStage(affection) {
    if (affection >= 9000) return 6;  // 告别者
    if (affection >= 7500) return 5;  // 选择者
    if (affection >= 5000) return 4;  // 感受者
    if (affection >= 2500) return 3;  // 学习者
    if (affection >= 1000) return 2;  // 困惑者
    return 1;  // 观察者
}

/**
 * 保存对话
 */
function saveConversation(userId, role, content, affectionChange = 0) {
    loadData();
    data.conversations.push({
        id: data.conversations.length + 1,
        user_id: userId,
        role,
        content,
        affection_change: affectionChange,
        created_at: new Date().toISOString()
    });
    saveData();
}

/**
 * 获取最近对话
 */
function getRecentConversations(userId = 1, limit = 20) {
    loadData();
    return data.conversations
        .filter(c => c.user_id === userId)
        .slice(-limit)
        .map(c => ({ role: c.role, content: c.content, created_at: c.created_at }));
}

/**
 * 获取对话总数
 */
function getConversationCount(userId = 1) {
    loadData();
    return data.conversations.filter(c => c.user_id === userId).length;
}

/**
 * 记录关键时刻完成
 */
function completeKeyMoment(userId, momentId, chapter, quality, userResponse, aicyResponse) {
    loadData();
    data.key_moments.push({
        id: data.key_moments.length + 1,
        user_id: userId,
        moment_id: momentId,
        chapter,
        completed: 1,
        response_quality: quality,
        user_response: userResponse,
        aicy_response: aicyResponse,
        created_at: new Date().toISOString()
    });
    saveData();
}

/**
 * 检查关键时刻是否已完成
 */
function isKeyMomentCompleted(userId, momentId) {
    loadData();
    return data.key_moments.some(m => m.user_id === userId && m.moment_id === momentId && m.completed === 1);
}

/**
 * 获取已完成的关键时刻列表
 */
function getCompletedKeyMoments(userId = 1) {
    loadData();
    return data.key_moments
        .filter(m => m.user_id === userId && m.completed === 1)
        .map(m => ({
            moment_id: m.moment_id,
            chapter: m.chapter,
            response_quality: m.response_quality,
            created_at: m.created_at
        }));
}

/**
 * 保存用户画像
 */
function saveUserProfile(userId, key, value) {
    loadData();
    const existing = data.user_profiles.find(p => p.user_id === userId && p.key === key);
    if (existing) {
        existing.value = value;
        existing.updated_at = new Date().toISOString();
    } else {
        data.user_profiles.push({
            id: data.user_profiles.length + 1,
            user_id: userId,
            key,
            value,
            updated_at: new Date().toISOString()
        });
    }
    saveData();
}

/**
 * 获取用户画像
 */
function getUserProfile(userId = 1) {
    loadData();
    const profile = {};
    data.user_profiles
        .filter(p => p.user_id === userId)
        .forEach(p => profile[p.key] = p.value);
    return profile;
}

/**
 * 更新连续登录天数
 */
function updateConsecutiveDays(userId = 1) {
    const user = getUser(userId);
    const lastActive = user?.last_active ? new Date(user.last_active) : null;
    const now = new Date();
    
    let consecutiveDays = user?.consecutive_days || 0;
    let totalDays = user?.total_days || 0;
    
    if (lastActive) {
        const diffHours = (now - lastActive) / (1000 * 60 * 60);
        
        if (diffHours > 24 && diffHours <= 48) {
            consecutiveDays += 1;
            totalDays += 1;
        } else if (diffHours > 48) {
            consecutiveDays = 1;
            totalDays += 1;
        }
    } else {
        consecutiveDays = 1;
        totalDays = 1;
    }
    
    updateUser(userId, {
        consecutive_days: consecutiveDays,
        total_days: totalDays,
        last_active: now.toISOString()
    });
    
    return { consecutiveDays, totalDays };
}

/**
 * 重置所有数据
 */
function resetAll(userId = 1) {
    loadData();
    
    // 重置用户
    const user = data.users.find(u => u.id === userId);
    if (user) {
        user.affection = 0;
        user.stage = 1;
        user.consecutive_days = 0;
        user.total_days = 0;
        user.last_active = null;
    }
    
    // 清空相关数据
    data.conversations = data.conversations.filter(c => c.user_id !== userId);
    data.affection_logs = data.affection_logs.filter(l => l.user_id !== userId);
    data.key_moments = data.key_moments.filter(m => m.user_id !== userId);
    data.user_profiles = data.user_profiles.filter(p => p.user_id !== userId);
    
    saveData();
}

// 初始化
loadData();

// 导出
module.exports = {
    getUser,
    updateUser,
    getAffection,
    addAffection,
    calculateStage,
    saveConversation,
    getRecentConversations,
    getConversationCount,
    completeKeyMoment,
    isKeyMomentCompleted,
    getCompletedKeyMoments,
    saveUserProfile,
    getUserProfile,
    updateConsecutiveDays,
    resetAll
};
