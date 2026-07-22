/**
 * LSPatch NoRoot 模块铁律修复数据
 * 包含：三大铁律 + 修正后源码 + 6项检查清单 + 6条踩坑记录(11-16)
 */

/* ============ 三大铁律 ============ */

export interface IronRule {
  id: number;
  title: string;
  short: string;
  severity: "critical" | "high" | "medium";
  reason: string;
  wrongCode: string;
  rightCode: string;
  wrongLang: string;
  rightLang: string;
}

export const IRON_RULES: IronRule[] = [
  {
    id: 1,
    title: "XposedLoader 禁止 import hooks/*",
    short: "零 import",
    severity: "critical",
    reason:
      "集成模式下，XposedLoader 类被 ClassLoader 加载时，JVM 会立即解析所有 import 语句，被迫提前加载 hooks/* 下的 10 个 Hook object。而这些 Hook 类可能引用了宿主进程中尚未由 LSPatch runtime 注入的依赖——还没到 handleLoadPackage 就 NoClassDefFoundError 秒崩。通配 import 尤其致命，一行击穿整个类加载链。",
    wrongLang: "kotlin",
    rightLang: "kotlin",
    wrongCode: `package com.gameunlocker.noroot

import de.robv.android.xposed.IXposedHookLoadPackage
import de.robv.android.xposed.callbacks.XC_LoadPackage.LoadPackageParam
// ❌ 铁律 1 违反：通配 import 把 10 个 Hook 全部拉入类加载链
import com.gameunlocker.noroot.hooks.FrameRateUnlockHook
import com.gameunlocker.noroot.hooks.DeviceSpoofHook
import com.gameunlocker.noroot.hooks.ProcessOptimizerHook
// ... 还有 7 个

class XposedLoader : IXposedHookLoadPackage {
    override fun handleLoadPackage(lpparam: LoadPackageParam) {
        // ❌ 直接引用 Hook object —— 类加载阶段就触发解析
        FrameRateUnlockHook.apply(lpparam, cfg)
        DeviceSpoofHook.apply(lpparam, cfg)
        ProcessOptimizerHook.apply(lpparam, cfg)
    }
}`,
    rightCode: `package com.gameunlocker.noroot

import de.robv.android.xposed.IXposedHookLoadPackage
import de.robv.android.xposed.callbacks.XC_LoadPackage.LoadPackageParam
// ✅ 零 import hooks/* —— 类加载阶段不触碰任何 Hook 类

class XposedLoader : IXposedHookLoadPackage {

    companion object {
        // Hook 类全限定名列表 —— 运行时反射加载
        private val HOOK_CLASSES = arrayOf(
            "com.gameunlocker.noroot.hooks.FrameRateUnlockHook",
            "com.gameunlocker.noroot.hooks.DeviceSpoofHook",
            "com.gameunlocker.noroot.hooks.ProcessOptimizerHook"
            // ... 其余 7 个
        )
    }

    override fun handleLoadPackage(lpparam: LoadPackageParam) {
        // ✅ 反射加载：Class.forName → getDeclaredMethod → invoke
        for (hookClassName in HOOK_CLASSES) {
            try {
                val clazz = Class.forName(hookClassName)
                val method = clazz.getDeclaredMethod(
                    "apply",
                    LoadPackageParam::class.java,
                    GameConfig::class.java
                )
                method.isAccessible = true
                method.invoke(null, lpparam, cfg)  // 静态方法 receiver=null
            } catch (e: Exception) {
                XposedBridge.log("Hook load failed: $hookClassName - \${e.message}")
            }
        }
    }
}`,
  },
  {
    id: 2,
    title: "所有 Hook 必须反射调用 Class.forName().getDeclaredMethod().invoke()",
    short: "全反射",
    severity: "high",
    reason:
      "Hook 目标类（如 com.unity3d.player.UnityPlayer）不在编译期 classpath 中，直接 import 会编译报错。即使用 XposedHelpers.findAndHookMethod(String, classLoader, ...) 的字符串重载，在集成模式下 lpparam.classLoader 是宿主的 PathClassLoader，可能无法找到第三方 SDK 类。必须用 Class.forName() 显式加载、捕获 ClassNotFoundException，再传 Class 对象给 findAndHookMethod。",
    wrongLang: "kotlin",
    rightLang: "kotlin",
    wrongCode: `object FrameRateUnlockHook {

    fun apply(lpparam: LoadPackageParam, cfg: GameConfig) {
        // ❌ String + classLoader 重载：集成模式下 classLoader 可能找不到第三方类
        XposedHelpers.findAndHookMethod(
            "com.unity3d.player.UnityPlayer",  // ← 字符串
            lpparam.classLoader,                 // ← 宿主 ClassLoader
            "setTargetFrameRate",
            Int::class.java,
            object : XC_MethodHook() { /* ... */ }
        )

        // ❌ 更糟：直接 import 第三方 SDK
        // import com.unity3d.player.UnityPlayer  ← 编译就报错
    }
}`,
    rightCode: `object FrameRateUnlockHook {

    fun apply(lpparam: LoadPackageParam, cfg: GameConfig) {
        unlockUnityFrameRate(cfg)
    }

    private fun unlockUnityFrameRate(cfg: GameConfig) {
        try {
            // ✅ Class.forName 显式加载目标类
            val unityClass = Class.forName("com.unity3d.player.UnityPlayer")

            // ✅ 传 Class 对象给 findAndHookMethod（不用 String + classLoader）
            XposedHelpers.findAndHookMethod(
                unityClass,                    // ← Class 对象
                "setTargetFrameRate",
                Int::class.java,
                object : XC_MethodHook() {
                    override fun beforeHookedMethod(param: MethodHookParam) {
                        param.args[0] = cfg.targetFps
                    }
                }
            )
        } catch (e: ClassNotFoundException) {
            // 非 Unity 游戏，正常跳过
            XposedBridge.log("UnityPlayer not found, skip")
        } catch (e: Exception) {
            XposedBridge.log("Unity hook failed: \${e.message}")
        }
    }
}`,
  },
  {
    id: 3,
    title: "进程双分支：自身进程→UI，宿主进程→纯 Hook",
    short: "双分支",
    severity: "high",
    reason:
      "LSPatch 会把模块注入到两个进程：模块自身的进程（用户从桌面点开模块 APK）和宿主 APP 进程。如果不做分支判断，Hook 会被注入到自身进程，导致 UI 卡顿/ANR，甚至 Hook 自身 Hook 造成死循环。必须在 handleLoadPackage 入口处判断 lpparam.packageName == 自身包名 → 走 UI 逻辑；否则 → 走纯 Hook 注入。",
    wrongLang: "kotlin",
    rightLang: "kotlin",
    wrongCode: `class XposedLoader : IXposedHookLoadPackage {
    override fun handleLoadPackage(lpparam: LoadPackageParam) {
        // ❌ 无进程分支：对所有进程注入 Hook
        val cfg = ConfigClient.read(lpparam.packageName)

        FrameRateUnlockHook.apply(lpparam, cfg)
        DeviceSpoofHook.apply(lpparam, cfg)
        // ... 所有 Hook 无差别注入

        // ❌ 当 lpparam.packageName == 自身包名时，
        // Hook 会被注入到模块自身进程 → UI ANR / Hook 自身 Hook 死循环
    }
}`,
    rightCode: `class XposedLoader : IXposedHookLoadPackage {

    companion object {
        private const val OWN_PKG = "com.gameunlocker.noroot"
    }

    override fun handleLoadPackage(lpparam: LoadPackageParam) {
        // ✅ 铁律 3：进程双分支
        val isOwnProcess = lpparam.packageName == OWN_PKG

        if (isOwnProcess) {
            // 自身进程 → 仅 UI，不注入任何 Hook
            // UI 由 MainActivity 自行启动，此处直接 return
            XposedBridge.log("[自身进程] UI 模式，跳过 Hook")
            return
        }

        // 宿主进程 → 纯 Hook 模式
        XposedBridge.log("[宿主进程] 注入 Hook: \${lpparam.packageName}")
        val cfg = ConfigClient.read(lpparam.packageName)
        if (!cfg.masterSwitch) return

        applyHooksViaReflection(lpparam, cfg)
    }
}`,
  },
];

/* ============ 修正后源码 ============ */

export interface CodeFile {
  id: string;
  name: string;
  path: string;
  lang: string;
  desc: string;
  code: string;
}

export const CORRECTED_FILES: CodeFile[] = [
  {
    id: "xposed-loader",
    name: "XposedLoader.kt",
    path: "app/src/main/java/com/gameunlocker/noroot/XposedLoader.kt",
    lang: "kotlin",
    desc: "模块入口 · 三铁律核心修复（零 import + 全反射 + 双分支）",
    code: `package com.gameunlocker.noroot

import de.robv.android.xposed.IXposedHookLoadPackage
import de.robv.android.xposed.IXposedHookZygoteInit
import de.robv.android.xposed.XposedBridge
import de.robv.android.xposed.callbacks.XC_LoadPackage.LoadPackageParam
import com.gameunlocker.noroot.core.ConfigClient
import com.gameunlocker.noroot.core.GameConfig

/**
 * LSPatch NoRoot 模块入口
 *
 * ★ 铁律 1：零 import hooks/* —— 集成模式下 import 会在 ClassLoader
 *   解析阶段触发类加载冲突，还没到 handleLoadPackage 就 NoClassDefFoundError 秒崩
 * ★ 铁律 2：所有 Hook 通过 Class.forName().getDeclaredMethod().invoke() 反射加载
 * ★ 铁律 3：进程双分支 —— 自身进程走 UI，宿主进程走纯 Hook
 */
class XposedLoader : IXposedHookLoadPackage, IXposedHookZygoteInit {

    companion object {
        private const val TAG = "GameUnlocker_NoRoot"
        private const val OWN_PKG = "com.gameunlocker.noroot"

        /** Hook 类全限定名列表 —— 反射加载，避免 import（铁律 1） */
        private val HOOK_CLASSES = arrayOf(
            "com.gameunlocker.noroot.hooks.FrameRateUnlockHook",
            "com.gameunlocker.noroot.hooks.DeviceSpoofHook",
            "com.gameunlocker.noroot.hooks.ProcessOptimizerHook",
            "com.gameunlocker.noroot.hooks.ResolutionSpoofHook",
            "com.gameunlocker.noroot.hooks.TouchSamplingBoostHook",
            "com.gameunlocker.noroot.hooks.NetworkLatencyOptHook",
            "com.gameunlocker.noroot.hooks.AudioPriorityBoostHook",
            "com.gameunlocker.noroot.hooks.MemoryDefragHook",
            "com.gameunlocker.noroot.hooks.GameDetectionHideHook",
            "com.gameunlocker.noroot.hooks.ShizukuSystemTuneHook"
        )
    }

    @Volatile
    private var ownProcessInited = false

    override fun initZygote(startupParam: IXposedHookZygoteInit.StartupParam) {
        XposedBridge.log("$TAG: initZygote modulePath=\${startupParam.modulePath}")
    }

    override fun handleLoadPackage(lpparam: LoadPackageParam) {
        // ★ 铁律 3：进程双分支
        val isOwnProcess = lpparam.packageName == OWN_PKG

        if (isOwnProcess) {
            // ── 自身进程 → 仅 UI，不注入任何 Hook ──
            if (!ownProcessInited) {
                ownProcessInited = true
                XposedBridge.log("$TAG: [自身进程] UI 模式，跳过 Hook pkg=\${lpparam.packageName}")
            }
            return
        }

        // ── 宿主进程 → 纯 Hook 模式 ──
        XposedBridge.log("$TAG: [宿主进程] 开始注入 Hook pkg=\${lpparam.packageName}")

        // ★ IPC 铁律：通过 ContentProvider 读配置，不用 SharedPreferences
        val cfg = ConfigClient.read(lpparam.packageName)
        if (!cfg.masterSwitch) {
            XposedBridge.log("$TAG: 总开关关闭，跳过所有 Hook")
            return
        }

        // ★ 铁律 1 + 2：反射加载所有 Hook
        applyHooksViaReflection(lpparam, cfg)
    }

    /**
     * 反射加载所有 Hook 类并调用其 apply(lpparam, cfg) 方法
     * 每个 Hook 独立 try-catch，单个失败不影响其他
     */
    private fun applyHooksViaReflection(lpparam: LoadPackageParam, cfg: GameConfig) {
        for (hookClassName in HOOK_CLASSES) {
            try {
                // ★ 铁律 2：Class.forName → getDeclaredMethod → invoke
                val clazz = Class.forName(hookClassName)
                val method = clazz.getDeclaredMethod(
                    "apply",
                    LoadPackageParam::class.java,
                    GameConfig::class.java
                )
                method.isAccessible = true
                method.invoke(null, lpparam, cfg)

                val shortName = hookClassName.substringAfterLast('.')
                XposedBridge.log("$TAG: ✓ Hook loaded: $shortName")
            } catch (e: ClassNotFoundException) {
                XposedBridge.log("$TAG: ✗ Hook class not found: $hookClassName")
            } catch (e: NoSuchMethodException) {
                XposedBridge.log("$TAG: ✗ apply() not found: $hookClassName")
            } catch (e: Exception) {
                XposedBridge.log("$TAG: ✗ Hook failed: $hookClassName - \${e.message}")
            }
        }
    }
}`,
  },
  {
    id: "frame-rate-hook",
    name: "FrameRateUnlockHook.kt",
    path: "app/src/main/java/com/gameunlocker/noroot/hooks/FrameRateUnlockHook.kt",
    lang: "kotlin",
    desc: "Hook 示例 · 铁律 2 全反射实现（Class.forName + 传 Class 对象）",
    code: `package com.gameunlocker.noroot.hooks

import de.robv.android.xposed.XC_MethodHook
import de.robv.android.xposed.XposedBridge
import de.robv.android.xposed.XposedHelpers
import de.robv.android.xposed.callbacks.XC_LoadPackage.LoadPackageParam
import com.gameunlocker.noroot.core.GameConfig

/**
 * 帧率解锁 Hook
 *
 * ★ 铁律 2：所有目标类用 Class.forName() 显式加载
 *   - 不用 XposedHelpers.findAndHookMethod(String, ClassLoader, ...) 字符串重载
 *   - 改用 findAndHookMethod(Class, methodName, ...) 传 Class 对象
 *   - 类查找失败可被 try-catch 捕获，不影响其他 Hook
 */
object FrameRateUnlockHook {

    fun apply(lpparam: LoadPackageParam, cfg: GameConfig) {
        if (!cfg.frameRateUnlock) return

        unlockDisplayRefreshRate(cfg)
        unlockSurfaceFrameRate(cfg)
        unlockUnityFrameRate(cfg)
    }

    /** Hook android.view.Display.getRefreshRate() */
    private fun unlockDisplayRefreshRate(cfg: GameConfig) {
        try {
            // ★ Class.forName 加载系统类
            val displayClass = Class.forName("android.view.Display")

            XposedHelpers.findAndHookMethod(
                displayClass,  // ← 传 Class 对象
                "getRefreshRate",
                object : XC_MethodHook() {
                    override fun afterHookedMethod(param: MethodHookParam) {
                        param.result = cfg.targetFps.toFloat()
                    }
                }
            )
            XposedBridge.log("FrameRateUnlock: Display.getRefreshRate → \${cfg.targetFps}")
        } catch (e: Exception) {
            XposedBridge.log("FrameRateUnlock: Display hook failed - \${e.message}")
        }
    }

    /** Hook android.view.Surface.setFrameRate() */
    private fun unlockSurfaceFrameRate(cfg: GameConfig) {
        try {
            val surfaceClass = Class.forName("android.view.Surface")

            XposedHelpers.findAndHookMethod(
                surfaceClass,
                "setFrameRate",
                Float::class.java,
                Int::class.java,
                object : XC_MethodHook() {
                    override fun beforeHookedMethod(param: MethodHookParam) {
                        param.args[0] = cfg.targetFps.toFloat()
                    }
                }
            )
        } catch (e: Exception) {
            XposedBridge.log("FrameRateUnlock: Surface hook failed - \${e.message}")
        }
    }

    /** Hook com.unity3d.player.UnityPlayer.setTargetFrameRate() */
    private fun unlockUnityFrameRate(cfg: GameConfig) {
        try {
            // ★ 第三方 SDK 类 —— 编译期不可用，必须反射
            val unityClass = Class.forName("com.unity3d.player.UnityPlayer")

            XposedHelpers.findAndHookMethod(
                unityClass,
                "setTargetFrameRate",
                Int::class.java,
                object : XC_MethodHook() {
                    override fun beforeHookedMethod(param: MethodHookParam) {
                        param.args[0] = cfg.targetFps
                    }
                }
            )
            XposedBridge.log("FrameRateUnlock: Unity → \${cfg.targetFps}")
        } catch (e: ClassNotFoundException) {
            // 非 Unity 游戏，正常跳过
        } catch (e: Exception) {
            XposedBridge.log("FrameRateUnlock: Unity hook failed - \${e.message}")
        }
    }
}`,
  },
  {
    id: "config-manager",
    name: "ConfigManager.kt",
    path: "app/src/main/java/com/gameunlocker/noroot/utils/ConfigManager.kt",
    lang: "kotlin",
    desc: "UI 进程配置读写 · 删除 MODE_WORLD_READABLE，仅 MODE_PRIVATE",
    code: `package com.gameunlocker.noroot.utils

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import com.gameunlocker.noroot.core.GameConfig

/**
 * UI 进程侧配置管理器
 *
 * ★ IPC 铁律：仅用 MODE_PRIVATE（自身进程读写）
 *   - 删除 MODE_WORLD_READABLE（API24+ 抛 SecurityException）
 *   - 跨进程读由 ConfigProvider 暴露，Hook 侧用 ConfigClient 查询
 */
class ConfigManager private constructor(context: Context) {

    companion object {
        // ★ 修复 Bug 13：prefs 名必须与 ConfigProvider 一致
        private const val PREFS_NAME = "game_unlocker_prefs"
        private const val KEY_CONFIG = "game_config_json"

        @Volatile
        private var instance: ConfigManager? = null

        fun get(context: Context): ConfigManager =
            instance ?: synchronized(this) {
                instance ?: ConfigManager(context.applicationContext).also { instance = it }
            }
    }

    // ★ MODE_PRIVATE only —— 不再用 MODE_WORLD_READABLE
    private val prefs: SharedPreferences =
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    private val gson = Gson()

    fun getConfig(): GameConfig {
        val json = prefs.getString(KEY_CONFIG, null) ?: return GameConfig.default()
        return try {
            gson.fromJson(json, GameConfig::class.java)
        } catch (e: Exception) {
            GameConfig.default()
        }
    }

    fun saveConfig(cfg: GameConfig) {
        prefs.edit().apply {
            putString(KEY_CONFIG, gson.toJson(cfg))
            apply()
        }
    }

    fun setMasterSwitch(on: Boolean) {
        val cfg = getConfig()
        saveConfig(cfg.copy(masterSwitch = on))
    }

    /** 写入指标（供 ConfigProvider 暴露给 Hook 侧读取） */
    fun putMetric(name: String, value: Long) {
        prefs.edit().putLong("metric_\\$name", value).apply()
    }

    fun getMetric(name: String): Long = prefs.getLong("metric_\\$name", 0L)
}`,
  },
  {
    id: "config-provider",
    name: "ConfigProvider.kt",
    path: "app/src/main/java/com/gameunlocker/noroot/core/ConfigProvider.kt",
    lang: "kotlin",
    desc: "ContentProvider · 修复 prefs 名不一致 + 正确暴露配置",
    code: `package com.gameunlocker.noroot.core

import android.content.ContentProvider
import android.content.ContentValues
import android.content.UriMatcher
import android.database.Cursor
import android.database.MatrixCursor
import android.net.Uri
import com.gameunlocker.noroot.utils.ConfigManager

/**
 * 跨进程配置 ContentProvider
 *
 * ★ IPC 铁律：所有跨进程配置读写走 ContentProvider
 *   authority: \${applicationId}.configprovider
 *   URI: content://com.gameunlocker.noroot.configprovider/config
 *
 * ★ 修复 Bug 13：prefs 名与 ConfigManager 统一为 "game_unlocker_prefs"
 */
class ConfigProvider : ContentProvider() {

    companion object {
        const val AUTHORITY_SUFFIX = ".configprovider"
        const val PATH_CONFIG = "config"
        const val PATH_MASTER = "master"

        private const val CODE_CONFIG = 1
        private const val CODE_MASTER = 2
    }

    private lateinit var configManager: ConfigManager
    private lateinit var uriMatcher: UriMatcher

    override fun onCreate(): Boolean {
        val ctx = context ?: return false
        val authority = ctx.packageName + AUTHORITY_SUFFIX

        uriMatcher = UriMatcher(UriMatcher.NO_MATCH).apply {
            addURI(authority, PATH_CONFIG, CODE_CONFIG)
            addURI(authority, PATH_MASTER, CODE_MASTER)
        }
        configManager = ConfigManager.get(ctx)
        return true
    }

    override fun query(
        uri: Uri, projection: Array<String>?,
        selection: String?, selectionArgs: Array<String>?,
        sortOrder: String?
    ): Cursor? {
        when (uriMatcher.match(uri)) {
            CODE_CONFIG -> return queryAllConfig()
            CODE_MASTER -> return queryMasterSwitch()
        }
        return null
    }

    /** 返回完整配置（key-value 键值对） */
    private fun queryAllConfig(): Cursor {
        val cursor = MatrixCursor(arrayOf("key", "value", "type"))
        val cfg = configManager.getConfig()

        cursor.addRow(arrayOf("master_switch", cfg.masterSwitch, "boolean"))
        cursor.addRow(arrayOf("frame_rate_unlock", cfg.frameRateUnlock, "boolean"))
        cursor.addRow(arrayOf("target_fps", cfg.targetFps, "int"))
        cursor.addRow(arrayOf("device_spoof", cfg.deviceSpoof, "boolean"))
        cursor.addRow(arrayOf("process_optimize", cfg.processOptimize, "boolean"))
        // ... 其余字段
        return cursor
    }

    /** 仅返回总开关（高频查询优化） */
    private fun queryMasterSwitch(): Cursor {
        val cursor = MatrixCursor(arrayOf("value"))
        cursor.addRow(arrayOf(if (configManager.getConfig().masterSwitch) 1 else 0))
        return cursor
    }

    // Hook 侧只读，不支持写
    override fun update(uri: Uri, values: ContentValues?, selection: String?,
                        selectionArgs: Array<String>?): Int = 0
    override fun insert(uri: Uri, values: ContentValues?): Uri? = null
    override fun delete(uri: Uri, selection: String?,
                        selectionArgs: Array<String>?): Int = 0
    override fun getType(uri: Uri): String? = null
}`,
  },
  {
    id: "config-client",
    name: "ConfigClient.kt",
    path: "app/src/main/java/com/gameunlocker/noroot/core/ConfigClient.kt",
    lang: "kotlin",
    desc: "Hook 进程配置读取 · 纯 ContentProvider，删除 XSharedPreferences",
    code: `package com.gameunlocker.noroot.core

import android.content.Context
import android.net.Uri
import com.google.gson.Gson

/**
 * Hook 进程侧配置读取客户端
 *
 * ★ IPC 铁律：通过 ContentResolver 查询 ConfigProvider
 *   - 删除 XSharedPreferences（LSPatch 集成模式不可靠）
 *   - 删除 makeWorldReadable()（API24+ 抛异常）
 *
 * ★ 修复 Bug 12/14：模块包名硬编码，不依赖 context.packageName
 *   （宿主进程中 context.packageName 是宿主包名，不是模块包名）
 */
object ConfigClient {

    // ★ 模块自身的包名（硬编码）
    private const val MODULE_PKG = "com.gameunlocker.noroot"
    private const val AUTHORITY = "$MODULE_PKG\${ConfigProvider.AUTHORITY_SUFFIX}"

    private fun configUri(): Uri =
        Uri.parse("content://$AUTHORITY/\${ConfigProvider.PATH_CONFIG}")

    private fun masterUri(): Uri =
        Uri.parse("content://$AUTHORITY/\${ConfigProvider.PATH_MASTER}")

    /**
     * 读取完整配置
     * @param context 宿主进程的 context（lpparam.packageName 对应进程）
     */
    fun read(context: Context): GameConfig {
        return try {
            val cursor = context.contentResolver.query(
                configUri(), null, null, null, null
            )
            cursor?.use {
                val map = HashMap<String, String>()
                while (it.moveToNext()) {
                    val key = it.getString(0)
                    val value = it.getString(1)
                    map[key] = value
                }
                GameConfig.fromMap(map)
            } ?: GameConfig.default()
        } catch (e: Exception) {
            XposedBridge.log("ConfigClient read failed: \${e.message}")
            GameConfig.default()
        }
    }

    /** 高频查询：仅读总开关 */
    fun isMasterOn(context: Context): Boolean {
        return try {
            val cursor = context.contentResolver.query(
                masterUri(), null, null, null, null
            )
            cursor?.use {
                it.moveToFirst() && it.getInt(0) == 1
            } ?: false
        } catch (e: Exception) {
            false
        }
    }
}`,
  },
  {
    id: "hook-config-reader",
    name: "HookConfigReader.kt",
    path: "app/src/main/java/com/gameunlocker/noroot/utils/HookConfigReader.kt",
    lang: "kotlin",
    desc: "Hook 侧配置读取 · 删除 XSharedPreferences 双通道，仅走 ConfigClient",
    code: `package com.gameunlocker.noroot.utils

import android.content.Context
import com.gameunlocker.noroot.core.ConfigClient
import com.gameunlocker.noroot.core.GameConfig

/**
 * Hook 侧配置读取统一入口
 *
 * ★ 修复前：XSharedPreferences + ConfigClient 双通道兜底
 *   - XSharedPreferences 在 LSPatch 集成模式下不可靠（world-readable 文件不可见）
 *   - makeWorldReadable() 在 API24+ 抛 SecurityException
 *
 * ★ 修复后：仅走 ConfigClient（ContentProvider）
 */
object HookConfigReader {

    /**
     * 读取配置 —— 仅走 ContentProvider
     * @param context 宿主进程 context
     */
    fun read(context: Context): GameConfig {
        return ConfigClient.read(context)
    }

    /** 仅读总开关（高频调用优化） */
    fun isMasterOn(context: Context): Boolean {
        return ConfigClient.isMasterOn(context)
    }
}`,
  },
  {
    id: "manifest",
    name: "AndroidManifest.xml",
    path: "app/src/main/AndroidManifest.xml",
    lang: "xml",
    desc: "清单文件 · Provider 加 permission + 去除 UTF-8 BOM",
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- 悬浮球 -->
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_SPECIAL_USE" />
    <uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <!-- ★ 自定义签名级权限，保护 ConfigProvider 不被任意 APP 读取 -->
    <permission
        android:name="com.gameunlocker.noroot.permission.CONFIG_READ"
        android:protectionLevel="signature" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/Theme.GameUnlocker">

        <!-- Xposed 模块元数据 -->
        <meta-data android:name="xposedmodule" android:value="true" />
        <meta-data android:name="xposedminversion" android:value="82" />
        <meta-data android:name="xposedscope" android:resource="@array/xposed_scope" />

        <!-- ★ ConfigProvider：exported + 自定义 permission -->
        <provider
            android:name=".core.ConfigProvider"
            android:authorities="\${applicationId}.configprovider"
            android:exported="true"
            android:grantUriPermissions="true"
            android:readPermission="com.gameunlocker.noroot.permission.CONFIG_READ" />

        <!-- Launcher 主界面 -->
        <activity
            android:name=".ui.MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- 悬浮球点击后的毛玻璃面板 -->
        <activity
            android:name=".activities.PanelActivity"
            android:exported="false"
            android:theme="@style/Theme.Panel.Transparent" />

        <!-- 悬浮球前台服务 -->
        <service
            android:name=".services.FloatingBallService"
            android:exported="false"
            android:foregroundServiceType="specialUse">
            <property
                android:name="android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE"
                android:value="floating_ball_for_module_control" />
        </service>

        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="\${applicationId}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>
    </application>
</manifest>`,
  },
  {
    id: "build-gradle",
    name: "build.gradle.kts (app)",
    path: "app/build.gradle.kts",
    lang: "kotlin",
    desc: "Gradle 构建配置 · 修复签名凭据 env 默认值与 keystore 匹配",
    code: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.gameunlocker.noroot"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.gameunlocker.noroot"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }

    // ★ 修复 Bug 16：签名配置 env 默认值与实际 keystore 匹配
    signingConfigs {
        create("release") {
            // CI 优先用环境变量；本地用默认值（对应已提交的 mjh-release.jks）
            storeFile = file(System.getenv("MJH_STORE_FILE") ?: "../keystore/mjh-release.jks")
            storePassword = System.getenv("MJH_STORE_PASSWORD") ?: "meng411722"
            keyAlias = System.getenv("MJH_KEY_ALIAS") ?: "mjh"
            keyPassword = System.getenv("MJH_KEY_PASSWORD") ?: "meng411722"
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("release")
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
    buildFeatures { compose = true }
    composeOptions { kotlinCompilerExtensionVersion = "1.5.4" }
    packaging {
        resources.excludes += "/META-INF/{AL2.0,LGPL2.1}"
    }
}

dependencies {
    // Xposed API — compileOnly，运行时由框架提供
    compileOnly("de.robv.android.xposed:api:82")

    // Shizuku — 免 Root 系统操作
    compileOnly("dev.rikka.shizuku:api:13.1.5")
    compileOnly("dev.rikka.shizuku:provider:13.1.5")

    // AndroidX + Compose + Material3
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.6.2")
    implementation("androidx.activity:activity-compose:1.8.0")
    implementation(platform("androidx.compose:compose-bom:2023.10.01"))
    implementation("androidx.compose.material3:material3:1.1.2")
    implementation("androidx.navigation:navigation-compose:2.7.4")

    // JSON 序列化
    implementation("com.google.code.gson:gson:2.10.1")
}`,
  },
  {
    id: "build-yml",
    name: "build.yml",
    path: ".github/workflows/build.yml",
    lang: "yaml",
    desc: "GitHub Actions · 修复签名 env 指向 CI 生成的 debug.jks",
    code: `name: Build LSPatch NoRoot Modules

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        module:
          - AdBlockerX_NoRoot
          - PrivacyGuard_NoRoot
          - GameUnlockerPro_NoRoot
          - BatteryOptimizer_NoRoot
          - MicroXEnhancer
          - VipUnlocker_NoRoot
          - VideoSaver_NoRoot
          - StepModifier_NoRoot
          - AudioBoost_NoRoot
          - NotifyMaster_NoRoot
          - ShizukuSceneFix

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v3

      - name: Generate Debug Keystore
        run: |
          mkdir -p modules/keystore
          keytool -genkeypair -v \\
            -keystore modules/keystore/debug.jks \\
            -storepass debug123 -keypass debug123 \\
            -alias debug -keyalg RSA -keysize 2048 -validity 10000 \\
            -dname "CN=Debug, OU=Debug, O=Debug, L=Debug, ST=Debug, C=CN"

      - name: Generate Gradle Wrapper
        run: |
          cd modules/\${{ matrix.module }}
          gradle wrapper --gradle-version 8.2 --distribution-type bin

      # ★ 修复 Bug 16：显式设置 MJH_STORE_FILE 指向 CI 生成的 debug.jks
      #   并让 password/alias 全部匹配 debug.jks
      - name: Build Release APK
        working-directory: modules/\${{ matrix.module }}
        env:
          MJH_STORE_FILE: \${{ github.workspace }}/modules/keystore/debug.jks
          MJH_STORE_PASSWORD: debug123
          MJH_KEY_ALIAS: debug
          MJH_KEY_PASSWORD: debug123
        run: ./gradlew :app:assembleRelease --no-daemon --stacktrace

      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: \${{ matrix.module }}-release
          path: modules/\${{ matrix.module }}/app/build/outputs/apk/release/*.apk
          retention-days: 30

  release:
    needs: build
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Download all artifacts
        uses: actions/download-artifact@v4
        with:
          path: artifacts
      - name: Release
        uses: softprops/action-gh-release@v1
        with:
          tag_name: v\${{ github.run_number }}
          files: artifacts/**/*.apk`,
  },
];

/* ============ 6 项检查清单 ============ */

export interface ChecklistItem {
  id: number;
  rule: string;
  check: string;
  how: string;
}

export const CHECKLIST: ChecklistItem[] = [
  {
    id: 1,
    rule: "铁律 1",
    check: "XposedLoader.kt 不含任何 import xxx.hooks.* 语句",
    how: "grep -n 'import.*hooks' XposedLoader.kt → 必须无输出；Hook 调用全部改为 Class.forName() 反射",
  },
  {
    id: 2,
    rule: "铁律 2",
    check: "所有 Hook 内目标类用 Class.forName() 加载，禁止 import 第三方 SDK",
    how: "每个 hooks/*.kt 文件中搜索 import com.unity3d / import com.tencent 等 → 必须无；目标类一律 Class.forName(name) + try-catch ClassNotFoundException",
  },
  {
    id: 3,
    rule: "铁律 3",
    check: "handleLoadPackage 内有 if (lpparam.packageName == OWN_PKG) return 双分支",
    how: "在 handleLoadPackage 第一行检查：自身包名 → return（走 UI）；否则 → 走 Hook 注入。防止 Hook 注入自身进程导致 ANR",
  },
  {
    id: 4,
    rule: "IPC",
    check: "跨进程配置仅走 ContentProvider，无 MODE_WORLD_READABLE / XSharedPreferences",
    how: "ConfigManager 用 MODE_PRIVATE；HookConfigReader 仅调 ConfigClient（ContentResolver.query）；删除所有 makeWorldReadable() 调用",
  },
  {
    id: 5,
    rule: "Manifest",
    check: "ConfigProvider exported=true + authorities=\${applicationId}.configprovider + 自定义 permission",
    how: "AndroidManifest 中 <provider> 三要素齐全；prefs 名在 ConfigManager 与 ConfigProvider 中完全一致（踩坑记录 #13）",
  },
  {
    id: 6,
    rule: "CI",
    check: "build.yml 中 MJH_STORE_FILE 指向 CI 生成的 keystore，密码/alias 与之匹配",
    how: "Build 步骤 env 中四项（STORE_FILE/STORE_PASSWORD/KEY_ALIAS/KEY_PASSWORD）全部指向 debug.jks + debug123/debug；或全部删掉让 build.gradle.kts 用默认 mjh-release.jks + meng411722/mjh",
  },
];

/* ============ 6 条踩坑记录 (11-16) ============ */

export interface BugRecord {
  id: number;
  title: string;
  severity: "critical" | "high" | "medium";
  symptom: string;
  cause: string;
  fix: string;
  code?: string;
}

export const BUG_RECORDS: BugRecord[] = [
  {
    id: 11,
    title: "XposedLoader import hooks 导致集成模式启动秒崩",
    severity: "critical",
    symptom:
      "LSPatch 集成模式 patch 后，目标 APP 启动即闪退。logcat 显示 ClassNotFoundError: com.gameunlocker.noroot.hooks.FrameRateUnlockHook，且崩溃发生在 handleLoadPackage 之前",
    cause:
      "XposedLoader.kt 第 5 行 `import com.gameunlocker.noroot.hooks.*` 通配 import。JVM 加载 XposedLoader 类时立即解析 import 语句，被迫提前加载 10 个 Hook object。集成模式下 LSPatch runtime 尚未完成类注入，Hook 类引用的依赖不存在 → NoClassDefFoundError 在类初始化阶段触发，根本到不了 handleLoadPackage",
    fix: "删除所有 `import xxx.hooks.*`，将 10 个 Hook 调用改为 Class.forName(hookClassName).getDeclaredMethod(\"apply\", ...).invoke(null, lpparam, cfg) 反射加载。类加载被推迟到 handleLoadPackage 内部，且每个 Hook 独立 try-catch",
    code: `// ❌ 修复前
import com.gameunlocker.noroot.hooks.FrameRateUnlockHook
FrameRateUnlockHook.apply(lpparam, cfg)

// ✅ 修复后
val clazz = Class.forName("com.gameunlocker.noroot.hooks.FrameRateUnlockHook")
clazz.getDeclaredMethod("apply", LoadPackageParam::class.java, GameConfig::class.java)
    .invoke(null, lpparam, cfg)`,
  },
  {
    id: 12,
    title: "SharedPreferences MODE_WORLD_READABLE 跨进程读返回空",
    severity: "high",
    symptom:
      "Hook 进程通过 XSharedPreferences 读取总开关，始终返回 false（默认值），即使 UI 侧已开启。模块表现为「开了总开关但 Hook 不生效」",
    cause:
      "ConfigManager.kt 第 31 行 `getSharedPreferences(PREFS_NAME, MODE_WORLD_READABLE)`。Android 7.0 (API24+) 起 MODE_WORLD_READABLE 抛 SecurityException，catch 回退 MODE_PRIVATE 后文件权限 0600，宿主进程（不同 UID）无法读取。LSPatch 集成模式下 XSharedPreferences 也依赖 world-readable 文件可见性，同样失效",
    fix: "ConfigManager 改用 MODE_PRIVATE（仅自身进程读写）。跨进程读全部走 ContentProvider：ConfigProvider 在 UI 进程读 SharedPreferences → 通过 Cursor 返回给 Hook 进程；Hook 侧用 ConfigClient.query() 查询。删除 HookConfigReader 中的 XSharedPreferences 路径",
    code: `// ❌ 修复前
val prefs = context.getSharedPreferences(PREFS_NAME, MODE_WORLD_READABLE)

// ✅ 修复后
val prefs = context.getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
// 跨进程读由 ConfigProvider 暴露`,
  },
  {
    id: 13,
    title: "ConfigProvider 与 ConfigManager 的 prefs 名不一致导致永远返回空",
    severity: "high",
    symptom:
      "ConfigProvider.query() 返回的 Cursor 永远为空，Hook 侧读到的配置全是默认值。但 ContentProvider 本身能 query 成功（不报错），极难排查",
    cause:
      "ConfigProvider.kt 第 18 行读 `getSharedPreferences(\"gameunlocker_prefs\", ...)`，ConfigManager.kt 第 21 行写 `getSharedPreferences(\"game_unlocker_prefs\", ...)`——少了一个下划线！两个不同的 SharedPreferences 文件，Provider 读的文件里永远没有 UI 写入的数据",
    fix: "统一 prefs 名为 `game_unlocker_prefs`（或任意一致的名字）。建议在 ConfigManager companion object 中定义常量 PREFS_NAME，ConfigProvider 引用同一常量，从根源杜绝拼写不一致",
    code: `// ❌ 修复前 —— 两个文件名不一致
// ConfigManager.kt
private const val PREFS_NAME = "game_unlocker_prefs"
// ConfigProvider.kt
val prefs = context.getSharedPreferences("gameunlocker_prefs", MODE_PRIVATE)
//                                         ↑ 少了下划线！

// ✅ 修复后 —— 引用同一常量
// ConfigManager.kt
companion object { const val PREFS_NAME = "game_unlocker_prefs" }
// ConfigProvider.kt
val prefs = context.getSharedPreferences(ConfigManager.PREFS_NAME, MODE_PRIVATE)`,
  },
  {
    id: 14,
    title: "Hook 使用 String + classLoader 在集成模式下找不到第三方类",
    severity: "high",
    symptom:
      "XposedHelpers.findAndHookMethod(\"com.unity3d.player.UnityPlayer\", lpparam.classLoader, ...) 抛出 ClassNotFoundError。但同一 Hook 在 LSPosed Root 模式下正常",
    cause:
      "集成模式下 lpparam.classLoader 是宿主 APP 的 PathClassLoader。第三方 SDK（Unity、微信 SDK 等）可能由宿主的 DexClassLoader 或委托 ClassLoader 加载，PathClassLoader.findClass() 找不到。而 LSPosed Root 模式下 XposedBridge 会用更全面的类查找策略",
    fix: "改用 Class.forName(className) 显式加载（它会触发 ClassLoader 委派链完整查找）。若仍找不到，遍历多个 ClassLoader：尝试 lpparam.classLoader、Thread.currentThread().contextClassLoader、ClassLoader.getSystemClassLoader()。找到 Class 对象后传给 findAndHookMethod(Class, methodName, ...) 重载",
    code: `// ❌ 修复前
XposedHelpers.findAndHookMethod(
    "com.unity3d.player.UnityPlayer",
    lpparam.classLoader,  // ← 集成模式可能找不到
    "setTargetFrameRate", Int::class.java, callback
)

// ✅ 修复后
val unityClass = Class.forName("com.unity3d.player.UnityPlayer")
XposedHelpers.findAndHookMethod(
    unityClass,  // ← 传 Class 对象
    "setTargetFrameRate", Int::class.java, callback
)`,
  },
  {
    id: 15,
    title: "handleLoadPackage 未做进程分支，自身进程被注入 Hook 导致 UI ANR",
    severity: "medium",
    symptom:
      "模块自身的 MainActivity 打开后严重卡顿、ANR 弹窗。日志显示 Hook 被注入到模块自身进程，FrameRateUnlockHook 把模块自己的 UI 帧率也改了，甚至 Hook 自身 Hook 造成无限递归",
    cause:
      "handleLoadPackage 未判断 lpparam.packageName。LSPatch 会把模块注入到两个进程：模块自身进程（用户从桌面点开模块 APK）和宿主 APP 进程。如果不做分支，Hook 会对自身进程也生效，UI 进程被 Hook 拦截后性能骤降",
    fix: "在 handleLoadPackage 第一行添加 `if (lpparam.packageName == OWN_PKG) return`。自身进程仅做 UI（由 MainActivity 自行启动），不注入任何 Hook。宿主进程才走 Hook 注入逻辑",
    code: `// ❌ 修复前
override fun handleLoadPackage(lpparam: LoadPackageParam) {
    // 无分支，所有进程都注入 Hook
    applyHooks(lpparam, cfg)
}

// ✅ 修复后
override fun handleLoadPackage(lpparam: LoadPackageParam) {
    if (lpparam.packageName == OWN_PKG) return  // 自身进程走 UI
    applyHooks(lpparam, cfg)                     // 宿主进程走 Hook
}`,
  },
  {
    id: 16,
    title: "GitHub Actions 签名凭据不匹配导致 assembleRelease 失败",
    severity: "critical",
    symptom:
      "CI 构建 step 8 `./gradlew :app:assembleRelease` 报错 exit code 1。错误信息类似 'Keystore tampered' 或 'No key with alias debug in keystore'。11 个模块全部在同一 step 失败",
    cause:
      "build.yml 的 Build 步骤 env 设置 MJH_STORE_PASSWORD=debug123、MJH_KEY_ALIAS=debug、MJH_KEY_PASSWORD=debug123（通过 secrets.X || 'debug123' fallback），但 MJH_STORE_FILE 未设置 → build.gradle.kts 用默认值 ../keystore/mjh-release.jks（已提交到仓库，密码是 meng411722/mjh）。用 debug123/debug 密码去解 mjh-release.jks → 密码不匹配 → 签名失败。CI 前置步骤生成的 debug.jks 从未被引用，是孤儿文件",
    fix: "方案 A（推荐）：build.yml env 显式设置 MJH_STORE_FILE 指向 CI 生成的 debug.jks，四项凭据全部用 debug123/debug。方案 B：删除 build.yml 的三个 env 覆盖，让 build.gradle.kts 用默认 meng411722/mjh 匹配已提交的 mjh-release.jks（但暴露了真实签名密码到仓库）",
    code: `# ❌ 修复前 —— STORE_FILE 未设，用默认 mjh-release.jks，但密码用 debug123
- name: Build Release APK
  env:
    MJH_STORE_PASSWORD: debug123   # ← 与 mjh-release.jks 不匹配
    MJH_KEY_ALIAS: debug           # ← mjh-release.jks 里没有 debug alias
    MJH_KEY_PASSWORD: debug123
  run: ./gradlew :app:assembleRelease

# ✅ 修复后 —— 四项全指向 CI 生成的 debug.jks
- name: Build Release APK
  env:
    MJH_STORE_FILE: \${{ github.workspace }}/modules/keystore/debug.jks
    MJH_STORE_PASSWORD: debug123
    MJH_KEY_ALIAS: debug
    MJH_KEY_PASSWORD: debug123
  run: ./gradlew :app:assembleRelease`,
  },
];
