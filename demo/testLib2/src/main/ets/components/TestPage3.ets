import { JRouter, RouterWrapper } from '@mufans/jrouter';
import { TEST_PAGE } from 'baseLib/src/main/ets/const/Const';
import { ITestService2 } from 'baseLib/src/main/ets/service/ITestService2';
import { Constants } from 'baseLib/src/main/ets/const/Constants';
import { ITestService } from 'baseLib/src/main/ets/service/ITestService';

@JRouter({ path: Constants.TEST_PAGE3 })
@Entry({ routeName: Constants.TEST_PAGE3 })
@Component
export struct TestPage3 {
  build() {
    Column() {
      Text(Constants.TEST_PAGE3)
        .fontSize(20)
        .textAlign(TextAlign.Center)
        .width('100%')
        .fontWeight(FontWeight.Bold)
        .margin({ top: 20 })

      Button("invoke TestService2 in entry")
        .fontSize(20)
        .margin({ top: 20 })
        .fontWeight(FontWeight.Bold)
        .onClick(() => {
          RouterWrapper.findServiceAsync<ITestService2>(Constants.TEST_SERVICE2).then((service) => {
            service?.execute();
          })
        })
      Button("go to test page in testLib")
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 20 })
        .onClick(() => {
          RouterWrapper.pushNamedRoute({ name: TEST_PAGE });
        })
      Button("invoke TestService in testLib")
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 20 })
        .onClick(() => {
          RouterWrapper.findServiceAsync<ITestService>(Constants.TEST_SERVICE).then((service) => {
            service?.execute();
          })
        })
    }
    .width('100%')
    .height('100%')
  }
}
