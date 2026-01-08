# 🚀 GitHub 部署指南

## 第一步：在GitHub上创建仓库

1. 访问 [GitHub](https://github.com)
2. 点击右上角的 **"+"** → **"New repository"**
3. 填写仓库信息：
   - **Repository name**: `mia-trading-docs` (或您喜欢的名字)
   - **Description**: `Mia 2.0 实盘交易IP - 完整知识体系文档`
   - **Public** 或 **Private**: 选择 Public（GitHub Pages需要）
   - ⚠️ **不要**勾选 "Add a README file"
   - ⚠️ **不要**勾选 "Add .gitignore"
   - ⚠️ **不要**选择 License
4. 点击 **"Create repository"**

## 第二步：推送代码到GitHub

创建好仓库后，GitHub会显示一个页面，复制仓库的URL（类似 `https://github.com/你的用户名/mia-trading-docs.git`）

然后在终端执行以下命令：

```bash
cd /Users/moon/Documents/GitHub/Mia

# 添加远程仓库（替换成你的仓库地址）
git remote add origin https://github.com/你的用户名/mia-trading-docs.git

# 推送代码
git push -u origin main
```

## 第三步：配置GitHub Pages

1. 在GitHub仓库页面，点击 **Settings** (设置)
2. 在左侧菜单找到 **Pages**
3. 在 **Source** 部分：
   - 选择 **GitHub Actions**（不要选择Branch）
4. 保存后，GitHub Actions 会自动开始构建和部署

## 第四步：查看部署状态

1. 回到仓库主页
2. 点击 **Actions** 标签
3. 查看部署工作流的运行状态
4. 等待部署完成（通常需要2-3分钟）

## 第五步：访问您的网站

部署完成后，您的网站地址将是：

```
https://你的用户名.github.io/mia-trading-docs/
```

## 🔧 后续更新

每次修改代码后，只需执行：

```bash
cd /Users/moon/Documents/GitHub/Mia

# 添加修改的文件
git add .

# 提交
git commit -m "更新描述"

# 推送
git push
```

推送后，GitHub Actions 会自动重新部署网站！

## ⚠️ 常见问题

### 1. 推送时要求输入用户名和密码

如果是 HTTPS 方式，GitHub 不再支持密码登录，需要使用 Personal Access Token：

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 勾选 `repo` 权限
4. 生成后复制token
5. 推送时，用户名输入GitHub用户名，密码输入刚才的token

或者使用 SSH 方式（推荐）：

```bash
# 添加SSH远程仓库
git remote set-url origin git@github.com:你的用户名/mia-trading-docs.git
```

### 2. GitHub Pages 没有自动部署

确保：
- 仓库是 Public
- Settings → Pages → Source 选择了 "GitHub Actions"
- `.github/workflows/deploy.yml` 文件存在

### 3. 网站显示 404

- 检查 Settings → Pages 中显示的URL
- 等待3-5分钟（首次部署可能较慢）
- 查看 Actions 标签确认部署成功

## 📝 项目信息

- **框架**: VitePress 1.0
- **部署**: GitHub Pages + GitHub Actions
- **自动部署**: 推送到 main 分支自动触发

---

**需要帮助？** 查看 [VitePress 官方文档](https://vitepress.dev/) 或 [GitHub Pages 文档](https://docs.github.com/pages)


