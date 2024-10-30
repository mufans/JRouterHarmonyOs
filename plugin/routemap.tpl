/**
 * GENERATED CODE - DO NOT MODIFY
 **************************************************************************
 * JRouter
 **************************************************************************
 */

import { IRouteMap, JRouteType, RouterWrapper } from '@mufans/jrouter'
{{#routeImport}}
import lazy { {{name}} } from '{{srcPath}}'
{{/routeImport}}
{{#entryImport}}
import('{{srcPath}}')
{{/entryImport}}

export const routeMap: IRouteMap = {
  name: '{{routeMapName}}',
  createRoute: (): void => {
    {{#each route}}
      {{#if (eq this.type "INTERCEPTOR")}}
        RouterWrapper.registerInterceptor({
          srcPath: '{{this.srcPath}}',
          path: '{{this.path}}',
          priority: {{this.priority}},
          global: {{showValue this.global}},
          factory:()=>{
            return new {{this.factory}}();
          } 
        })
      {{else if (eq this.type "PROVIDER")}}
        RouterWrapper.register({
          srcPath: '{{this.srcPath}}',
          type: JRouteType.{{this.type}},
          path: '{{this.path}}',
          singleton: {{showValue this.singleton}},
          factory:()=>{
            return new {{this.factory}}();
          }
        }) 
      {{else}}
        RouterWrapper.register({
          srcPath: '{{this.srcPath}}',
          type: JRouteType.{{this.type}},
          path: '{{this.path}}',
          interceptors: {{{this.interceptors}}}
        })
      {{/if}}
    {{/each}}
  }
}

// 注册路由表
if (!RouterWrapper.hasGroup('{{routeMapName}}')) {
  RouterWrapper.registerRouteMap(routeMap);
}