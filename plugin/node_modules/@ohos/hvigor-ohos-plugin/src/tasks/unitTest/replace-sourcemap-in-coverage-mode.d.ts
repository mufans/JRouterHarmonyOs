import { TargetTaskService } from '../service/target-task-service.js';
import { OhosModuleTask } from '../task/ohos-module-task.js';
/**
 * 覆盖率场景下替换sourceMap
 *
 * @since 2024-07-25
 */
export declare class ReplaceSourcemapInCoverageMode extends OhosModuleTask {
    unitTestSourceMapPath: string;
    defaultSourceMapPath: string;
    constructor(taskService: TargetTaskService);
    protected doTaskAction(): Promise<void>;
    initTaskDepends(): void;
}
