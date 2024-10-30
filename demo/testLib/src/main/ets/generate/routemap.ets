/**
 * GENERATED CODE - DO NOT MODIFY
 **************************************************************************
 * JRouter
 **************************************************************************
 */

import { IRouteMap, JRouteType, RouterWrapper } from '@mufans/jrouter'
import lazy { TestService } from '../components/TestService'

export const routeMap: IRouteMap = {
  name: 'testLib',
  createRoute: (): void => {
        RouterWrapper.register({
          srcPath: 'testLib/src/main/ets/components/TestPage',
          type: JRouteType.PAGE,
          path: 'test_page',
          interceptors: []
        })
              RouterWrapper.register({
          srcPath: 'testLib/src/main/ets/components/TestPage2',
          type: JRouteType.PAGE,
          path: 'test_page2',
          interceptors: ["SpecialInterceptor"]
        })
              RouterWrapper.register({
          srcPath: 'testLib/src/main/ets/components/TestService',
          type: JRouteType.PROVIDER,
          path: 'TestService',
          singleton: false,
          factory:()=>{
            return new TestService();
          }
        }) 
  }
}

// 注册路由表
if (!RouterWrapper.hasGroup('testLib')) {
  RouterWrapper.registerRouteMap(routeMap);
}