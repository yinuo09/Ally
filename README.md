# Ally · 你的 AI 内容策略师

每天打开，看到 3 个为你选的选题——选一个，一键生成。

## 本地预览

不需要 Node 环境，直接用任意静态服务器打开即可：

```bash
npx serve .
# 或
python3 -m http.server 8765
```

打开 http://localhost:3000 （或对应端口）即可看到页面。
本地预览时没有配置 API Key，会自动使用内置的模拟引擎生成内容，不影响体验。

## 部署到 Vercel（推荐）

### 第一步：推送到 GitHub

```bash
git init
git add .
git commit -m "init: Ally  AI 内容策略师"
git branch -M main
git remote add origin <你的GitHub仓库地址>
git push -u origin main
```

### 第二步：在 Vercel 导入项目

1. 打开 https://vercel.com/new
2. 选择刚才推送的 GitHub 仓库
3. Framework Preset 选择 **Other**（这是纯静态 + Serverless Function 项目，不需要构建步骤）
4. 点击 Deploy

### 第三步：配置环境变量（让用户打开链接即可用，无需自己填 Key）

部署完成后，进入 Vercel 项目 → **Settings → Environment Variables**，添加：

| Key | Value | 说明 |
|-----|-------|------|
| `API_KEY` | 你的 DeepSeek（或其他兼容 OpenAI 格式 API）的密钥 | 必填 |
| `API_URL` | `https://api.deepseek.com/chat/completions` | 可选，默认就是这个地址；如果用其他模型供应商，改成对应地址 |

添加完环境变量后，**需要重新部署一次**（Deployments → 最新的部署 → 右上角 ⋯ → Redeploy）才会生效。

### 第四步：完成

之后任何人打开你的 Vercel 域名，都可以直接使用，无需自己配置任何 Key。

## 项目结构

```
.
├── index.html       # 页面结构
├── style.css        # 样式（轻盈明亮风格）
├── app.js           # 前端逻辑：声音档案 / 选题 / 生成 / 反馈
├── api/
│   └── chat.js      # Vercel Serverless Function，代理 API 请求，屏蔽 Key
├── vercel.json       # 路由与基础安全 Header 配置
└── package.json
```

## 如果不想用 Vercel 环境变量

侧边栏底部有「API 设置」入口，可以手动填入 API 地址和 Key（保存在浏览器本地，不会上传到任何服务器）。这适合本地开发或临时测试场景。

## 关于数据存储

当前版本所有数据（声音档案、反馈记录、选题缓存）都存储在浏览器 `localStorage` / `sessionStorage` 中，仅保存在用户自己的设备上，不会上传到服务器。换设备或清空浏览器数据会导致数据丢失，这是已知的当前版本限制。

