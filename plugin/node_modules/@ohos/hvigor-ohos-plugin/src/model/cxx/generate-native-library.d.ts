import { NativeCMakeFiles } from './native-cmake-files';
import { NativeTarget } from './native-codemodel-target.js';
import { NativeLibraryModel } from './native-library-model.js';
export declare class GenerateNativeLibrary {
    static parseLibrary(abi: string, nativeTarget: NativeTarget, target: string, cmakeFiles?: NativeCMakeFiles): NativeLibraryModel;
    static findFolders(nativeTarget: NativeTarget): string[];
    private static findFiles;
    private static findOutputs;
    private static findRuntimeFiles;
}
