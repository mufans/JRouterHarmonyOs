import { FileSet, FsOptions } from '../internal/snapshot/util/file-set.js';
import { TaskInputValue } from '../internal/snapshot/util/task-input-value-entry.js';
import { IncrementalDecoratorType } from './types.js';
export interface DecoratorDeclarations {
    inputFiles: FileSet;
    outputFiles: FileSet;
    inputs: Map<string, TaskInputValue>;
}
type Handler = (propertyKey: string, propertyValue: any, decoratorDeclarations: DecoratorDeclarations, options?: FsOptions) => void;
/**
 * 在收集装饰器装饰的属性时，一些策略处理
 */
export declare const Strategies: Record<IncrementalDecoratorType, Handler>;
export {};
