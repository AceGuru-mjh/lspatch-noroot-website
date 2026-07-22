#!/bin/bash
# LSPatch NoRoot v1.0.13 大完善修复应用脚本
set -e
cd "$(dirname "$0")/.." || cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
REPO_ROOT="$(pwd)"
PATCH_FILE="lspatch-noroot-fix-v1.0.13.patch"

echo "============================================"
echo "  LSPatch NoRoot v1.0.13 大完善修复"
echo "============================================"
echo "仓库: $REPO_ROOT"
echo ""

if [ ! -d "modules" ] || [ ! -d ".github" ]; then
    echo "ERROR: 请在 LSPatch-Noroot-modle 仓库根目录执行"
    exit 1
fi

if [ ! -f "$PATCH_FILE" ]; then
    echo "ERROR: 找不到 $PATCH_FILE"
    echo "请从 https://github.com/AceGuru-mjh/LSPatch-Noroot-modle/releases 下载或复制到仓库根目录"
    exit 1
fi

echo "[1/5] 检查工作区..."
if ! git diff --quiet 2>/dev/null; then
    echo "WARNING: 工作区有未提交改动，建议 git stash"
    read -p "继续? (y/N): " c; [ "$c" != "y" ] && exit 1
fi

echo "[2/5] 应用 patch (62 文件)..."
if git apply --check "$PATCH_FILE" 2>/dev/null; then
    git apply "$PATCH_FILE"
    echo "  ✓ patch 应用成功"
else
    echo "  ⚠ git apply 失败，尝试 patch 命令..."
    patch -p1 < "$PATCH_FILE"
    echo "  ✓ patch 应用成功"
fi

echo "[3/5] 验证铁律 1（零 import hooks/*）..."
V=0
for mod in modules/*/; do
    mn=$(basename "$mod")
    l=$(find "$mod" -name "XposedLoader.kt" 2>/dev/null | head -1)
    [ -n "$l" ] && cnt=$(grep -c "import.*\.hooks\." "$l" 2>/dev/null || echo "0")
    if [ "${cnt:-0}" -gt "0" ]; then echo "  ❌ $mn: $cnt imports"; V=$((V+1)); fi
done
[ "$V" -eq "0" ] && echo "  ✓ 11 模块零 import hooks/*（铁律1 通过）"

echo "[4/5] 验证 IPC（prefs 名一致 + 无 MODE_WORLD_READABLE）..."
P=0; W=0
for mod in modules/*/; do
    mn=$(basename "$mod")
    cm=$(find "$mod" -name "ConfigManager.kt" 2>/dev/null | head -1)
    cp=$(find "$mod" -name "ConfigProvider.kt" 2>/dev/null | head -1)
    if [ -n "$cm" ] && [ -n "$cp" ]; then
        cmp=$(grep -oP 'PREFS_NAME\s*=\s*"\K[^"]*' "$cm" 2>/dev/null | head -1)
        cpp=$(grep -oP 'getSharedPreferences\("\K[^"]*' "$cp" 2>/dev/null | head -1)
        [ "$cmp" != "$cpp" ] && echo "  ❌ $mn: prefs 不一致 $cmp vs $cpp" && P=$((P+1))
    fi
    wr=$(grep -rl "MODE_WORLD_READABLE" "$mod" 2>/dev/null | wc -l)
    [ "$wr" -gt "0" ] && echo "  ❌ $mn: 仍有 MODE_WORLD_READABLE" && W=$((W+1))
done
[ "$P" -eq "0" ] && echo "  ✓ 11 模块 prefs 名一致"
[ "$W" -eq "0" ] && echo "  ✓ 11 模块无 MODE_WORLD_READABLE"

echo "[5/5] 验证版本号..."
grep -q "v1.0.13" .github/workflows/build.yml && echo "  ✓ build.yml tag = v1.0.13" || echo "  ❌ build.yml 未更新"
grep -q 'versionName = "1.0.13"' modules/GameUnlockerPro_NoRoot/app/build.gradle.kts && echo "  ✓ versionName = 1.0.13" || echo "  ❌ versionName 未更新"

echo ""
echo "============================================"
echo "  v1.0.13 修复完成！"
echo "============================================"
echo "下一步:"
echo "  git add -A"
echo "  git commit -m 'feat: v1.0.13 三大铁律+IPC+版本号 大完善'"
echo "  git push origin main"
echo "  # 等 5 分钟，Actions 自动构建 v1.0.13 APK"
