import { ServiceFactory } from './ServiceFactory'

export class ServiceFactoryHolder implements ServiceFactory {
  private realFactory: () => object;
  private singleton: boolean;
  private instance: object | undefined;

  constructor(factory: () => object, singleton: boolean = false) {
    this.realFactory = factory;
    this.singleton = singleton;
  }

  create(): object {
    if (this.singleton) {
      if (!this.instance) {
        this.instance = this.realFactory();
      }
      return this.instance;
    } else {
      return this.realFactory();
    }
  }

  destroy(): void {
    this.instance = undefined;
  }
}