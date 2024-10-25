/**
 * hvigor项目的打点数据声明
 */
export interface HvigorTraceData {
    TOTAL_TIME?: number;
    IS_INCREMENTAL: boolean;
    IS_DAEMON: boolean;
    IS_PARALLEL: boolean;
    IS_HVIGORFILE_TYPE_CHECK: boolean;
    ERROR_MESSAGE?: {
        CODE?: string;
        TIMESTAMP?: string;
        BUILD_ID?: string;
        MESSAGE?: string;
        SOLUTIONS?: string[];
        MORE_INFO?: string;
        COMPONENTS?: string;
        CHECK_MESSAGE?: string;
    };
    TASK_TIME?: Record<string, Record<string, number>>;
    BUILD_ID?: string;
}
