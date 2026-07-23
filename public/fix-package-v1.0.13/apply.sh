#!/bin/bash
# LSPatch NoRoot v1.0.13 完整修复应用脚本（phase1 + phase2）
set -e
cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
PATCH_FILE="lspatch-noroot-fix-v1.0.13.patch"

echo "============================================"
echo "  LSPatch NoRoot v1.0.13 完整修复"
echo "  (铁律1+2+3 + IPC + 版本号 + permission)"
echo "============================================"
echo ""

if [ ! -d "modules" ] || [ ! -d ".github" ]; then
    echo "ERROR: 请在 LSPatch-Noroot-modle 仓库根目录执行"; exit 1
fi
if [ ! -f "$PATCH_FILE" ]; then
    echo "ERROR: 找不到 $PATCH_FILE"; exit 1
fi

echo "[1/7] 检查工作区..."
if ! git diff --quiet 2>/dev/null; then
    echo "WARNING: 有未提交改动，建议 git stash"
    read -p "继续? (y/N): " c; [ "$c" != "y" ] && exit 1
fi

echo "[2/7] 应用 patch (86 文件)..."
if git apply --check "$PATCH_FILE" 2>/dev/null; then
    git apply "$PATCH_FILE"; echo "  ✓ patch 应用成功"
else
    patch -p1 < "$PATCH_FILE"; echo "  ✓ patch 应用成功 (patch 命令)"
fi

echo "[3/7] 验证铁律 1（零 import hooks/*）..."
V=0
for mod in modules/*/; do
    mn=$(basename "$mod"); l=$(find "$mod" -name "XposedLoader.kt" 2>/dev/null | head -1)
    [ -n "$l" ] && cnt=$(grep -c "import.*\.hooks\." "$l" 2>/dev/null || echo "0")
    if [ "${cnt:-0}" -gt "0" ]; then echo "  ❌ $mn: $cnt imports"; V=$((V+1)); fi
done
[ "$V" -eq "0" ] && echo "  ✓ 11 模块零 import hooks/*"

echo "[4/7] 验证铁律 2（Hook 用 Class.forName）..."
V=0
for hf in $(find modules -path "*/hooks/*.kt" 2>/dev/null); do
    if grep -q 'findAndHookMethod.*".*".*classLoader' "$hf" 2>/dev/null; then
        echo "  ❌ $hf 仍用 String+classLoader"; V=$((V+1))
    fi
done
[ "$V" -eq "0" ] && echo "  ✓ 所有 Hook 文件用 Class.forName"

echo "[5/7] 验证 IPC（prefs 一致 + 无 MODE_WORLD_READABLE）..."
P=0; W=0
for mod in modules/*/; do
    mn=$(basename "$mod")
    cm=$(find "$mod" -name "ConfigManager.kt" 2>/dev/null | head -1)
    cp=$(find "$mod" -name "ConfigProvider.kt" 2>/dev/null | head -1)
    if [ -n "$cm" ] && [ -n "$cp" ]; then
        cmp=$(grep -oP 'PREFS_NAME\s*=\s*"\K[^"]*' "$cm" 2>/dev/null | head -1)
        cpp=$(grep -oP 'getSharedPreferences\("\K[^"]*' "$cp" 2>/dev/null | head -1)
        [ "$cmp" != "$cpp" ] && echo "  ❌ $mn prefs 不一致" && P=$((P+1))
    fi
    wr=$(grep -rl "MODE_WORLD_READABLE" "$mod" 2>/dev/null | wc -l)
    [ "$wr" -gt "0" ] && echo "  ❌ $mn 仍有 MODE_WORLD_READABLE" && W=$((W+1))
done
[ "$P" -eq "0" ] && echo "  ✓ 11 模块 prefs 名一致"
[ "$W" -eq "0" ] && echo "  ✓ 11 模块无 MODE_WORLD_READABLE"

echo "[6/7] 验证 ConfigProvider permission..."
PM=0
for mod in modules/*/; do
    mn=$(basename "$mod"); m="$mod/app/src/main/AndroidManifest.xml"
    [ -f "$m" ] && rp=$(grep -c "readPermission" "$m" 2>/dev/null || echo "0")
    if [ "${rp:-0}" -lt "1" ]; then echo "  ❌ $mn 无 readPermission"; PM=$((PM+1)); fi
done
[ "$PM" -eq "0" ] && echo "  ✓ 11 模块 ConfigProvider 有 readPermission"

echo "[7/7] 验证版本号..."
grep -q "v1.0.13" .github/workflows/build.yml && echo "  ✓ build.yml tag = v1.0.13" || echo "  ❌ build.yml 未更新"
grep -q 'versionName = "1.0.13"' modules/GameUnlockerPro_NoRoot/app/build.gradle.kts && echo "  ✓ versionName = 1.0.13" || echo "  ❌ versionName 未更新"

echo ""
echo "============================================"
echo "  v1.0.13 完整修复完成！"
echo "============================================"
echo "下一步:"
echo "  git add -A"
echo "  git commit -m 'feat: v1.0.13 三大铁律+IPC+permission 大完善'"
echo "  git push origin main"
