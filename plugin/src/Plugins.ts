import { HvigorNode, HvigorPlugin } from '@ohos/hvigor'
import { PluginConfig, readPluginConfig } from './PluginConfig';
import { ModulePluginHandler } from './ModulePluginHandler';
import { PluginManager } from './PluginManager';
import { Logger } from './common/Logger'
import { Constant } from './common/Constant';


export function harPlugin(): HvigorPlugin {
    return {
        pluginId: Constant.HAR_PLUGIN_ID,
        apply(node: HvigorNode) {
            PluginManager.registerModulePlugin(Constant.HAR_PLUGIN_ID, node);
        }
    }
}

export function hspPlugin(): HvigorPlugin {
    return {
        pluginId: Constant.HSP_PLUGIN_ID,
        apply(node: HvigorNode) {
            PluginManager.registerModulePlugin(Constant.HSP_PLUGIN_ID, node);
        }
    }
}
export function hapPlugin(): HvigorPlugin {
    return {
        pluginId: Constant.HAP_PLUGIN_ID,
        apply(node: HvigorNode) {
            PluginManager.registerModulePlugin(Constant.HAP_PLUGIN_ID, node);
        }
    }
}
