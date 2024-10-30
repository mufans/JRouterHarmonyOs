import { promptAction } from '@kit.ArkUI'

export class ToastUtil {
  static showToast(msg: string | Resource): void {
    promptAction.showToast({ message: msg })
  }

  static showToastWithOptions(options?: promptAction.ShowToastOptions) {
    promptAction.showToast(options)
  }
}