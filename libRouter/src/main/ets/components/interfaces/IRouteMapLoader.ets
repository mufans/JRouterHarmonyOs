import { RouteMapModel } from '../model/RouteMapModel'

// 路由表加载
export interface IRouteMapLoader{
  load():Promise<RouteMapModel>
}