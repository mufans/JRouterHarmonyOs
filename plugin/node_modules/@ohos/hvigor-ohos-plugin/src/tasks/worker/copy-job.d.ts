import { CopyConfig } from '../../utils/copy-resources-util.js';
/**
 * 指定要copy的模式
 */
export interface PatternObjType {
    src: string;
    dest: string;
    ignore?: Ignore;
    onlyFiles?: boolean;
    rename?: (name: string, extension: string, fullPath: string) => string;
}
interface Ignore {
    ignored: (p: {
        name: string;
    }) => boolean;
}
interface Target {
    src: string;
    dest: string;
    rename?: string | Function;
    ignore?: Ignore;
    onlyFiles?: boolean;
}
export interface CopyOptions {
    targets?: Target[];
}
export declare function copyByCopyOptions(config: CopyConfig): Promise<void>;
export {};
