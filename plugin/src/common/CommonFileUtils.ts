import { FileUtil } from "@ohos/hvigor";
import { Constant } from "./Constant";
import fs from 'fs';
import exp from "constants";
import ts from 'typescript';
import { Logger } from './Logger'

export function listFiles(...dirPath: string[]): string[] {
  let filePaths: string[] = [];
  dirPath.forEach(path => {
    deepScan(path, '', filePaths);
  });
  return filePaths;
}

export function deepScan(scanPath: string, filePath: string, result: string[]) {
  let resolvePath = FileUtil.pathResolve(scanPath, filePath);
  Logger.info("deepScan" + scanPath + "," + resolvePath);
  if (FileUtil.exist(resolvePath) && FileUtil.isDictionary(resolvePath)) {
    const files: string[] = fs.readdirSync(resolvePath);
    files.forEach((file) => {
      deepScan(resolvePath, file, result);
    });
  } else {
    if (resolvePath.endsWith(Constant.SCAN_FILE_SUFFIX)) {
      result.push(resolvePath);
    }
  }
}


/**
 * 创建源码
 * @param filePath 
 * @returns 
 */
export function createSourceFile(filePath: string) {
  if (!FileUtil.exist(filePath)) {
    return null;
  }
  const sourcecode = FileUtil.readFileSync(filePath).toString();
  return ts.createSourceFile(filePath, sourcecode, ts.ScriptTarget.ES2021, false);
}