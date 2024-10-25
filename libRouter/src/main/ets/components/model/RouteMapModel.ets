import { RouteMapInfo, RouteMapSet } from './RouteMapInfo';

// 路由表模型
export class RouteMapModel {
  private mRouteMapInfo: RouteMapInfo[];

  constructor(routeMapInfo: RouteMapInfo[]) {
    this.mRouteMapInfo = routeMapInfo;
  }


  public async importRouteMap(path: string): Promise<object | undefined> {
    const routeMapInfo = this.mRouteMapInfo.find((map) => map.routes.some((route) => route.path === path));
    if (routeMapInfo) {
      return import(routeMapInfo.srcPath.split(".ets")[0]);
    }
    return undefined;
  }

  public findRouteMapByName(name: string): RouteMapInfo | undefined {
    return this.mRouteMapInfo.find((map) => map.moduleName == name)
  }

  static create(set: RouteMapSet) {
    return new RouteMapModel(set.routeMap);
  }
}

