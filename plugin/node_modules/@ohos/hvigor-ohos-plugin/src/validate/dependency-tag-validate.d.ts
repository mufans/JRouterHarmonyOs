export interface pathParamsOpt {
    parameterFilePath?: string;
    ohPackageFilePath: string;
}
export interface tagValidateParamsOpt extends pathParamsOpt {
    key: string;
    value: string;
    dependencyName?: string;
}
/**
 * 新增tag相关校验,如果tag配置在version则直接报错,如果不符合tag规则则返回false不进行校验
 *
 * @param tagValidateParams
 */
export declare function isValidateTag(tagValidateParams: tagValidateParamsOpt): boolean;
