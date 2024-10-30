import { JProvider } from '@mufans/jrouter';
import {ITestService} from 'baseLib/src/main/ets/service/ITestService'
import { ToastUtil } from 'baseLib/src/main/ets/utils/ToastUtils';
import {Constants} from 'baseLib/src/main/ets/const/Constants'
@JProvider({
  path: Constants.TEST_SERVICE,
  singleton: false
})
export class TestService implements ITestService {
  execute(): void {
    console.log("TestService execute..........");
    ToastUtil.showToast(`TestService execute `)
  }
}