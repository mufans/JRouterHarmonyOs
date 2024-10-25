/**
 * 将对象写进文件中
 *
 * @since 2022/8/25
 */
export declare class LocalFileWriter {
    private static instance;
    private _space;
    private _replacer;
    private constructor();
    withSpace(space: number): void;
    withReplacer(replacer: (this: any, key: string, value: any) => any): void;
    /**
     * 将object对象写进json文件中
     *
     * @param filePath
     * @param content
     */
    write(filePath: string, content: {
        [key: string]: any;
    }): void;
    chunkStringify(content: {
        [key: string]: any;
    }): string[];
    writeStr(filePath: string, content: string): void;
    /**
     * 处理写入文件时报Invalid String length问题
     * @param filePath 文件路径
     * @param contentArray 文件内容拆分后的数组
     */
    writeStrArr(filePath: string, contentArray: string[]): void;
    static getInstance(): LocalFileWriter;
}
