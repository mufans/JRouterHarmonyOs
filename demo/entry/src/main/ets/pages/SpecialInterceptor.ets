import { IInterceptor, InterceptorResult, JRouterInterceptor, NamedRouterOptions } from '@mufans/jrouter'
import { ToastUtil } from 'baseLib/src/main/ets/utils/ToastUtils'
import { Constants } from 'baseLib/src/main/ets/const/Constants'

@JRouterInterceptor({ path: Constants.SPECIAL_INTERCEPTOR, priority: 100 })
export class SpecialInterceptor implements IInterceptor {
  async intercept(options: NamedRouterOptions): Promise<InterceptorResult> {
    console.log("SpecialInterceptor..........")
    ToastUtil.showToast(`${options.name} intercepted by SpecialInterceptor `)
    return {
      terminal: true,
      options: options
    }
  }
}