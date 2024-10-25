import { FileSet, TaskDetails } from '@ohos/hvigor';
import { OhosHarTask } from '../task/ohos-har-task.js';
import { TargetTaskService } from '../service/target-task-service.js';
/**
 * 打包Har包
 *
 * @since 2021/12/18
 */
export declare abstract class AbstractPackageHar extends OhosHarTask {
    protected abstract readonly taskTmpDir: string;
    protected readonly outputDir: string;
    protected readonly npmCommand: string[];
    protected readonly npmPath: string;
    declareOutputFiles(): FileSet;
    protected constructor(taskService: TargetTaskService, taskDetails: TaskDetails);
    declareExecutionCommand(): string;
    protected doTaskAction(): Promise<void>;
    private executeOhpmPack;
    private executeNpmPack;
    private moveSourceMap;
}
