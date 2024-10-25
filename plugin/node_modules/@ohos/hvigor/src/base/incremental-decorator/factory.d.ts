import { IncrementalTask } from '../external/task/incremental-task.js';
import { FsOptions } from '../internal/snapshot/util/file-set.js';
import { IncrementalDecoratorType } from './types.js';
type IncrementalDecorator = (target: IncrementalTask, propertyKey: string) => void;
/**
 * 用于生成Input/Inputs装饰器
 * @param declaratorType
 */
export declare const createInputDecorator: (declaratorType: IncrementalDecoratorType) => (() => IncrementalDecorator);
/**
 * 用于生成InputFile/InputFiles/OutputFile/OutputFiles装饰器
 * @param declaratorType
 */
export declare const createFileDecorator: (declaratorType: IncrementalDecoratorType) => (options?: FsOptions) => IncrementalDecorator;
export {};
