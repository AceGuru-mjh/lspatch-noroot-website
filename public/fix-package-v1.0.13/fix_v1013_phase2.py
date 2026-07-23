#!/usr/bin/env python3
"""v1.0.13 Phase 2 补修：铁律2 + ConfigProvider permission"""
import re
from pathlib import Path

REPO = Path("/tmp/LSPatch-v1013")
MODULES = sorted([d.name for d in (REPO / "modules").iterdir() if d.is_dir() and d.name != "keystore"])

# 模块 → 包名
PKG = {
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

def fix_hook_files(mod_dir):
    """修复 Hook 文件铁律2：String+classLoader → Class.forName"""
    fixed = 0
    hooks_dir = list(mod_dir.rglob("hooks"))[0] if list(mod_dir.rglob("hooks")) else None
    if not hooks_dir or not hooks_dir.exists():
        return 0
    for hf in hooks_dir.glob("*.kt"):
        c = hf.read_text(encoding='utf-8')
        o = c
        # 模式: findAndHookMethod(\n   "xxx", lpparam.classLoader, "method",...
        # 改为: Class.forName("xxx") 先加载，再 findAndHookMethod(cls, "method",...
        # 简单替换：把 "xxx", lpparam.classLoader, → Class.forName("xxx"),
        c = re.sub(
            r'findAndHookMethod\(\s*\n?\s*"([^"]+)"\s*,\s*lpparam\.classLoader\s*,',
            r'findAndHookMethod(\n                Class.forName("\1"),',
            c
        )
        # 单行模式
        c = re.sub(
            r'findAndHookMethod\(\s*"([^"]+)"\s*,\s*lpparam\.classLoader\s*,',
            r'findAndHookMethod(Class.forName("\1"),',
            c
        )
        if c != o:
            hf.write_text(c, encoding='utf-8')
            fixed += 1
    return fixed

def fix_manifest_permission(mod_dir, mod_name):
    """给 ConfigProvider 加 readPermission"""
    manifest = list(mod_dir.rglob("AndroidManifest.xml"))
    if not manifest: return False
    mp = manifest[0]
    c = mp.read_text(encoding='utf-8')
    o = c
    pkg = PKG[mod_name]
    perm = f'{pkg}.permission.CONFIG_READ'
    
    # 如果已有 permission 跳过
    if 'readPermission' in c or 'android:permission' in c:
        return False
    
    # 1. 在 <manifest> 内加 <permission> 声明（在 <application> 前）
    if f'android:name="{perm}"' not in c:
        perm_decl = f'    <permission\n        android:name="{perm}"\n        android:protectionLevel="signature" />\n'
        c = re.sub(r'(\s*<application)', perm_decl + r'\1', c, count=1)
    
    # 2. 给 ConfigProvider 加 readPermission
    c = re.sub(
        r'(<provider[^>]*?name="[^"]*ConfigProvider"[^>]*?)(/?>)',
        lambda m: m.group(1) + f' android:readPermission="{perm}"' + m.group(2),
        c
    )
    # 如果是 > 结尾（非自闭合），也要加
    c = re.sub(
        r'(<provider[^>]*?name="[^"]*ConfigProvider"[^>]*?)(\s*>)',
        lambda m: m.group(1) + f' android:readPermission="{perm}"' + m.group(2) if 'readPermission' not in m.group(1) else m.group(0),
        c
    )
    
    if c != o:
        mp.write_text(c, encoding='utf-8')
        return True
    return False

print("=" * 60)
print("  v1.0.13 Phase 2: 铁律2 + ConfigProvider permission")
print("=" * 60)

hook_total = 0
perm_total = 0
for mod in MODULES:
    md = REPO / "modules" / mod
    h = fix_hook_files(md)
    p = fix_manifest_permission(md, mod)
    hook_total += h
    if p: perm_total += 1
    if h or p:
        print(f"  ✓ {mod}: hooks 修复={h} permission={'✓' if p else '-'}")

print()
print(f"Hook 文件铁律2 修复: {hook_total}")
print(f"ConfigProvider permission 添加: {perm_total}/11")
