import { JRouter, RouterWrapper } from '@mufans/jrouter';
import {ITestService} from 'baseLib/src/main/ets/components/ITestService'

@JRouter({path:"entry"})
@Entry({routeName:"entry"})
@Component
struct Index {

  build() {
    RelativeContainer() {
      Text('go to test page')
        .id('nav')
        .fontSize(50)
        .fontWeight(FontWeight.Bold)
        .margin({top:20})
        .alignRules({
          middle: { anchor: '__container__', align: HorizontalAlign.Center }
        })
        .onClick(() => {
          RouterWrapper.pushNamedRoute({ name: "test_page" });
        })
      Text('open new page')
        .id('open')
        .fontSize(50)
        .fontWeight(FontWeight.Bold)
        .alignRules({
          top: { anchor: 'nav', align: VerticalAlign.Bottom },
          middle: { anchor: 'nav', align: HorizontalAlign.Center }
        })
        .onClick(() => {
          RouterWrapper.pushNamedRoute({ name: "entry" });
        })
      Text("getService")
        .id('getService')
        .fontSize(50)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 20 })
        .alignRules({
          top: { anchor: 'open', align: VerticalAlign.Bottom },
          middle: { anchor: 'open', align: HorizontalAlign.Center }
        })
        .onClick(() => {
          RouterWrapper.findServiceAsync<ITestService>("TestService").then((service)=>{
            service?.execute();
          })
        })

    }
    .height('100%')
    .width('100%')
  }
}