// 路由信息
export interface JRouteInfo {
  type: JRouteType, // 路由类型
  path: string, // 路由路径
  srcPath: string, // 源码路径
  singleton?: boolean // 是否单例
  interceptors?:string[] // 拦截器
  factory?: () => object // 路由工厂
}

export class JRouteInterceptorInfo implements JRouteInfo {
  type: JRouteType = JRouteType.INTERCEPTOR
  path: string
  srcPath: string
  singleton: boolean = true
  factory: (() => object)
  global: boolean = false
  priority: number = 0
  interceptors?:string[]

  constructor(path: string, srcPath: string, factory: (() => object), global: boolean, priority: number = 0,interceptors?:string[]) {
    this.path = path;
    this.srcPath = srcPath;
    this.factory = factory;
    this.global = global;
    this.priority = priority;
    this.interceptors = interceptors;
  }

  static create(interceptor: IJRouteInterceptorInfo) {
    return new JRouteInterceptorInfo(interceptor.path, interceptor.srcPath, interceptor.factory,
      interceptor.global ?? false, interceptor.priority ?? 0);
  }
}

export interface IJRouteInterceptorInfo {
  path: string
  srcPath: string
  factory: (() => object)
  global?: boolean
  priority?: number
}


// 路由类型
export enum JRouteType {
  PAGE, // 页面
  PROVIDER, // 协议
  INTERCEPTOR // 拦截器
}