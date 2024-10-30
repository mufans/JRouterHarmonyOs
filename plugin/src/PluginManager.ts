import { hvigor, HvigorNode } from "@ohos/hvigor";
import { ModulePluginHandler } from "./ModulePluginHandler";
import { Logger } from "./common/Logger";
import { PluginConfig, readPluginConfig } from './PluginConfig';
import { Constant } from "./common/Constant";
import { OhosHapContext, OhosHarContext, OhosHspContext, OhosPluginId } from '@ohos/hvigor-ohos-plugin';
import { RoutePluginProvider, RouteMapProcessor } from "./RouteProcessor";

// 插件管理类
export class PluginManager implements RoutePluginProvider {

    private static mInstance: PluginManager | undefined;

    private readonly mProcessor = new RouteMapProcessor(this);

    private mPluginCache = new Set<ModulePluginHandler>();

    private mHapHandler = new Set<ModulePluginHandler>();

    private mHspHandler = new Set<ModulePluginHandler>();

    private mHarHandler = new Set<ModulePluginHandler>();

    private mFinishedHandler = new Set<ModulePluginHandler>();

    private mProcessCount = 0; // 任务计数


    constructor() {
        hvigor.nodesEvaluated((arg) => {
            const harMoudleNames: string[] = [];
            this.mHarHandler.forEach((handler) => {
                harMoudleNames.push(handler.getModuleName());
            });

            // 配置模块
            this.mHapHandler.forEach((handler) => {
                handler.configModules(harMoudleNames);
            });

            this.mPluginCache.forEach((handler) => {
                handler.apply();
            });
            this.mProcessCount = this.mPluginCache.size;
        });
        hvigor.buildFinished(() => {
            // 构建完成重置插件
            PluginManager.mInstance = undefined;
        })
    }


    getHap(): Set<ModulePluginHandler> {
        return this.mHapHandler;
    }

    getHsp(): Set<ModulePluginHandler> {
        return this.mHspHandler;
    }

    getHar(): Set<ModulePluginHandler> {
        return this.mHarHandler;
    }


    public static getInstance() {
        if (!this.mInstance) {
            this.mInstance = new PluginManager();
        }
        return this.mInstance;
    }





    /**
     * 注册插件
     * 
     * @param pluginId 
     * @param handler 
     */
    private register(pluginId: string, handler: ModulePluginHandler) {
        this.mPluginCache.add(handler);
        if (pluginId == Constant.HAP_PLUGIN_ID) {
            this.mHapHandler.add(handler);
        } else if (pluginId == Constant.HAR_PLUGIN_ID) {
            this.mHarHandler.add(handler);
        } else {
            this.mHspHandler.add(handler);
        }
    }

    private notifyTaskFinished(handler: ModulePluginHandler, disabled: boolean = false) {
        this.mProcessCount--;
        this.mFinishedHandler.add(handler);
        // 判断任务全部完成
        if (this.mProcessCount == 0) {
            this.mProcessor.process();
        }
    }

    /**
     * 获取oh插件id
     * @param pluginId 
     * @returns 
     */
    public static getOhPluginId(pluginId: string): string {
        if (pluginId == Constant.HAP_PLUGIN_ID) {
            return OhosPluginId.OHOS_HAP_PLUGIN
        } else if (pluginId == Constant.HSP_PLUGIN_ID) {
            return OhosPluginId.OHOS_HSP_PLUGIN
        } else {
            return OhosPluginId.OHOS_HAR_PLUGIN
        }
    }


    /**
     * 注册模块插件
     * @param pluginId 
     * @param node 
     */
    public static registerModulePlugin(pluginId: string, node: HvigorNode) {
        const nodeName = node.getNodeName();
        const config: PluginConfig = readPluginConfig(node.getNodeDir().getPath());
        Logger.info(`[${nodeName}] read config result:${JSON.stringify(config)}`);

        if (!config.disablePlugin) {
            const id = PluginManager.getOhPluginId(pluginId);
            const context = node.getContext(id);
            Logger.info(`reigister plugin of module [${nodeName}]`);
            PluginManager.getInstance().register(pluginId, new ModulePluginHandler(id, node, context, config));
        } else {
            Logger.info(`[${nodeName}] plugin has bean disabled`)
        }
    }

    /**
     * 通知任务完成
     * @param handler 
     * @param disabled 
     */
    public static notifyTaskFinished(handler: ModulePluginHandler, disabled: boolean = false) {
        PluginManager.getInstance().notifyTaskFinished(handler, disabled);
    }
}