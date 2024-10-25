import { JProvider } from '@mufans/jrouter';
import {ITestService} from 'baseLib/src/main/ets/components/ITestService'
import { ToastUtil } from 'baseLib/src/main/ets/utils/ToastUtils';

@JProvider({
  path: "TestService",
  singleton: false
})
export class TestService implements ITestService {
  execute(): void {
    console.log("TestService execute..........");
    ToastUtil.showToast(`TestService execute `)
  }
}