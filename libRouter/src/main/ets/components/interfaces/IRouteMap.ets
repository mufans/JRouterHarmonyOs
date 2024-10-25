export interface IRouteMap {
  name:string, // 路由表分组名称
  createRoute: () => void // 创建路由表
}