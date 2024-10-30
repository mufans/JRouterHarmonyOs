import { JRouter, RouterWrapper } from '@mufans/jrouter';
import { TEST_PAGE } from 'baseLib/src/main/ets/const/Const';
import { ITestService2 } from 'baseLib/src/main/ets/service/ITestService2'
import { Constants } from 'baseLib/src/main/ets/const/Constants'

@JRouter({ path: Constants.TEST_PAGE2, interceptors: ["SpecialInterceptor"] })
@Entry({ routeName: Constants.TEST_PAGE2 })
@Component
export struct TestPage2 {
  build() {
    Row() {
      Column() {
        Button("invoke TestService2 in entry")
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .onClick(() => {
            RouterWrapper.findServiceAsync<ITestService2>(Constants.TEST_SERVICE2).then((service) => {
              service?.execute();
            })
          })
      }
      .width('100%')
    }
    .height('100%')
  }
}
