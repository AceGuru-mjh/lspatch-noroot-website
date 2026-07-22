#!/usr/bin/env python3
"""LSPatch NoRoot 模块铁律修复脚本 (spec 模式)"""
import re, sys
from pathlib import Path

REPO_ROOT = Path("/tmp/LSPatch-Noroot-modle")
MODULES_DIR = REPO_ROOT / "modules"

MODULE_PACKAGES = {
    "AdBlockerX_NoRoot": "com.adblockerx.noroot",
    "AudioBoost_NoRoot": "com.audioboost.noroot",
    "BatteryOptimizer_NoRoot": "com.batteryopt.noroot",
    "GameUnlockerPro_NoRoot": "com.gameunlocker.noroot",
    "MicroXEnhancer": "com.microx.enhancer",
    "NotifyMaster_NoRoot": "com.notifymaster.noroot",
    "PrivacyGuard_NoRoot": "com.privacyguard.noroot",
    "ShizukuSceneFix": "com.mjh.shizukufix",
    "StepModifier_NoRoot": "com.stepmod.noroot",
    "VideoSaver_NoRoot": "com.videosaver.noroot",
    "VipUnlocker_NoRoot": "com.vipunlocker.noroot",
}

def find_loader(module_dir):
    for p in module_dir.rglob("XposedLoader.kt"):
        return p
    return None

def detect_config_class(content):
    m = re.search(r'import\s+[\w.]+\.models\.(\w+Config)', content)
    return m.group(1) if m else "ModuleConfig"

def fix_loader(loader_path, module_name):
    content = loader_path.read_text(encoding='utf-8')
    original = content
    pkg = MODULE_PACKAGES.get(module_name, "")
    config_class = detect_config_class(content)

    # 1. 删除 import xxx.hooks.* 和 import xxx.hooks.XxxHook
    content = re.sub(r'^import\s+\w+[\w.]*\.hooks\.\*;?\n', '', content, flags=re.MULTILINE)
    content = re.sub(r'^import\s+\w+[\w.]*\.hooks\.\w+;?\n', '', content, flags=re.MULTILINE)

    # 2. 收集 Hook 名
    hook_calls = re.findall(r'(\w+Hook)\.apply\(', content)
    unique_hooks = sorted(set(hook_calls))

    # 3. 替换 XxxHook.apply(lpparam, cfg) -> invokeHook("XxxHook", lpparam, cfg)
    content = re.sub(r'(\w+Hook)\.apply\((lpparam),\s*(cfg)\)', r'invokeHook("\1", \2, \3)', content)

    # 4. 添加 invokeHook 辅助方法
    if unique_hooks:
        helper = '''
    /** 铁律 1+2: 反射加载 Hook，避免 import 导致类加载冲突 */
    private fun invokeHook(
        name: String,
        lpparam: de.robv.android.xposed.callbacks.XC_LoadPackage.LoadPackageParam,
        cfg: ''' + config_class + '''
    ) {
        try {
            val cls = Class.forName("''' + pkg + '''.hooks." + name)
            val m = cls.getDeclaredMethod(
                "apply",
                de.robv.android.xposed.callbacks.XC_LoadPackage.LoadPackageParam::class.java,
                ''' + config_class + '''::class.java
            )
            m.isAccessible = true
            m.invoke(null, lpparam, cfg)
        } catch (e: ClassNotFoundException) {
            Log.e(TAG, name + " class not found")
        } catch (e: Throwable) {
            Log.e(TAG, name + " FAIL: " + e.message)
        }
    }
'''
        last_brace = content.rfind('\n}')
        if last_brace != -1:
            content = content[:last_brace] + helper + content[last_brace:]

    if content == original:
        return False, f"  {module_name}: 无需修改"
    else:
        loader_path.write_text(content, encoding='utf-8')
        return True, f"  {module_name}: 删除 {len(re.findall(r'import.*hooks', original))} import, 替换 {len(hook_calls)} Hook 调用, Config={config_class}"

def main():
    print("=" * 60)
    print("LSPatch NoRoot 铁律修复脚本 (spec 模式)")
    print("=" * 60)
    fixed = 0
    for mn in sorted(MODULE_PACKAGES.keys()):
        md = MODULES_DIR / mn
        if not md.exists():
            print(f"  {mn}: 跳过（目录不存在）")
            continue
        loader = find_loader(md)
        if not loader:
            print(f"  {mn}: 跳过（无 XposedLoader.kt）")
            continue
        ok, report = fix_loader(loader, mn)
        print(report)
        if ok: fixed += 1
    print(f"\n完成: 修复 {fixed}/11 个模块")
    return 0

if __name__ == "__main__":
    sys.exit(main())
