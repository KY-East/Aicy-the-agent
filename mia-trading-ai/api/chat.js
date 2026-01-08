/**
 * Aicy Chat API
 * 处理对话请求，构建 Context，调用 DeepSeek
 */

const https = require('https');
const db = require('../db/database');
const affectionService = require('../services/affection');
const contextService = require('../services/context');

/**
 * 处理聊天请求
 */
async function handleChat(req, res, config) {
    return new Promise((resolve) => {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', async () => {
            try {
                const { message, userId = 1, language = 'zh' } = JSON.parse(body);
                
                if (!message) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: '消息不能为空' }));
                    return resolve();
                }
                
                // 1. 更新连续登录天数
                db.updateConsecutiveDays(userId);
                
                // 2. 处理用户消息，计算好感度
                const affectionResult = affectionService.processUserMessage(message, userId);
                
                // 3. 构建 Context
                const context = contextService.buildContext(userId, language);
                
                // 4. 添加当前用户消息
                const messages = [
                    { role: 'system', content: context.systemPrompt },
                    ...context.messages,
                    { role: 'user', content: message }
                ];
                
                // 5. 调用 DeepSeek API
                const aiResponse = await callDeepSeek(messages, config.DEEPSEEK_API_KEY);
                
                // 6. 保存 Aicy 回复
                affectionService.saveAicyResponse(aiResponse, userId);
                
                // 7. 返回结果
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    reply: aiResponse,
                    affection: {
                        gained: affectionResult.affectionGained,
                        total: affectionResult.newTotal,
                        stage: affectionResult.newStage,
                        stageName: contextService.getStageName(affectionResult.newStage)
                    },
                    metadata: context.metadata
                }));
                
                resolve();
                
            } catch (error) {
                console.error('Chat error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
                resolve();
            }
        });
    });
}

/**
 * 调用 DeepSeek API
 */
function callDeepSeek(messages, apiKey) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            model: 'deepseek-chat',
            messages: messages,
            temperature: 0.8,
            max_tokens: 1000
        });
        
        const options = {
            hostname: 'api.deepseek.com',
            port: 443,
            path: '/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'Content-Length': Buffer.byteLength(data)
            }
        };
        
        const req = https.request(options, (res) => {
            let responseData = '';
            
            res.on('data', chunk => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    if (parsed.choices && parsed.choices[0]) {
                        resolve(parsed.choices[0].message.content);
                    } else if (parsed.error) {
                        reject(new Error(parsed.error.message));
                    } else {
                        reject(new Error('Invalid API response'));
                    }
                } catch (e) {
                    reject(new Error('Failed to parse API response'));
                }
            });
        });
        
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

/**
 * 获取对话历史
 */
function handleGetHistory(req, res, userId = 1) {
    try {
        const conversations = db.getRecentConversations(userId, 50);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ conversations }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
    }
}

module.exports = {
    handleChat,
    handleGetHistory,
    callDeepSeek
};

