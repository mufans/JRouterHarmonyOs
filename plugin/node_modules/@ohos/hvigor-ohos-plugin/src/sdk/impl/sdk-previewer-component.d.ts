import { Component } from '@ohos/sdkmanager-common';
import { SdkComponent } from '../superior/sdk-component.js';
/**
 * sdk previewer实例
 */
export declare class SdkPreviewerComponent extends SdkComponent {
    private readonly logger;
    static readonly COMMON = "common";
    static readonly BIN = "bin";
    static readonly RESOURCES_MODULE = "resources/module.json";
    readonly sdkDefinePermissions: Map<string, string[]>;
    allowSdkPermission: boolean;
    constructor(component: Component);
    getCommonBin(): string;
    private setPermissionData;
    /**
     * 获取sdk配置权限名称集合
     *
     * @returns string[]
     */
    getSdkPermissionNames(): string[];
    /**
     * 获取sdk配置用户权限名称集合
     *
     * @returns string[]
     */
    getSdkDefineUserGrant(): string[];
}
