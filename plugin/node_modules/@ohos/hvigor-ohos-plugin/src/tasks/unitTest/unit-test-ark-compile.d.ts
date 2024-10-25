import { FileSet } from '@ohos/hvigor';
import { ProjectConfig } from '@ohos/hvigor-arkts-compose';
import { OhosLogger } from '../../utils/log/ohos-logger.js';
import { ArkCompile } from '../ark-compile.js';
/**
 * 单元测试ArkTS编译 stage模型
 *
 * @since 2023/4/23
 */
export declare class UnitTestArkCompile extends ArkCompile {
    logger: OhosLogger;
    declareInputFiles(): FileSet;
    protected doTaskAction(): Promise<void>;
    protected initDefaultArkCompileConfig(): Promise<ProjectConfig>;
    initTaskDepends(): void;
    /**
     *落盘buildConfig文件，传递abc生成路径给测试矿机
     */
    flushBuildConfig(): void;
}
