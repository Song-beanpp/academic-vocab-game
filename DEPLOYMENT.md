# 部署指南 - Academic Vocab Game

## 方案 1: Zeabur（推荐 - 中国访问快）

### 优点
- ✅ 中国访问速度快
- ✅ 免费套餐足够使用
- ✅ 自动 HTTPS
- ✅ 简单易用

### 部署步骤

1. **准备 Git 仓库**
   ```bash
   cd /Users/Zhuanz/academic-vocab-game
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **推送到 GitHub**
   - 在 GitHub 创建新仓库
   - 推送代码：
   ```bash
   git remote add origin https://github.com/你的用户名/academic-vocab-game.git
   git branch -M main
   git push -u origin main
   ```

3. **注册 Zeabur**
   - 访问 https://zeabur.com
   - 使用 GitHub 账号登录

4. **部署后端**
   - 点击 "Create Project"
   - 连接你的 GitHub 仓库
   - 选择 `server` 目录
   - 设置环境变量：
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key_here
     PORT=5001
     ```
   - 点击 Deploy

5. **部署前端**
   - 在同一项目中添加新服务
   - 选择 `client` 目录
   - 设置环境变量：
     ```
     REACT_APP_API_URL=你的后端URL
     ```
   - 点击 Deploy

6. **配置 MongoDB Atlas**
   - 访问 https://www.mongodb.com/cloud/atlas
   - 创建免费集群（M0）
   - 在 Network Access 中添加 `0.0.0.0/0`（允许所有IP）
   - 获取连接字符串

---

## 方案 2: Vercel + Railway

### 前端部署到 Vercel

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **部署前端**
   ```bash
   cd client
   vercel
   ```

3. **设置环境变量**
   在 Vercel 控制台设置：
   ```
   REACT_APP_API_URL=你的后端URL
   ```

### 后端部署到 Railway

1. **访问 Railway**
   - https://railway.app
   - 使用 GitHub 登录

2. **New Project → Deploy from GitHub**
   - 选择你的仓库
   - 设置 Root Directory 为 `server`
   - 添加环境变量

3. **添加 MongoDB**
   - 点击 "Add Plugin"
   - 选择 MongoDB
   - 自动配置连接字符串

---

## 方案 3: Render（完全免费）

### 优点
- ✅ 完全免费
- ✅ 自动 HTTPS
- ❌ 中国访问可能较慢

### 部署步骤

1. **访问 Render**
   - https://render.com
   - 使用 GitHub 登录

2. **部署后端**
   - New → Web Service
   - 连接 GitHub 仓库
   - 设置：
     - Root Directory: `server`
     - Build Command: `npm install`
     - Start Command: `npm start`
   - 添加环境变量

3. **部署前端**
   - New → Static Site
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`

---

## 方案 4: 国内平台（Aliyun/Tencent Cloud）

### Aliyun 函数计算
- 免费额度：100万次调用/月
- 中国访问速度最快
- 需要实名认证和备案

### Tencent Cloud 云开发
- 免费额度：5GB 存储 + 1GB 流量/月
- 集成数据库
- 需要实名认证

---

## 环境变量配置

### 后端 (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/academic-vocab-game
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5001
NODE_ENV=production
```

### 前端 (.env)
```env
REACT_APP_API_URL=https://your-backend-url.zeabur.app
```

---

## 部署检查清单

- [ ] 代码推送到 GitHub
- [ ] MongoDB Atlas 集群已创建
- [ ] 后端环境变量已配置
- [ ] 前端 API URL 已设置
- [ ] 后端已部署并运行
- [ ] 前端已部署
- [ ] CORS 配置正确
- [ ] 数据库连接成功
- [ ] 注册和登录功能正常

---

## 常见问题

### Q: 前端无法连接后端？
A: 检查 CORS 设置和 API URL 配置

### Q: MongoDB 连接失败？
A: 确保 Network Access 允许所有 IP (0.0.0.0/0)

### Q: 中国访问慢？
A: 使用 Zeabur 或国内云平台

### Q: 免费额度不够？
A:
- Vercel: 100GB 带宽/月
- Railway: $5 免费额度/月
- Render: 750小时/月（免费层服务会休眠）
- MongoDB Atlas: 512MB 存储（M0 集群）

---

## 推荐配置（中国用户）

**最佳方案**: Zeabur (前后端) + MongoDB Atlas
- 总成本: $0/月
- 部署时间: ~15分钟
- 访问速度: 快
- 稳定性: 高
