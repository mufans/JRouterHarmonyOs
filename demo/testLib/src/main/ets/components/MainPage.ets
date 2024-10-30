import { JRouter, RouterWrapper } from '@mufans/jrouter';
import { TEST_PAGE } from 'baseLib/src/main/ets/const/Const';
import { ITestService2 } from 'baseLib/src/main/ets/components/ITestService2'

@JRouter({ path: TEST_PAGE,interceptors:["SpecialInterceptor"] })
@Entry({ routeName: TEST_PAGE })
@Component
export struct MainPage {
  @State message: string = 'invoke TestService2';

  build() {
    Row() {
      Column() {
        Text(this.message)
          .fontSize(50)
          .fontWeight(FontWeight.Bold)
          .onClick(() => {
            RouterWrapper.findServiceAsync<ITestService2>("TestService2").then((service) => {
              service?.execute();
            })
          })
      }
      .width('100%')
    }
    .height('100%')
  }
}
