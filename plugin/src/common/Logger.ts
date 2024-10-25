import { HvigorLogger } from '@ohos/hvigor';

export class Logger {
  static error(format: string, ...args: string[]) {
    let formatStr: string = format;

    const publicFormat =
      `[JRouterPlugin] ERROR: ${formatStr.replace('%s', args[0])}`;
    HvigorLogger.getLogger().error(publicFormat);
  }

  static info(msg: string, ...args: unknown[]) {
    HvigorLogger.getLogger().info('[JRouterPlugin] ' + msg, ...args);
  }
}
