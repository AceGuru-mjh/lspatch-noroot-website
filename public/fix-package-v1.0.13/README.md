# LSPatch NoRoot v1.0.13 大完善修复包

## 修复内容（一次修完）
1. **铁律 1**: 11 模块 XposedLoader 删除 27 条 import hooks/*，101 处 Hook 调用改为 invokeHook() 反射
2. **铁律 2**: Hook 内 Class.forName() 加载目标类（已有，保留）
3. **铁律 3**: 进程双分支保留（已有）
4. **IPC**: 11 模块 ConfigProvider/ConfigManager prefs 名统一
5. **IPC**: 33 处 MODE_WORLD_READABLE → MODE_PRIVATE
6. **版本号**: 11 模块 VERSION 1.0.11 → 1.0.13
7. **CI**: build.yml tag v1.0.12 → v1.0.13

## 文件
- `lspatch-noroot-fix-v1.0.13.patch` (113 KB, 1852 行, 62 文件)
- `apply.sh` 一键应用脚本（含 5 项验证）
- `fix_v1013.py` 修复脚本（可重跑）
- `fix-report.json` 修复报告

## 应用
```bash
cd LSPatch-Noroot-modle
cp /path/to/fix-package-v1.0.13/* .
bash apply.sh
git add -A && git commit -m "feat: v1.0.13 大完善" && git push
```
