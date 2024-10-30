import { JProvider } from '@mufans/jrouter';
import { ITestService2 } from 'baseLib/src/main/ets/service/ITestService2';
import { ToastUtil } from 'baseLib/src/main/ets/utils/ToastUtils';
import { Constants } from 'baseLib/src/main/ets/const/Constants'

@JProvider({
  path: Constants.TEST_SERVICE2,
  singleton: true,
})
export class TestService2Impl implements ITestService2 {
  execute(): void {
    console.log("TestService2 ......")
    ToastUtil.showToast(`TestService2Impl execute `)
  }
}