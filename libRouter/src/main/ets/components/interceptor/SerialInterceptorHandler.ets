import { IInterceptor, InterceptorResult } from '../interfaces/IInterceptor';
import { NamedRouterOptions } from '../interfaces/NameRouterOptions';

// 串行执行拦截器
export class SerialInterceptorHandler implements IInterceptor {
  interceptors: IInterceptor[];
  currentPos = 0;

  constructor(interceptors: IInterceptor[]) {
    this.interceptors = interceptors;
  }

  intercept(options: NamedRouterOptions): Promise<InterceptorResult> {
    return this.interceptors[this.currentPos].intercept(options).then((result) => {
      this.currentPos++; // 计数加一
      // 判断没有终止
      if (!result.terminal && this.currentPos <= this.interceptors.length - 1) {
        return this.intercept(result.options); // 执行下一步
      } else {
        return result;
      }
    })
  }
}