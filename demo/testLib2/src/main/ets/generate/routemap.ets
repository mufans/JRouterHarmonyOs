/**
 * GENERATED CODE - DO NOT MODIFY
 **************************************************************************
 * JRouter
 **************************************************************************
 */

import { IRouteMap, JRouteType, RouterWrapper } from '@mufans/jrouter'

export const routeMap: IRouteMap = {
  name: 'testLib2',
  createRoute: (): void => {
        RouterWrapper.register({
          srcPath: 'testLib2/src/main/ets/components/TestPage3',
          type: JRouteType.PAGE,
          path: 'test_page3',
          interceptors: []
        })
        }
}

// 注册路由表
if (!RouterWrapper.hasGroup('testLib2')) {
  RouterWrapper.registerRouteMap(routeMap);
}