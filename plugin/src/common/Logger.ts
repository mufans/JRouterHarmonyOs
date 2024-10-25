import { HvigorLogger } from '@ohos/hvigor';

export class Logger {
  static error(format: string, ...args: string[]) {
    let formatStr: string = format;
    // if (DEFINED_ERROR.has(format)) {
    //   formatStr = `errorCode ${DEFINED_ERROR.get(format)?.errorCode}, errorMsg: ${DEFINED_ERROR.get(format)?.errorMsg}`;
    // }
    const publicFormat =
      `[JRouterPlugin] ERROR: ${formatStr.replace('%s', args[0])}`;
    HvigorLogger.getLogger().error(publicFormat);
  }

  static info(msg: string, ...args: unknown[]) {
    HvigorLogger.getLogger().info('[JRouterPlugin] ' + msg, ...args);
  }
}

// export enum PluginError {
//   ERR_DUPLICATE_NAME = 'ERR_DUPLICATE_NAME',
//   ERR_WRONG_DECORATION = 'ERR_DUPLICATE_',
//   ERR_REPEAT_ANNOTATION = 'ERR_INIT_FRAMEWORK',
//   ERR_ERROR_CONFIG = 'ERR_INIT_COMPONENT',
//   ERR_NOT_EMPTY_STRING = 'ERR_INIT_NOT_READY',
//   ERR_INVALID_STRING_VALUE = 'ERR_INVALID_STRING_VALUE'
// }

// interface PluginErrorInfo {
//   errorCode: number;
//   errorMsg: string;
// }

// const DEFINED_ERROR: Map<string, PluginErrorInfo> = new Map();

// DEFINED_ERROR.set(PluginError.ERR_DUPLICATE_NAME, {
//   errorCode: 40000001,
//   errorMsg: '重复的pageUrl、拦截器、生命周期、动画、服务 - %s'
// });

// DEFINED_ERROR.set(PluginError.ERR_WRONG_DECORATION, {
//   errorCode: 40000002,
//   errorMsg: '@HMRouter修饰的组件不能包含NavDestination - %s'
// });

// DEFINED_ERROR.set(PluginError.ERR_REPEAT_ANNOTATION, {
//   errorCode: 40000003,
//   errorMsg: '文件 %s 中存在多个HMRouter注解'
// });

// DEFINED_ERROR.set(PluginError.ERR_ERROR_CONFIG, {
//   errorCode: 40000004,
//   errorMsg: 'moduleContext is null 请检查插件的hvigorfile配置 - %s'
// });

// DEFINED_ERROR.set(PluginError.ERR_NOT_EMPTY_STRING, {
//   errorCode: 40000005,
//   errorMsg: '%s 常量值不能为空字符串 - %s'
// });

// DEFINED_ERROR.set(PluginError.ERR_INVALID_STRING_VALUE, {
//   errorCode: 40000006,
//   errorMsg: '%s 无效的字符串常量值'
// });