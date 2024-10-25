import { ModuleJson } from '../options/configure/module-json-options.js';
import ModuleObj = ModuleJson.ModuleObj;
declare class ModuleOptionPathInfo {
    private moduleOptPathMap;
    initModuleOptPathMap(moduleJson5Path: string): void;
    setModuleOptPathMap(moduleJson5Path: string, moduleOpt: ModuleObj, srcPath: string): void;
    getModuleOptPath(moduleJson5Path: string, optName: string): string;
}
export declare const moduleOptionPathInfo: ModuleOptionPathInfo;
export {};
