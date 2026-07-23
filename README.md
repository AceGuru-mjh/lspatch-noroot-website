# LSPatch NoRoot · 官方网站

> AceGuru-mjh/LSPatch-Noroot-modle 模块合集的官方网站与交互预览

## ✨ 特性

- 🎨 **Material 3 毛玻璃悬浮球** — 1:1 还原 LSPatch 模块运行场景的可交互 Demo
- 📦 **11 模块市场** — 广告拦截 / 隐私保护 / 游戏加速 / 微信增强等完整展示
- ⚙️ **三大铁律文档** — 铁律1/2/3 的 before/after 代码对比
- 🔧 **v1.0.13 修复看板** — 86 文件 2294 行 patch 实时进度
- 📥 **下载中心** — patch / apply.sh / 修复脚本一键下载
- 🗺️ **迭代路线图** — v1.0.13 → v1.2.0 6 个版本计划
- ❓ **FAQ** — 8 个常见问题解答

## 🛠️ 技术栈

- **框架**: Next.js 16 (App Router) + TypeScript 5
- **样式**: Tailwind CSS 4 + shadcn/ui
- **动画**: Framer Motion
- **状态**: Zustand
- **图标**: Lucide React
- **代码高亮**: react-syntax-highlighter

## 🚀 本地开发

```bash
# 安装依赖
bun install

# 启动开发服务器
bun run dev

# 打开 http://localhost:3000
```

## 📦 部署

### 方式 1: Vercel（推荐）

1. Fork 本仓库到你的 GitHub
2. 进入 [vercel.com](https://vercel.com)，New Project → Import 你的仓库
3. Framework Preset 选 Next.js，其他默认
4. Deploy，约 2 分钟完成

### 方式 2: Cloudflare Pages

```bash
bun run build
# 上传 .next/ 目录到 Cloudflare Pages
```

### 方式 3: 自托管

```bash
bun run build
bun run start
# 监听 3000 端口
```

## 📁 项目结构

```
src/
├── app/
│   ├── page.tsx              # 单页官网（长滚动）
│   ├── layout.tsx            # 全局布局
│   └── globals.css           # M3 主题 + 毛玻璃工具类
├── components/
│   ├── site/                 # 官网组件
│   │   ├── SiteHeader.tsx    # 顶部导航
│   │   ├── Hero.tsx          # 首屏
│   │   ├── Features.tsx      # 核心特性
│   │   ├── ModuleShowcase.tsx# 11 模块市场
│   │   ├── PreviewSection.tsx# 悬浮球 Demo
│   │   ├── SectionWrapper.tsx# Section 包装器
│   │   ├── FAQ.tsx           # 常见问题
│   │   └── SiteFooter.tsx    # 页脚
│   └── lsp/                  # LSPatch 业务组件
│       ├── PhoneFrame.tsx    # 手机外框
│       ├── HostApp.tsx       # 宿主 APP
│       ├── FloatingBall.tsx  # M3 悬浮球
│       ├── ControlPanel.tsx  # 毛玻璃面板
│       ├── ModuleRail.tsx    # 模块切换
│       ├── IronRules.tsx     # 三大铁律
│       ├── V1013Tab.tsx      # v1.0.13 看板
│       ├── DownloadTab.tsx   # 下载中心
│       ├── IterationPlan.tsx # 迭代路线
│       ├── CodeBlock.tsx     # 代码高亮
│       └── ...
└── lib/
    ├── lsp-modules.ts        # 11 模块数据
    ├── lsp-store.ts          # Zustand 状态
    ├── use-log-engine.ts     # 实时日志引擎
    └── fix-data.ts           # 修复方案数据
```

## 🎨 设计系统

### M3 毛玻璃工具类

- `.glass-ball` — 悬浮球（中等模糊 + 发光）
- `.glass-panel` — 展开面板（强模糊 + 层次）
- `.glass-card` — 卡片（轻模糊）
- `.m3-state` — M3 状态层 hover/press
- `.ambient-glow` — 环境光晕背景
- `.lsp-scroll` — 自定义滚动条

### 配色（避开蓝/靛，遵循 M3 tonal）

每个模块独立 M3 配色：emerald / cyan / amber / lime / pink / yellow / purple / teal / coral / tan / green

## 🔗 相关链接

- **模块仓库**: [AceGuru-mjh/LSPatch-Noroot-modle](https://github.com/AceGuru-mjh/LSPatch-Noroot-modle)
- **LSPatch 框架**: [LSPosed/LSPatch](https://github.com/LSPosed/LSPatch)
- **作者**: [@AceGuru-mjh](https://github.com/AceGuru-mjh)

## 📄 License

MIT © MJH
