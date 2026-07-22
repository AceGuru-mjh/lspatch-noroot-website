#!/usr/bin/env python3
"""
LSPatch NoRoot v1.0.13 大完善修复脚本
一次性修复全部 11 个模块的：
  - 铁律1: 删除 import hooks/*，改 invokeHook() 反射
  - 铁律2: Hook 内 Class.forName() 加载目标类（已有，保留）
  - 铁律3: 双分支保留（已有）
  - IPC: ConfigProvider prefs 名与 ConfigManager 统一
  - IPC: 删除 MODE_WORLD_READABLE → MODE_PRIVATE
  - 版本号: VERSION 1.0.11 → 1.0.13
  - build.yml: tag v1.0.12 → v1.0.13
"""
import re, sys
from pathlib import Path

REPO = Path("/tmp/LSPatch-v1013")
MODULES = REPO / "modules"

PKG_MAP = {
    "AdBlockerX_NoRoot": ("com.adblockerx.noroot", "AdBlockConfig"),
    "AudioBoost_NoRoot": ("com.audioboost.noroot", "AudioConfig"),
    "BatteryOptimizer_NoRoot": ("com.batteryopt.noroot", "BatteryConfig"),
    "GameUnlockerPro_NoRoot": ("com.gameunlocker.noroot", "GameConfig"),
    "MicroXEnhancer": ("com.microx.enhancer", "ModuleConfig"),
    "NotifyMaster_NoRoot": ("com.notifymaster.noroot", "NotifyConfig"),
    "PrivacyGuard_NoRoot": ("com.privacyguard.noroot", "PrivacyConfig"),
    "ShizukuSceneFix": ("com.mjh.shizukufix", "ShizukuFixConfig"),
    "StepModifier_NoRoot": ("com.stepmod.noroot", "StepConfig"),
    "VideoSaver_NoRoot": ("com.videosaver.noroot", "VideoConfig"),
    "VipUnlocker_NoRoot": ("com.vipunlocker.noroot", "VipConfig"),
}

def detect_config_class(content, mod_name):
    """从 import 或 loadConfig 检测 Config 类名"""
    default = PKG_MAP[mod_name][1]
    m = re.search(r'import\s+[\w.]+\.models\.(\w+Config)', content)
    if m: return m.group(1)
    m2 = re.search(r'fun\s+loadConfig\(\)\s*:\s*[\w.]*\.(\w+Config)', content)
    if m2: return m2.group(1)
    m3 = re.search(r':\s*(\w+Config)\s*\{', content)
    if m3: return m3.group(1)
    return default

def fix_xposed_loader(loader_path, mod_name):
    """修复 XposedLoader.kt: 铁律1 + 版本号"""
    content = loader_path.read_text(encoding='utf-8')
    original = content
    pkg, _ = PKG_MAP[mod_name]
    config_class = detect_config_class(content, mod_name)

    # 1. 删除 import xxx.hooks.* 和 import xxx.hooks.XxxHook
    content = re.sub(r'^import\s+\w+[\w.]*\.hooks\.\*;?\n', '', content, flags=re.MULTILINE)
    content = re.sub(r'^import\s+\w+[\w.]*\.hooks\.\w+;?\n', '', content, flags=re.MULTILINE)

    # 2. 收集 Hook 名
    hook_calls = re.findall(r'(\w+Hook)\.apply\(', content)
    hook_calls_nocfg = re.findall(r'(\w+Hook)\.hook\((lpparam)\)', content)

    # 3. 替换 XxxHook.apply(lpparam, cfg) -> invokeHook("XxxHook", lpparam, cfg)
    content = re.sub(r'(\w+Hook)\.apply\((lpparam),\s*(cfg)\)', r'invokeHook("\1", \2, \3)', content)
    # 替换 XxxHook.hook(lpparam) -> invokeHookNoCfg("XxxHook", lpparam)
    content = re.sub(r'(\w+Hook)\.hook\((lpparam)\)', r'invokeHookNoCfg("\1", \2)', content)

    # 4. 添加 invokeHook / invokeHookNoCfg 辅助方法
    helpers = ""
    if hook_calls:
        helpers += f'''
    /** 铁律 1+2: 反射加载 Hook，避免 import 导致类加载冲突 */
    private fun invokeHook(
        name: String,
        lpparam: de.robv.android.xposed.callbacks.XC_LoadPackage.LoadPackageParam,
        cfg: {config_class}
    ) {{
        try {{
            val cls = Class.forName("{pkg}.hooks." + name)
            val m = cls.getDeclaredMethod(
                "apply",
                de.robv.android.xposed.callbacks.XC_LoadPackage.LoadPackageParam::class.java,
                {config_class}::class.java
            )
            m.isAccessible = true
            m.invoke(null, lpparam, cfg)
        }} catch (e: ClassNotFoundException) {{
            Log.e(TAG, name + " class not found")
        }} catch (e: Throwable) {{
            Log.e(TAG, name + " FAIL: " + e.message)
        }}
    }}
'''
    if hook_calls_nocfg:
        helpers += f'''
    /** 铁律 1+2: 反射加载 Hook (无 cfg 参数版本) */
    private fun invokeHookNoCfg(
        name: String,
        lpparam: de.robv.android.xposed.callbacks.XC_LoadPackage.LoadPackageParam
    ) {{
        try {{
            val cls = Class.forName("{pkg}.hooks." + name)
            val m = cls.getDeclaredMethod("hook", de.robv.android.xposed.callbacks.XC_LoadPackage.LoadPackageParam::class.java)
            m.isAccessible = true
            m.invoke(null, lpparam)
        }} catch (e: ClassNotFoundException) {{
            Log.e(TAG, name + " class not found")
        }} catch (e: Throwable) {{
            Log.e(TAG, name + " FAIL: " + e.message)
        }}
    }}
'''
    if helpers:
        last_brace = content.rfind('\n}')
        if last_brace != -1:
            content = content[:last_brace] + helpers + content[last_brace:]

    # 5. 版本号 1.0.11 → 1.0.13
    content = re.sub(r'VERSION\s*=\s*"1\.0\.1[0-9]"', 'VERSION = "1.0.13"', content)
    content = re.sub(r'VERSION\s*=\s*"1\.0\.\d+"', 'VERSION = "1.0.13"', content)

    changed = content != original
    if changed:
        loader_path.write_text(content, encoding='utf-8')
    return changed, len(hook_calls), len(hook_calls_nocfg)

def fix_config_files(mod_dir, mod_name):
    """修复 ConfigManager + ConfigProvider + HookConfigReader: IPC prefs 名统一 + 删 MODE_WORLD_READABLE"""
    pkg = PKG_MAP[mod_name][0]
    # 标准 prefs 名：{module}_prefs
    std_prefs = f"{mod_name.lower().replace('_noroot','').replace('_','_')}_prefs"

    results = {"prefs_fixed": False, "mode_wr_fixed": 0, "xshared_removed": False}

    # ConfigManager.kt
    cm = list(mod_dir.rglob("ConfigManager.kt"))
    if cm:
        cm = cm[0]
        c = cm.read_text(encoding='utf-8')
        o = c
        # 统一 PREFS_NAME
        c = re.sub(r'(PREFS_NAME\s*=\s*)"[^"]*"', f'\\1"{std_prefs}"', c)
        # 统一 getSharedPreferences("xxx" → getSharedPreferences(PREFS_NAME 或 std_prefs
        c = re.sub(r'getSharedPreferences\("[^"]*"', f'getSharedPreferences("{std_prefs}"', c)
        # MODE_WORLD_READABLE → MODE_PRIVATE
        wr_count = c.count("MODE_WORLD_READABLE")
        c = c.replace("MODE_WORLD_READABLE", "MODE_PRIVATE")
        if c != o:
            cm.write_text(c, encoding='utf-8')
            if wr_count > 0: results["mode_wr_fixed"] += wr_count
            results["prefs_fixed"] = True

    # ConfigProvider.kt
    cp = list(mod_dir.rglob("ConfigProvider.kt"))
    if cp:
        cp = cp[0]
        c = cp.read_text(encoding='utf-8')
        o = c
        # 统一 getSharedPreferences("xxx" → 标准名
        c = re.sub(r'getSharedPreferences\("[^"]*"', f'getSharedPreferences("{std_prefs}"', c)
        # 如果有 PREFS 常量也统一
        c = re.sub(r'(PREFS[_A-Z]*\s*=\s*)"[^"]*"', f'\\1"{std_prefs}"', c)
        # MODE_WORLD_READABLE → MODE_PRIVATE
        wr_count = c.count("MODE_WORLD_READABLE")
        c = c.replace("MODE_WORLD_READABLE", "MODE_PRIVATE")
        if c != o:
            cp.write_text(c, encoding='utf-8')
            if wr_count > 0: results["mode_wr_fixed"] += wr_count
            results["prefs_fixed"] = True

    # HookConfigReader.kt — 删除 XSharedPreferences / makeWorldReadable
    hcr = list(mod_dir.rglob("HookConfigReader.kt"))
    if hcr:
        hcr = hcr[0]
        c = hcr.read_text(encoding='utf-8')
        o = c
        # 删除 makeWorldReadable() 调用
        c = re.sub(r'\.makeWorldReadable\(\)', '', c)
        # MODE_WORLD_READABLE → MODE_PRIVATE
        wr_count = c.count("MODE_WORLD_READABLE")
        c = c.replace("MODE_WORLD_READABLE", "MODE_PRIVATE")
        if c != o:
            hcr.write_text(c, encoding='utf-8')
            if wr_count > 0: results["mode_wr_fixed"] += wr_count
            results["xshared_removed"] = True

    # LogStore.kt — 删 MODE_WORLD_READABLE
    ls = list(mod_dir.rglob("LogStore.kt"))
    if ls:
        ls = ls[0]
        c = ls.read_text(encoding='utf-8')
        o = c
        wr_count = c.count("MODE_WORLD_READABLE")
        c = c.replace("MODE_WORLD_READABLE", "MODE_PRIVATE")
        if c != o:
            ls.write_text(c, encoding='utf-8')
            if wr_count > 0: results["mode_wr_fixed"] += wr_count

    return results

def fix_build_gradle(mod_dir):
    """build.gradle.kts versionName 1.0.11 → 1.0.13"""
    bg = mod_dir / "app" / "build.gradle.kts"
    if not bg.exists(): return False
    c = bg.read_text(encoding='utf-8')
    o = c
    c = re.sub(r'versionName\s*=\s*"1\.0\.\d+"', 'versionName = "1.0.13"', c)
    c = re.sub(r'versionCode\s*=\s*\d+', 'versionCode = 13', c)
    if c != o:
        bg.write_text(c, encoding='utf-8')
        return True
    return False

def fix_build_yml():
    """build.yml tag v1.0.12 → v1.0.13"""
    yml = REPO / ".github" / "workflows" / "build.yml"
    if not yml.exists(): return False
    c = yml.read_text(encoding='utf-8')
    o = c
    c = c.replace("tag_name: v1.0.12", "tag_name: v1.0.13")
    c = c.replace("tag_name: v1.0.11", "tag_name: v1.0.13")
    c = re.sub(r'name:\s*LSPatch-Noroot-modle[^\n]*', 'name: LSPatch-Noroot-modle 模块合集 v1.0.13', c)
    c = re.sub(r'#\s*LSPatch-Noroot-modle v1\.0\.\d+', '# LSPatch-Noroot-modle v1.0.13', c)
    # 更新 body
    if "v1.0.13" not in c.split("body:")[1][:200] if "body:" in c else True:
        c = re.sub(
            r'body:\s*\|?\s*\n\s*#[^\n]*\n(\s*- [^\n]*\n)*',
            'body: |\n            # LSPatch-Noroot-modle v1.0.13\n            ## 三大铁律全量修复版\n            - 铁律 1: 11 模块 XposedLoader 零 import hooks/*（全反射）\n            - 铁律 2: Hook 用 Class.forName() 加载目标类\n            - 铁律 3: 进程双分支（自身进程→UI，宿主进程→纯Hook）\n            - IPC: ConfigProvider/ConfigManager prefs 名统一\n            - IPC: 删除 MODE_WORLD_READABLE → MODE_PRIVATE\n            - 版本号: 1.0.11 → 1.0.13\n            \n            ## 11 个免 Root 模块\n            开发者：MJH\n',
            c
        )
    if c != o:
        yml.write_text(c, encoding='utf-8')
        return True
    return False

def main():
    print("=" * 64)
    print("  LSPatch NoRoot v1.0.13 大完善修复")
    print("=" * 64)
    print()

    total = {"loaders": 0, "imports_deleted": 0, "hooks_reflected": 0,
             "prefs_fixed": 0, "mode_wr_fixed": 0, "build_gradle": 0}

    for mod_name in sorted(PKG_MAP.keys()):
        mod_dir = MODULES / mod_name
        if not mod_dir.exists():
            print(f"  ✗ {mod_name}: 目录不存在")
            continue

        loader = list(mod_dir.rglob("XposedLoader.kt"))
        if not loader:
            print(f"  ✗ {mod_name}: 无 XposedLoader.kt")
            continue

        # 1. 修 XposedLoader
        ok, apply_cnt, hook_cnt = fix_xposed_loader(loader[0], mod_name)
        if ok:
            total["loaders"] += 1
            total["hooks_reflected"] += apply_cnt + hook_cnt

        # 2. 修 Config 文件
        res = fix_config_files(mod_dir, mod_name)
        if res["prefs_fixed"]: total["prefs_fixed"] += 1
        total["mode_wr_fixed"] += res["mode_wr_fixed"]

        # 3. 修 build.gradle.kts
        if fix_build_gradle(mod_dir): total["build_gradle"] += 1

        print(f"  ✓ {mod_name}: invokeHook={apply_cnt} invokeHookNoCfg={hook_cnt} "
              f"prefs={'✓' if res['prefs_fixed'] else '-'} mode_wr={res['mode_wr_fixed']}")

    # 4. 修 build.yml
    yml_ok = fix_build_yml()
    print(f"  ✓ build.yml: {'更新 v1.0.13' if yml_ok else '无改动'}")

    print()
    print("=" * 64)
    print("  v1.0.13 修复汇总")
    print("=" * 64)
    print(f"  XposedLoader 修复:      {total['loaders']}/11")
    print(f"  Hook 调用反射化:        {total['hooks_reflected']} 处")
    print(f"  Config prefs 名统一:    {total['prefs_fixed']}/11")
    print(f"  MODE_WORLD_READABLE 删除: {total['mode_wr_fixed']} 处")
    print(f"  build.gradle 版本更新:  {total['build_gradle']}/11")
    print(f"  build.yml tag 更新:     {'✓' if yml_ok else '✗'}")
    print()
    return 0

if __name__ == "__main__":
    sys.exit(main())
