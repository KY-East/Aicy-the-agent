/**
 * Aicy User API
 * 用户信息、好感度查询
 */

const db = require('../db/database');
const affectionService = require('../services/affection');

/**
 * 获取用户状态
 */
function handleGetStatus(req, res, userId = 1) {
    try {
        const status = affectionService.getAffectionStatus(userId);
        const profile = db.getUserProfile(userId);
        const completedMoments = db.getCompletedKeyMoments(userId);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            ...status,
            profile,
            completedMoments: completedMoments.length,
            totalMoments: 100
        }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
    }
}

/**
 * 更新用户画像
 */
function handleUpdateProfile(req, res) {
    return new Promise((resolve) => {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const { userId = 1, key, value } = JSON.parse(body);
                
                if (!key || !value) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'key 和 value 不能为空' }));
                    return resolve();
                }
                
                db.saveUserProfile(userId, key, value);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
                resolve();
                
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
                resolve();
            }
        });
    });
}

/**
 * 获取好感度日志
 */
function handleGetAffectionLog(req, res, userId = 1, limit = 50) {
    try {
        // 从内存读取（JSON 文件已加载到内存）
        const data = require('../db/database');
        const user = data.getUser(userId);
        
        // 简单返回用户当前状态
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            affection: user?.affection || 0,
            stage: user?.stage || 1
        }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
    }
}

/**
 * 重置用户（测试用）
 */
function handleReset(req, res, userId = 1) {
    try {
        db.resetAll(userId);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: '用户数据已重置' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
    }
}

module.exports = {
    handleGetStatus,
    handleUpdateProfile,
    handleGetAffectionLog,
    handleReset
};
