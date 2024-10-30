/**
 * GENERATED CODE - DO NOT MODIFY
 **************************************************************************
 * JRouter
 **************************************************************************
 */

import { IRouteMap, JRouteType, RouterWrapper } from '@mufans/jrouter'
import lazy { GlobalInterceptor } from '../pages/GlobalInterceptor'
import lazy { SpecialInterceptor } from '../pages/SpecialInterceptor'
import lazy { TestService2Impl } from '../pages/TestService2Impl'
import('../pages/EntryPage2')
import('../pages/Index')

export const routeMap: IRouteMap = {
  name: 'entry',
  createRoute: (): void => {
        RouterWrapper.register({
          srcPath: 'entry/src/main/ets/pages/EntryPage2',
          type: JRouteType.PAGE,
          path: 'entry_page2',
          interceptors: []
        })
              RouterWrapper.registerInterceptor({
          srcPath: 'entry/src/main/ets/pages/GlobalInterceptor',
          path: 'GlobalInterceptor',
          priority: 0,
          global: true,
          factory:()=>{
            return new GlobalInterceptor();
          } 
        })
        RouterWrapper.register({
          srcPath: 'entry/src/main/ets/pages/Index',
          type: JRouteType.PAGE,
          path: 'entry_page',
          interceptors: []
        })
              RouterWrapper.registerInterceptor({
          srcPath: 'entry/src/main/ets/pages/SpecialInterceptor',
          path: 'SpecialInterceptor',
          priority: 100,
          global: false,
          factory:()=>{
            return new SpecialInterceptor();
          } 
        })
        RouterWrapper.register({
          srcPath: 'entry/src/main/ets/pages/TestService2Impl',
          type: JRouteType.PROVIDER,
          path: 'TestService2',
          singleton: true,
          factory:()=>{
            return new TestService2Impl();
          }
        }) 
  }
}

// 注册路由表
if (!RouterWrapper.hasGroup('entry')) {
  RouterWrapper.registerRouteMap(routeMap);
}