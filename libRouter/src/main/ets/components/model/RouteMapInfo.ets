// 路由表信息
export interface RouteMapInfo{
  moduleName: string, // 模块名称
  srcPath: string, // 路由表位置
  routes: RouteInfo[] // 路由信息
}

export interface RouteInfo {
  annotation: string,
  name: string,
  path: string,
  srcPath: string
}

export interface RouteMapSet{
  routeMap:RouteMapInfo[] // 路由表集合
}