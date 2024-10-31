import { JRouter, RouterWrapper } from '@mufans/jrouter';
import { ITestService } from 'baseLib/src/main/ets/service/ITestService'
import { Constants } from 'baseLib/src/main/ets/const/Constants'
import { TEST_PAGE } from 'baseLib/src/main/ets/const/Const'

@JRouter({ path: Constants.PAGE_ENTRY2 })
@Entry({ routeName: Constants.PAGE_ENTRY2 })
@Component
export struct EntryPage2 {
  build() {
    RelativeContainer() {
      Text(Constants.PAGE_ENTRY2)
        .fontSize(20)
        .id("title")
        .fontWeight(FontWeight.Bold)
        .margin({ top: 20 })
        .alignRules({
          middle: { anchor: '__container__', align: HorizontalAlign.Center }
        })

      Button('go to test page in testLib')
        .id('nav')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 20 })
        .alignRules({
          top: { anchor: 'title', align: VerticalAlign.Bottom },
          middle: { anchor: 'title', align: HorizontalAlign.Center }
        })
        .onClick(() => {
          RouterWrapper.pushNamedRoute({ name: TEST_PAGE });
        })
      Button('go to test page2 in testLib')
        .id('nav2')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 20 })
        .alignRules({
          top: { anchor: 'nav', align: VerticalAlign.Bottom },
          middle: { anchor: 'nav', align: HorizontalAlign.Center }
        })
        .onClick(() => {
          RouterWrapper.pushNamedRoute({ name: Constants.TEST_PAGE2 });
        })
      Button('go to test page3 in testLib2')
        .id('nav3')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 20 })
        .alignRules({
          top: { anchor: 'nav2', align: VerticalAlign.Bottom },
          middle: { anchor: 'nav2', align: HorizontalAlign.Center }
        })
        .onClick(() => {
          RouterWrapper.pushNamedRoute({ name: Constants.TEST_PAGE3 });
        })
      Button('open entry page in entry')
        .id('open')
        .fontSize(20)
        .margin({ top: 20 })
        .fontWeight(FontWeight.Bold)
        .alignRules({
          top: { anchor: 'nav3', align: VerticalAlign.Bottom },
          middle: { anchor: 'nav3', align: HorizontalAlign.Center }
        })
        .onClick(() => {
          RouterWrapper.pushNamedRoute({ name: Constants.PAGE_ENTRY });
        })
      Button("invoke TestService in testLib")
        .id('getService')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 20 })
        .alignRules({
          top: { anchor: 'open', align: VerticalAlign.Bottom },
          middle: { anchor: 'open', align: HorizontalAlign.Center }
        })
        .onClick(() => {
          RouterWrapper.findServiceAsync<ITestService>(Constants.TEST_SERVICE).then((service) => {
            service?.execute();
          })
        })

    }
    .height('100%')
    .width('100%')
  }
}