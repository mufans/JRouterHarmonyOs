import { JRouterInterceptor } from '@mufans/jrouter/src/main/ets/components/annotation/JRouterInterceptor';
import { IInterceptor, InterceptorResult } from '@mufans/jrouter/src/main/ets/components/interfaces/IInterceptor';
import { NamedRouterOptions } from '@mufans/jrouter/src/main/ets/components/interfaces/NameRouterOptions';
import { Constants } from 'baseLib/src/main/ets/const/Constants'

@JRouterInterceptor({ path: Constants.GLOBAL_INTERCEPTOR, global: true })
export class GlobalInterceptor implements IInterceptor {
  async intercept(options: NamedRouterOptions): Promise<InterceptorResult> {
    console.log("GlobalInterceptor..........")
    return {
      terminal: false,
      options: options
    }
  }
}