import exp from "constants";
import { ModulePluginHandler } from "./ModulePluginHandler";
import { RouteInfo } from "./Analyzer";

// 路由表处理
export class RouteMapProcessor {

    private mProvider: RoutePluginProvider;

    private mRouteMap: RouteMap[] = [];

    constructor(provider: RoutePluginProvider) {
        this.mProvider = provider;
    }

    // 处理路由表
    public process(): void {
        this.mRouteMap = [];
        // 收集路由表
        this.mProvider.getHar().forEach((har) => {
            const routeInfo = har.getRouteInfo();
            if (routeInfo.length > 0) {
                const routeMap = har.getRouteMap();
                if (routeMap.routes.length > 0) {
                    this.mRouteMap.push(routeMap);
                }
            }
        });
        // 合并路由表写入json
        this.mProvider.getHap().forEach((hap) => {
            hap.writeRouteMapJson(this.mRouteMap);
        })
    }
}

interface RouteMapSet {
    routeMap: RouteMap[] // 路由表集合
}

export interface RouteMap {
    moduleName: string, // 模块名称
    srcPath: string, // 路由表位置
    routes: RouteInfo[] // 路由信息
}

export interface RoutePluginProvider {

    getHap(): Set<ModulePluginHandler>

    getHsp(): Set<ModulePluginHandler>

    getHar(): Set<ModulePluginHandler>
}