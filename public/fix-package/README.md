# LSPatch NoRoot v1.0.12 完整修复包

## 包含文件
- `lspatch-noroot-fix-v1.0.12.patch` — git patch，覆盖 12 个文件（11 个 XposedLoader + build.yml）
- `apply.sh` — 一键应用脚本
- `fix_xposed_loaders.py` — 铁律修复脚本（已执行，patch 中已包含结果）

## 修复内容
1. **CI 构建失败修复**：build.yml 添加 `MJH_STORE_FILE` 指向 CI 生成的 debug.jks
2. **铁律 1**：11 个 XposedLoader.kt 全部删除 `import xxx.hooks.*`，改为反射调用
3. **铁律 2**：Hook 调用改为 `invokeHook("XxxHook", lpparam, cfg)` 反射辅助方法
4. **铁律 3**：进程双分支保留（已在代码中）
5. **Release 版本**：v1.0.11 → v1.0.12

## 应用方法

### 方法 A：一键脚本
```bash
cd LSPatch-Noroot-modle
# 把 fix-package 目录下的文件复制到仓库根目录
cp /path/to/fix-package/* .
bash apply.sh
```

### 方法 B：git apply
```bash
cd LSPatch-Noroot-modle
git apply lspatch-noroot-fix-v1.0.12.patch
git add -A
git commit -m "fix: 三大铁律修复 + CI签名修复 v1.0.12"
git push origin main
```

## 修复统计
- 修改文件：12 个
- 删除 import hooks 语句：26 条
- 替换 Hook 调用为反射：89 处
- CI 签名配置：4 项 env 变量对齐
