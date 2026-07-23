# 部署指南

## 🚀 Vercel 部署（推荐，2 分钟）

### 步骤 1: 创建新仓库

```bash
# 方法 A: 用 GitHub CLI
gh repo create lspatch-noroot-website --public --source=. --push

# 方法 B: 手动
# 1. 在 GitHub 新建仓库 lspatch-noroot-website
# 2. 本地执行：
git init
git add .
git commit -m "feat: LSPatch NoRoot 官网"
git branch -M main
git remote add origin https://github.com/<你的用户名>/lspatch-noroot-website.git
git push -u origin main
```

### 步骤 2: Vercel 部署

1. 进入 [vercel.com/new](https://vercel.com/new)
2. Import 你的 `lspatch-noroot-website` 仓库
3. Framework Preset: **Next.js**（自动检测）
4. Root Directory: `./`
5. Build Command: `bun run build`（默认即可）
6. Install Command: `bun install`（默认即可）
7. 点 **Deploy**

约 2 分钟后部署完成，获得 `https://lspatch-noroot-website.vercel.app` 类似域名。

### 步骤 3: 自定义域名（可选）

Vercel Dashboard → 你的项目 → Settings → Domains → 添加自定义域名

---

## 🌐 Cloudflare Pages 部署

```bash
bun run build
# 把 .next/ 目录上传到 Cloudflare Pages
```

或连接 GitHub 仓库自动部署：
- Build command: `bun run build`
- Build output directory: `.next`

---

## 📦 自托管（Docker）

```dockerfile
FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["bun", "server.js"]
```

```bash
docker build -t lspatch-website .
docker run -p 3000:3000 lspatch-website
```

---

## ✅ 部署验证清单

部署完成后，访问网站确认以下功能正常：

- [ ] 首屏 Hero 动画 + CTA 按钮
- [ ] 顶部导航滚动时背景变化
- [ ] 6 个特性卡片渲染
- [ ] 11 模块市场点击切换
- [ ] 悬浮球 Demo 拖拽 + 点击展开
- [ ] 三大铁律代码对比展开
- [ ] v1.0.13 看板 8 统计卡
- [ ] 下载中心文件链接可下载
- [ ] 迭代路线 6 卡片
- [ ] FAQ 折叠展开
- [ ] 页脚链接 + 返回顶部
- [ ] 移动端响应式（390x844）

---

## 🔧 常见问题

### Q: 部署后字体不显示？
A: Next.js Google Fonts 需要网络访问。如果在受限网络，改用本地字体。

### Q: 首屏白屏？
A: 检查浏览器控制台。可能是 Framer Motion 的 `whileInView` 在某些浏览器需要 polyfill。

### Q: 下载的 patch 文件名乱码？
A: Vercel 会自动处理 Content-Disposition，无需额外配置。

### Q: 如何更新网站内容？
A: 修改 `src/lib/lsp-modules.ts`（模块数据）、`src/lib/fix-data.ts`（修复方案）等数据文件，push 后 Vercel 自动重新部署。
