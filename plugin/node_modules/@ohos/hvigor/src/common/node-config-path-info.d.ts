import { ProjectImpl } from '../base/internal/lifecycle/hvigor-node-impl/project-impl.js';
/**
 * 记录模块配置的来源
 * 目前模块可以从 build-profile 里面配置 和 hvigorconfig 文件里动态配置
 */
declare class NodeConfigPathInfo {
    private nodeConfigPath;
    private excludeNodes;
    private buildProfilePath;
    private isModuleChanged;
    addModuleConfigPath(moduleName: string, rootDir: string): void;
    deleteModuleConfigPath(moduleName: string): void;
    initNodeConfigPath(project: ProjectImpl): void;
    getNodeConfigPathByName(nodeName: string): string;
    checkExcludeNode(nodeName: string): boolean;
    getIsModuleChanged(): boolean;
}
export declare const nodeConfigPathInfo: NodeConfigPathInfo;
export {};
