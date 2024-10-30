import { JRouter, RouterWrapper } from '@mufans/jrouter';
import { TEST_PAGE } from 'baseLib/src/main/ets/const/Const';
import { ITestService2 } from 'baseLib/src/main/ets/service/ITestService2'
import { Constants } from 'baseLib/src/main/ets/const/Constants'

@JRouter({ path: TEST_PAGE })
@Entry({ routeName: TEST_PAGE })
@Component
export struct TestPage {
  build() {
    Column() {
      Text(TEST_PAGE)
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
      Button("go to entry page in entry")
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 20 })
        .onClick(() => {
          RouterWrapper.pushNamedRoute({ name: Constants.PAGE_ENTRY });
        })
      Button("go to entry page2 in entry")
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 20 })
        .onClick(() => {
          RouterWrapper.pushNamedRoute({ name: Constants.PAGE_ENTRY2 });
        })
    }
    .width('100%')
    .height('100%')
  }
}
