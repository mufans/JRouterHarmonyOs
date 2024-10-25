// 路由参数
export interface NamedRouterOptions {
  /**
   * Name of the destination named route.
   *
   * @type { string }
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @since 10
   */
  /**
   * Name of the destination named route.
   *
   * @type { string }
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @atomicservice
   * @since 11
   */
  name: string;

  /**
   * Data that needs to be passed to the destination page during navigation.
   *
   * @type { ?Object }
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @since 10
   */
  /**
   * Data that needs to be passed to the destination page during navigation.
   *
   * @type { ?Object }
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @atomicservice
   * @since 11
   */
  params?: Object;

}
