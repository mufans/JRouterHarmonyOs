import { IInterceptor, InterceptorResult } from '../interfaces/IInterceptor';
import { NamedRouterOptions } from '../interfaces/NameRouterOptions';
import { JRouteInfo, JRouteInterceptorInfo } from '../JRouteInfo';
import { SerialInterceptorHandler } from './SerialInterceptorHandler';

/**
 * 拦截器处理
 */
export class JRouteInterceptorHandler implements IInterceptor {
  // 全局拦截器
  private readonly globalInterceptors: IInterceptor[] = [];
  // 指定拦截器
  private readonly specializedInterceptors: Map<string, IInterceptor> = new Map();
  // 优先级记录
  private readonly priority: Map<IInterceptor, number> = new Map();
  // 全局拦截器
  private readonly globalInterceptorInfos: JRouteInterceptorInfo[] = [];
  // 指定拦截器
  private readonly specializedInterceptorInfos: Map<string, JRouteInterceptorInfo> = new Map();
  // 已加载的拦截器
  private readonly loadedPath: string[] = [];
  // 拦截器信息
  private readonly pathInterceptors:Map<string,string[]> = new Map();

  intercept(options: NamedRouterOptions): Promise<InterceptorResult> {
    const interceptors: IInterceptor[] = [...this.globalInterceptors];
    const specialInterceptors = this.pathInterceptors.get(options.name);
    if (specialInterceptors) {
      specialInterceptors?.forEach((path) => {
        const interceptor = this.specializedInterceptors.get(path);
        if (interceptor) {
          interceptors.push(interceptor);
        }
      });
    }
    // 按照优先级顺序执行
    return new SerialInterceptorHandler(this.sortInterceptors(interceptors)).intercept(options);
  }

  // 优先级排序
  private sortInterceptors(interceptors: IInterceptor[]) {
    return interceptors.sort((a, b) => {
      return this.getPriority(a) - this.getPriority(b);
    });
  }

  // 获取优先级
  private getPriority(interceptor: IInterceptor) {
    return this.priority.get(interceptor) ?? 0
  }

  // 添加全局拦截器
  public addGlobal(interceptor: IInterceptor, priority: number = 0) {
    this.globalInterceptors.push(interceptor);
    this.priority.set(interceptor, priority);
  }

  // 添加指定拦截器
  public addSpecialized(path: string, interceptor: IInterceptor, priority: number = 0) {
    this.specializedInterceptors.set(path, interceptor);
    this.priority.set(interceptor, priority);
  }

  // 添加拦截器实例
  public addInterceptor(interceptorInfo: JRouteInterceptorInfo, interceptor: IInterceptor) {
    // 避免重复添加
    if (this.loadedPath.includes(interceptorInfo.path)) {
      return;
    }
    this.loadedPath.push(interceptorInfo.path);
    if (interceptorInfo.global) {
      this.addGlobal(interceptor, interceptorInfo.priority);
    } else {
      this.addSpecialized(interceptorInfo.path, interceptor, interceptorInfo.priority);
    }
  }

  // 添加路由拦截器
  public addInterceptorInfo(interceptorInfo: JRouteInterceptorInfo) {
    if (interceptorInfo.global) {
      this.globalInterceptorInfos.push(interceptorInfo);
    } else {
      this.specializedInterceptorInfos.set(interceptorInfo.path, interceptorInfo);
    }
  }

  //  查询拦截器信息
  public queryInterceptorInfos(routeInfo: JRouteInfo) {
    const interceptors: JRouteInterceptorInfo[] = [...this.globalInterceptorInfos];
    routeInfo.interceptors?.forEach((path) => {
      const info = this.specializedInterceptorInfos.get(path);
      if (info) {
        interceptors.push(info);
      }
    });
    if(routeInfo.interceptors){
      this.pathInterceptors.set(routeInfo.path,routeInfo.interceptors);
    }
    return interceptors;
  }
}