# 📝 代码规范

本文档定义 Aicy 项目的编码风格和最佳实践。

## 🎯 通用原则

1. **可读性优先** - 代码是写给人看的
2. **保持一致** - 遵循现有风格
3. **简洁明了** - 不过度设计
4. **写好注释** - 解释为什么，而不是什么

---

## 📜 JavaScript 规范

### 命名规范

```javascript
// ✅ 变量：camelCase
const userName = 'Aicy';
let isLoading = false;

// ✅ 常量：UPPER_SNAKE_CASE
const API_BASE_URL = '/api';
const MAX_HISTORY_LENGTH = 50;

// ✅ 函数：camelCase，动词开头
function getUserData() {}
function sendMessage() {}
function isValidInput() {}

// ✅ 类/对象：PascalCase
const App = {};
const ChartModule = {};
class UserManager {}

// ✅ 私有属性：下划线前缀
const _privateVar = 'internal';
function _helperFunction() {}
```

### 函数规范

```javascript
// ✅ 好的函数
function calculateAffection(currentLevel, interaction) {
    const bonus = getInteractionBonus(interaction);
    return Math.min(currentLevel + bonus, MAX_AFFECTION);
}

// ❌ 不好的函数
function calc(a, b) {
    return a + b > 100 ? 100 : a + b;
}
```

### 注释规范

```javascript
// ✅ 解释"为什么"
// 使用 setTimeout 避免 DOM 更新后立即滚动导致的位置错误
setTimeout(() => scrollToBottom(), 100);

// ❌ 解释"是什么"（代码已经说明了）
// 滚动到底部
scrollToBottom();

// ✅ JSDoc 风格
/**
 * 发送消息给 Aicy
 * @param {string} message - 用户消息
 * @param {Object} context - 对话上下文
 * @returns {Promise<string>} Aicy 的回复
 */
async function sendToAicy(message, context) {
    // ...
}
```

### 异步处理

```javascript
// ✅ 使用 async/await
async function fetchData() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取数据失败:', error);
        throw error;
    }
}

// ❌ 回调地狱
function fetchData(callback) {
    fetch(url).then(res => {
        res.json().then(data => {
            callback(data);
        });
    });
}
```

---

## 🎨 CSS 规范

### 命名规范（BEM 风格）

```css
/* Block */
.chat-message {}

/* Element */
.chat-message__avatar {}
.chat-message__content {}

/* Modifier */
.chat-message--user {}
.chat-message--aicy {}
```

### 变量使用

```css
/* ✅ 使用 CSS 变量 */
:root {
    --aicy-silver: #C0C0C0;
    --aicy-dark: #1a1a2e;
    --aicy-accent: #00d4ff;
}

.element {
    color: var(--aicy-silver);
    background: var(--aicy-dark);
}

/* ❌ 硬编码颜色 */
.element {
    color: #C0C0C0;
}
```

### 响应式设计

```css
/* ✅ Mobile First */
.container {
    padding: 10px;
}

@media (min-width: 900px) {
    .container {
        padding: 20px;
    }
}
```

---

## 📄 HTML 规范

### 语义化

```html
<!-- ✅ 语义化标签 -->
<header>
    <nav>...</nav>
</header>
<main>
    <section>...</section>
</main>
<footer>...</footer>

<!-- ❌ div 滥用 -->
<div class="header">
    <div class="nav">...</div>
</div>
```

### i18n 属性

```html
<!-- ✅ 使用 data-i18n -->
<span data-i18n="welcome_message">欢迎</span>
<button data-i18n="send_button">发送</button>

<!-- ❌ 硬编码文本 -->
<span>欢迎</span>
```

---

## 📁 文件组织

### 模块结构

```javascript
// 模块顶部：常量定义
const MODULE_NAME = 'Example';
const DEFAULT_CONFIG = {};

// 模块对象
const ExampleModule = {
    // 1. 属性
    data: null,
    
    // 2. 初始化
    init() {},
    
    // 3. 公共方法
    publicMethod() {},
    
    // 4. 私有方法
    _privateMethod() {},
    
    // 5. 事件处理
    handleClick() {},
    
    // 6. 工具方法
    utils: {}
};

// 导出
window.ExampleModule = ExampleModule;
```

---

## ✅ 代码审查清单

- [ ] 命名是否清晰、一致
- [ ] 是否有必要的注释
- [ ] 错误处理是否完善
- [ ] 是否遵循现有风格
- [ ] 是否有重复代码
- [ ] 是否支持多语言
- [ ] 移动端是否兼容

---

## 🔧 工具推荐

| 工具 | 用途 |
|------|------|
| ESLint | JavaScript 代码检查 |
| Prettier | 代码格式化 |
| VS Code | 编辑器 |

---

## 📚 参考资料

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Google HTML/CSS Style Guide](https://google.github.io/styleguide/htmlcssguide.html)
- [MDN Web Docs](https://developer.mozilla.org/)

