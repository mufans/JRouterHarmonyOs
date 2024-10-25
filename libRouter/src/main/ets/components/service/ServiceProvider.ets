import { JRouteInfo } from '../JRouteInfo';
import { ServiceFactoryHolder } from './ServiceFactoryHolder';

// 服务发现
class ServiceProvider {
  // 工厂
  private factoryHolder = new Map<string, ServiceFactoryHolder>();

  // 添加服务类型的路由
  addService(routeInfo: JRouteInfo) {
    if (!routeInfo.factory) {
      return;
    }
    const holder = new ServiceFactoryHolder(routeInfo.factory, routeInfo.singleton);
    this.factoryHolder.set(routeInfo.path, holder);
  }

  // 发现服务
  findService<T>(path: string): T | null {
    return this.factoryHolder.get(path)?.create() as T;
  }

  // 销毁服务
  destroyService(path: string) {
    this.factoryHolder.get(path)?.destroy();
  }
}

export const SPI = new ServiceProvider();