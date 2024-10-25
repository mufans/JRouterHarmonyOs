import { TaskDetails } from '@ohos/hvigor';
import { TargetTaskService } from '../service/target-task-service.js';
import { OhosHapTask } from '../task/ohos-hap-task.js';
export declare class ProcessLibsCommonProperties extends OhosHapTask {
    protected constructor(taskService: TargetTaskService, taskDetails: TaskDetails);
    protected get libsPattern(): "**/*.so*(.*[0-9])" | "**/*";
    protected getLibsInfo(libsPath: string): string[];
    protected doTaskAction(): void;
    initTaskDepends(): void;
}
