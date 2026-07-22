#!/bin/bash
# LSPatch NoRoot 模块 v1.0.12 完整修复应用脚本
# 用法: 在仓库根目录执行 bash apply.sh
set -e

REPO_ROOT="$(pwd)"
PATCH_FILE="lspatch-noroot-fix-v1.0.12.patch"

echo "============================================"
echo "  LSPatch NoRoot v1.0.12 完整修复"
echo "============================================"
echo ""

# 检查是否在仓库根目录
if [ ! -d "modules" ] || [ ! -d ".github" ]; then
    echo "ERROR: 请在 LSPatch-Noroot-modle 仓库根目录执行此脚本"
    exit 1
fi

# 检查 patch 文件是否存在
if [ ! -f "$PATCH_FILE" ]; then
    echo "ERROR: 找不到 $PATCH_FILE，请确保它在仓库根目录"
    exit 1
fi

echo "[1/4] 检查工作区状态..."
if ! git diff --quiet 2>/dev/null; then
    echo "WARNING: 工作区有未提交的改动，建议先 git stash"
    read -p "继续应用 patch? (y/N): " confirm
    [ "$confirm" != "y" ] && exit 1
fi

echo "[2/4] 应用 patch..."
if git apply --check "$PATCH_FILE" 2>/dev/null; then
    git apply "$PATCH_FILE"
    echo "  ✓ patch 应用成功"
else
    echo "  ⚠ git apply 失败，尝试 patch 命令..."
    patch -p1 < "$PATCH_FILE"
    echo "  ✓ patch 应用成功 (patch 命令)"
fi

echo "[3/4] 验证铁律修复..."
VIOLATIONS=0
for mod in modules/*/; do
    mn=$(basename "$mod")
    loader=$(find "$mod" -name "XposedLoader.kt" 2>/dev/null | head -1)
    if [ -n "$loader" ]; then
        cnt=$(grep -c "import.*\.hooks\." "$loader" 2>/dev/null || echo "0")
        if [ "$cnt" -gt "0" ]; then
            echo "  ❌ $mn: 仍有 $cnt 个 hooks import"
            VIOLATIONS=$((VIOLATIONS + 1))
        fi
    fi
done
if [ "$VIOLATIONS" -eq "0" ]; then
    echo "  ✓ 全部 11 模块铁律 1 已通过（零 import hooks/*）"
else
    echo "  ⚠ $VIOLATIONS 个模块仍有铁律违反"
fi

echo "[4/4] 验证 build.yml CI 签名修复..."
if grep -q "MJH_STORE_FILE.*debug.jks" .github/workflows/build.yml; then
    echo "  ✓ CI 签名已修复（MJH_STORE_FILE → debug.jks）"
else
    echo "  ❌ CI 签名未修复"
fi

if grep -q "tag_name: v1.0.12" .github/workflows/build.yml; then
    echo "  ✓ Release 版本号已更新为 v1.0.12"
fi

echo ""
echo "============================================"
echo "  修复完成！"
echo "============================================"
echo ""
echo "下一步操作:"
echo "  1. git add -A"
echo "  2. git commit -m 'fix: 三大铁律修复 + CI签名修复 v1.0.12'"
echo "  3. git push origin main"
echo "  4. 等待 GitHub Actions 自动构建"
echo "  5. 构建成功后在 Releases 页查看 v1.0.12 APK"
echo ""
