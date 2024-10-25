import { TaskDetails } from '@ohos/hvigor';
import { TargetTaskService } from './service/target-task-service.js';
import { OhosHapTask } from './task/ohos-hap-task.js';
/**
 * syscap相关配置预检查任务
 */
export declare class PreCheckSyscap extends OhosHapTask {
    private _log;
    private readonly sysCapJsonPath;
    private readonly sourceRoot;
    private readonly jsonFilePath;
    constructor(targetTaskService: TargetTaskService, taskDetails: TaskDetails);
    protected doTaskAction(): void;
    initTaskDepends(): void;
}
