import { IRouteInterface } from './IRouteInterface';
import { NamedRouterOptions } from './NameRouterOptions';

// 拦截器
export interface IInterceptor extends IRouteInterface {

  // 拦截路由
  intercept(options: NamedRouterOptions): Promise<InterceptorResult>

}

export interface InterceptorResult{
  terminal?:boolean, // 是否终止后续操作
  options:NamedRouterOptions // 参数
}