/**
 * Aicy Server
 * 来自2157年的赛博少女
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 加载配置
let CONFIG = {};
try {
    CONFIG = require('./server-config.js');
    console.log('✅ 已加载 API 配置');
} catch (e) {
    console.warn('⚠️ 未找到 server-config.js，请创建配置文件');
}

// 加载 Aicy API 模块
let chatAPI, userAPI;
try {
    chatAPI = require('./api/chat');
    userAPI = require('./api/user');
    console.log('✅ 已加载 Aicy API 模块');
} catch (e) {
    console.warn('⚠️ Aicy API 模块加载失败:', e.message);
}

const PORT = CONFIG.PORT || 8080;

// MIME 类型
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// CORS 头
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// 创建服务器
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    // CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, corsHeaders);
        res.end();
        return;
    }

    // ============================================
    // Aicy API（新版，带好感度系统）
    // ============================================
    
    // 聊天 API
    if (parsedUrl.pathname === '/api/aicy/chat' && req.method === 'POST') {
        if (chatAPI) {
            await chatAPI.handleChat(req, res, CONFIG);
        } else {
            res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Chat API not loaded' }));
        }
        return;
    }
    
    // 获取对话历史
    if (parsedUrl.pathname === '/api/aicy/history' && req.method === 'GET') {
        if (chatAPI) {
            chatAPI.handleGetHistory(req, res);
        } else {
            res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Chat API not loaded' }));
        }
        return;
    }
    
    // 获取用户状态
    if (parsedUrl.pathname === '/api/aicy/status' && req.method === 'GET') {
        if (userAPI) {
            userAPI.handleGetStatus(req, res);
        } else {
            res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'User API not loaded' }));
        }
        return;
    }
    
    // 更新用户画像
    if (parsedUrl.pathname === '/api/aicy/profile' && req.method === 'POST') {
        if (userAPI) {
            await userAPI.handleUpdateProfile(req, res);
        } else {
            res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'User API not loaded' }));
        }
        return;
    }
    
    // 好感度日志
    if (parsedUrl.pathname === '/api/aicy/affection-log' && req.method === 'GET') {
        if (userAPI) {
            userAPI.handleGetAffectionLog(req, res);
        } else {
            res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'User API not loaded' }));
        }
        return;
    }
    
    // 重置（测试用）
    if (parsedUrl.pathname === '/api/aicy/reset' && req.method === 'POST') {
        if (userAPI) {
            userAPI.handleReset(req, res);
        } else {
            res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'User API not loaded' }));
        }
        return;
    }

    // ============================================
    // DeepSeek API 代理（旧版兼容）
    // ============================================
    if (parsedUrl.pathname === '/api/deepseek') {
        if (!CONFIG.DEEPSEEK_API_KEY) {
            res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'DeepSeek API Key not configured' }));
            return;
        }

        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const data = JSON.stringify({
                ...JSON.parse(body),
                model: 'deepseek-chat'
            });

            const options = {
                hostname: 'api.deepseek.com',
                port: 443,
                path: '/chat/completions',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.DEEPSEEK_API_KEY}`,
                    'Content-Length': Buffer.byteLength(data)
                }
            };

            const proxyReq = https.request(options, (proxyRes) => {
                res.writeHead(proxyRes.statusCode, {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                });
                proxyRes.pipe(res);
            });

            proxyReq.on('error', (e) => {
                res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            });

            proxyReq.write(data);
            proxyReq.end();
        });
        return;
    }

    // ============================================
    // Coinglass API 代理
    // ============================================
    if (parsedUrl.pathname.startsWith('/api/coinglass/')) {
        if (!CONFIG.COINGLASS_API_KEY) {
            res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Coinglass API Key not configured' }));
            return;
        }

        // 前端 URL 格式: /api/coinglass/api/futures/... -> V4 API: /api/futures/...
        const apiPath = parsedUrl.pathname.replace('/api/coinglass', '');
        const queryString = parsedUrl.search || '';

        const options = {
            hostname: 'open-api-v4.coinglass.com',
            port: 443,
            path: `${apiPath}${queryString}`,
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'CG-API-KEY': CONFIG.COINGLASS_API_KEY
            }
        };

        const proxyReq = https.request(options, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, {
                ...corsHeaders,
                'Content-Type': 'application/json'
            });
            proxyRes.pipe(res);
        });

        proxyReq.on('error', (e) => {
            res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: e.message }));
        });

        proxyReq.end();
        return;
    }

    // ============================================
    // 静态文件服务
    // ============================================
    let filePath = parsedUrl.pathname;
    if (filePath === '/') filePath = '/index.html';
    
    const fullPath = path.join(__dirname, filePath);
    const ext = path.extname(fullPath).toLowerCase();
    
    fs.readFile(fullPath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }
        
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { ...corsHeaders, 'Content-Type': contentType });
        res.end(data);
    });
});

// 启动服务器
server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════╗
║   💕 Aicy Server                                    ║
║   http://localhost:${PORT}                           ║
║                                                    ║
║   API: ${CONFIG.COINGLASS_API_KEY ? '✅ Coinglass' : '❌ Coinglass'}  ${CONFIG.DEEPSEEK_API_KEY ? '✅ DeepSeek' : '❌ DeepSeek'}      ║
║   Press Ctrl+C to stop                             ║
╚════════════════════════════════════════════════════╝
    `);
});
