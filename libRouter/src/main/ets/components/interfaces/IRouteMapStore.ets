import { RouteMapModel } from '../model/RouteMapModel'
import { Context } from '@kit.AbilityKit'

export interface IRouteMapStore {

  getRouteMap(): RouteMapModel | undefined

  getRouteMapAsync(): Promise<RouteMapModel>
}