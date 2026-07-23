#!/bin/bash
# LSPatch NoRoot 官网 - 新仓库初始化脚本
# 用法: bash init-repo.sh <你的GitHub用户名>
set -e

USERNAME="${1:-AceGuru-mjh}"
REPO_NAME="lspatch-noroot-website"
REMOTE_URL="https://github.com/$USERNAME/$REPO_NAME.git"

echo "============================================"
echo "  LSPatch NoRoot 官网 - 新仓库初始化"
echo "============================================"
echo "GitHub 用户名: $USERNAME"
echo "仓库名: $REPO_NAME"
echo "远程地址: $REMOTE_URL"
echo ""

# 检查是否在项目根目录
if [ ! -f "package.json" ] || [ ! -d "src/app" ]; then
    echo "ERROR: 请在项目根目录执行（含 package.json 和 src/app）"
    exit 1
fi

# 检查 git 是否已初始化
if [ ! -d ".git" ]; then
    echo "[1/6] 初始化 git 仓库..."
    git init
    git branch -M main
else
    echo "[1/6] git 仓库已存在，跳过初始化"
fi

echo "[2/6] 添加所有文件..."
git add .

echo "[3/6] 创建首次提交..."
git commit -m "feat: LSPatch NoRoot 官网

- Material 3 毛玻璃悬浮球交互 Demo
- 11 模块市场完整展示
- 三大铁律文档 + before/after 代码对比
- v1.0.13 修复进度看板（86 文件 2294 行 patch）
- 下载中心 + 迭代路线图 + FAQ
- Next.js 16 + TypeScript 5 + Tailwind 4" || echo "  (无变更可提交，跳过)"

echo "[4/6] 添加远程仓库..."
if git remote get-url origin > /dev/null 2>&1; then
    git remote set-url origin "$REMOTE_URL"
    echo "  已更新 origin → $REMOTE_URL"
else
    git remote add origin "$REMOTE_URL"
    echo "  已添加 origin → $REMOTE_URL"
fi

echo ""
echo "[5/6] 推送前检查清单："
echo "  □ 已在 GitHub 创建仓库: https://github.com/new"
echo "    - Repository name: $REPO_NAME"
echo "    - Public"
echo "    - 不要勾选 Initialize with README"
echo ""
read -p "确认已创建仓库并要推送? (y/N): " confirm
if [ "$confirm" != "y" ]; then
    echo "已取消。手动推送: git push -u origin main"
    exit 0
fi

echo "[6/6] 推送到 GitHub..."
git push -u origin main

echo ""
echo "============================================"
echo "  完成！仓库已创建："
echo "  $REMOTE_URL"
echo "============================================"
echo ""
echo "下一步部署到 Vercel："
echo "  1. 访问 https://vercel.com/new"
echo "  2. Import $REPO_NAME 仓库"
echo "  3. Framework Preset: Next.js"
echo "  4. Deploy"
echo ""
echo "或用 Vercel CLI:"
echo "  npm i -g vercel"
echo "  vercel"
echo ""
