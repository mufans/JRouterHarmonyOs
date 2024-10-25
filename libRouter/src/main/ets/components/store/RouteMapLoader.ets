import { IRouteMapLoader } from '../interfaces/IRouteMapLoader';
import { RouteMapModel } from '../model/RouteMapModel';
import { Context } from '@kit.AbilityKit';
import { Constant } from '../common/Constant';
import { util } from '@kit.ArkTS';
import { RouteMapSet } from '../model/RouteMapInfo';

// 路由表加载
export class RouteMapLoader implements IRouteMapLoader {
  private mContext: Context;

  constructor(context: Context) {
    this.mContext = context;
  }

  load(): Promise<RouteMapModel> {
    return new Promise((resolve, reject) => {
      this.mContext.resourceManager.getRawFileContent(Constant.ROUTE_MAP_JSON, (_, data) => {
        let decoder = util.TextDecoder.create();
        let routerMapJsonStr = decoder.decodeWithStream(data);
        let routeMapSet: RouteMapSet = JSON.parse(routerMapJsonStr);
        resolve(RouteMapModel.create(routeMapSet));
      })
    })
  }
}