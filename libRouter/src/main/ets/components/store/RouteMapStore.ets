import { IRouteMapStore } from '../interfaces/IRouteMapStore';
import { Context } from '@ohos.arkui.UIContext';
import { IRouteMapLoader } from '../interfaces/IRouteMapLoader';
import { RouteMapLoader } from './RouteMapLoader';
import { RouteMapModel } from '../model/RouteMapModel';

// 处理路由表存储
export class RouteMapStore implements IRouteMapStore {
  private mContext: Context;
  private mLoader: IRouteMapLoader;
  private mRouteMapModel: RouteMapModel | undefined;

  constructor(context: Context) {
    this.mContext = context;
    this.mLoader = new RouteMapLoader(context);
  }

  getRouteMap(): RouteMapModel | undefined {
    return this.mRouteMapModel;
  }

  async getRouteMapAsync(): Promise<RouteMapModel> {
    if (this.mRouteMapModel != null) {
      return this.mRouteMapModel;
    }
    return this.mLoader.load();
  }
}