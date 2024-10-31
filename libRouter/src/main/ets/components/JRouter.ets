import { IJRouteInterceptorInfo, JRouteInfo, JRouteInterceptorInfo } from './JRouteInfo';
import router from '@ohos.router';
import { NamedRouterOptions } from './interfaces/NameRouterOptions';
import { IRouteMap } from './interfaces/IRouteMap';
import { JRouterOptions } from './JRouterOptions';
import { IRouteMapStore } from './interfaces/IRouteMapStore';
import { RouteMapStore } from './store/RouteMapStore';
import { Context } from '@kit.AbilityKit';
import { RouteMapModel } from './model/RouteMapModel';
import { RouteMapInfo } from './model/RouteMapInfo';
import { SPI } from './service/ServiceProvider';
import { JRouteInterceptorHandler } from './interceptor/JRouteInterceptorHandler';
import { IInterceptor } from './interfaces/IInterceptor';

/**
 * router库封装，支持跨模块跳转
 */
export class JRouter {
  // 初始化
  private hasInit: boolean = false;
  // 上下文
  private context: UIContext | undefined;
  //  参数
  private options: JRouterOptions = {};
  // 路由存储
  private routerStore: IRouteMapStore | undefined;
  // 路由表
  private routeMapModel: RouteMapModel | undefined;
  // 路由信息
  private routeInfoArray: JRouteInfo[] = [];
  // 导包记录
  private importRouteMap: Map<string, JRouteInfo> = new Map();
  // 路由表记录
  private groupedRoute: Map<string, IRouteMap> = new Map();
  // 入口路由表
  private entryRouteMap: RouteMapInfo | undefined
  // 路由拦截器
  private interceptorHandler = new JRouteInterceptorHandler();

  // 初始化
  public init(context: Context, options: JRouterOptions) {
    if (this.hasInit) {
      return;
    }
    this.hasInit = true;
    this.options = options;
    // 加载路由表
    this.loadRouteMap(context, options);
  }

  private loadRouteMap(context: Context, options: JRouterOptions) {
    this.routerStore = new RouteMapStore(context);
    this.routerStore.getRouteMapAsync().then((model) => {
      this.routeMapModel = model;
      if (options.entry) {
        this.entryRouteMap = model.findRouteMapByName(options.entry.name);
      }
    });
  }

  // 注册拦截器
  public registerInterceptor(interceptorInfo: IJRouteInterceptorInfo) {
    const info = JRouteInterceptorInfo.create(interceptorInfo);
    this.interceptorHandler.addInterceptorInfo(info);
    this.routeInfoArray.push(info);
    SPI.addService(info);
  }

  // 注册路由
  public register(routerInfo: JRouteInfo) {
    this.routeInfoArray.push(routerInfo);
    if (routerInfo.factory) {
      SPI.addService(routerInfo);
    }
  }

  // 查看是否包含路由表
  public hasGroup(routeMapName: string) {
    return this.groupedRoute.has(routeMapName);
  }

  // 注册路由表
  public registerRouteMap(routeMap: IRouteMap) {
    this.groupedRoute.set(routeMap.name, routeMap);
    routeMap.createRoute(); // 路由表实例内部实现注册
  }

  // 判断是否属于入口路由
  private belongsToEntry(routeInfo: JRouteInfo) {
    if (!this.entryRouteMap) {
      return false;
    }
    return this.entryRouteMap.routes.some((route) => route.path == routeInfo.path);
  }

  // push命名路由
  public async pushNamedRoute(options: NamedRouterOptions): Promise<void> {
    const routeInfo = await this.findRouteInfo(options.name);
    if (!routeInfo) {
      return router.pushNamedRoute(options);
    }
    const interceptorInfos = this.interceptorHandler.queryInterceptorInfos(routeInfo);

    for (let i = 0; i < interceptorInfos.length; i++) {
      let interceptorInfo = interceptorInfos[i];
      let interceptor = await this.findServiceAsync<IInterceptor>(interceptorInfo.path);
      if (interceptor) {
        this.interceptorHandler.addInterceptor(interceptorInfo, interceptor);
      }
    }

    const result = await this.interceptorHandler.intercept(options);
    if (result.terminal) {
      return;
    }

    // 查询是否需要导包
    if (!this.belongsToEntry(routeInfo) && !this.importRouteMap.has(routeInfo.path)) {
      return import(routeInfo.srcPath).then((value: object) => {
        this.importRouteMap.set(routeInfo.path, routeInfo);
        return router.pushNamedRoute(options);
      }).catch((error: Error) => {
        console.log(error.message)
        return router.pushNamedRoute(options)
      })
    }

    return router.pushNamedRoute(options);
  }

  // 查找路由信息
  private async findRouteInfo(path: string) {
    let tmpRouteInfo = this.routeInfoArray.find((value) => value.path == path);
    if (!tmpRouteInfo) {
      try {
        // 导入路由表
        await this.routeMapModel?.importRouteMap(path);
        tmpRouteInfo = this.routeInfoArray.find((value) => value.path == path);
      } catch (e) {
        const error = e as Error;
        console.error(error.message);
      }
    }
    return tmpRouteInfo;
  }

  // 获取服务
  public async findServiceAsync<T>(path: string): Promise<T | null> {
    const routeInfo = await this.findRouteInfo(path);
    if (!routeInfo) {
      return null;
    }
    return SPI.findService(path);
  }

  // 获取服务
  public findService<T>(path: string): T | null {
    return SPI.findService(path);
  }

  // 销毁服务
  public destroyService(path: string) {
    SPI.destroyService(path);
  }
}


export const RouterWrapper = new JRouter();