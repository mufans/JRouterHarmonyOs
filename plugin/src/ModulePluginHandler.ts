import { FileUtil, HvigorNode } from "@ohos/hvigor";
import { Analyzer, RouteInfo } from "./Analyzer";
import { PluginConfig } from "./PluginConfig";
import { listFiles } from './common/CommonFileUtils'
import { Logger } from "./common/Logger";
import { Constant } from "./common/Constant";
import Handlebars from "handlebars";
import { TemplateImport, TemplateModel, TemplateRoute } from "./TemplateModel";
import { OhosHapContext, OhosHarContext, OhosHspContext, OhosPluginId } from '@ohos/hvigor-ohos-plugin';
import { PluginManager } from "./PluginManager";
import { RouteMap } from "./RouteProcessor";
import { PackageJson5 } from "./PackageJson5";

// 模块插件处理
export class ModulePluginHandler {
    // 节点
    private mNode: HvigorNode;

    // 上下文
    private mContext: OhosHapContext | OhosHarContext | OhosHspContext;

    // 插件配置
    private mConfig: PluginConfig;

    private mFiles: string[] = [];

    private mAnalyzeResultSet: RouteInfo[] = [];

    // 包配置
    private mPackageInfo: PackageJson5 | undefined = undefined;


    constructor(node: HvigorNode, context: OhosHapContext | OhosHarContext | OhosHspContext, config: PluginConfig) {
        this.mNode = node;
        this.mContext = context;
        this.mConfig = config;
    }

    /**
     * 获取模块名称
     * @returns 
     */
    public getModuleName() {
        return this.mNode.getNodeName();
    }

    /**
     * 配置模块
     * @param moduleNames 
     */
    public configModules(moduleNames: string[]) {
        const buildProfileOpt = this.mContext.getBuildProfileOpt();
        if (!buildProfileOpt.buildOption) {
            buildProfileOpt.buildOption = {};
        }
        if (!buildProfileOpt.buildOption.arkOptions) {
            buildProfileOpt.buildOption.arkOptions = {}
        }
        if (!buildProfileOpt.buildOption.arkOptions.runtimeOnly) {
            buildProfileOpt.buildOption.arkOptions.runtimeOnly = {}
        }
        if (!buildProfileOpt.buildOption.arkOptions.runtimeOnly.packages) {
            buildProfileOpt.buildOption.arkOptions.runtimeOnly.packages = []
        }
        const packages = buildProfileOpt.buildOption.arkOptions.runtimeOnly.packages ?? [];
        // 添加动态导出的模块
        moduleNames.forEach((name) => {
            if (!packages.includes(name)) {
                packages.push(name)
            }
        });
        this.mContext.setBuildProfileOpt(buildProfileOpt);
    }

    // 应用插件
    public apply() {
        this.mContext.targets((target) => {
            const targetName = target.getTargetName();
            this.mNode.registerTask({
                name: `${targetName}@RoutePluginTask`,
                run: () => {
                    this.execTask();
                },
                dependencies: [`${targetName}@PreBuild`],
                postDependencies: [`${targetName}@MergeProfile`]
            });
        })
    }

    // 执行任务
    public execTask() {
        if (this.mConfig.disablePlugin) {
            PluginManager.notifyTaskFinished(this, true);
            return;
        }
        this.mAnalyzeResultSet = [];
        const root = this.mConfig.root ? (this.mConfig.root + "/") : "";
        const dirs: string[] = [];
        if (this.mConfig.dirs && this.mConfig.dirs.length > 0) {
            this.mConfig.dirs.forEach((dir) => {
                dirs.push(root + this.mNode.getNodeName() + "/" + dir);
            })
        } else {
            dirs.push(root + this.mNode.getNodeName() + "/src");
        }

        this.mFiles = listFiles(...dirs);

        Logger.info(`read ${this.mNode.getNodeName()} oh-package.json5`);
        this.mPackageInfo = FileUtil.readJson5(FileUtil.pathResolve(this.mNode.getNodeDir().filePath + "/" + Constant.OH_PACKAGE));
        if(this.mPackageInfo?.dependencies){
            this.mPackageInfo.dependencies = new Map(Object.entries(this.mPackageInfo.dependencies));
        }
        Logger.info(`result: ${JSON.stringify(this.mPackageInfo)}`);

        this.mFiles.forEach((path) => {
            const annalyzer = new Analyzer(this.mNode.getNodeName(),this.mNode.getNodeDir().filePath, path, this.mConfig, this.mPackageInfo!);
            annalyzer.start();
            const result = annalyzer.getResult();
            if (result) {
                this.mAnalyzeResultSet.push(result);
            }
        });

        Logger.info("analyze code end...");

        this.mAnalyzeResultSet.forEach((result) => {
            Logger.info(JSON.stringify(result));
        })


        // 分析注解信息
        this.analyzeAnnotation();

        // 输出路由表
        this.writeRouteMap();

        // 通知任务完成
        PluginManager.notifyTaskFinished(this);
    }


    private analyzeAnnotation() {

    }

    private getTplFilePath() {
        return FileUtil.pathResolve(__dirname, "../" + Constant.TEMPLATE_FILE);
    }

    private getTplRouteType(annotationType: string) {
        return Constant.ANN_MAPPER.get(annotationType) ?? ""
    }


    /**
     * 写路由表
     */
    private writeRouteMap() {
        const routes: TemplateRoute[] = this.mAnalyzeResultSet.map((value) => {
            if (value.interceptors && value.interceptors?.length > 0) {
                Logger.info("writeRouteMap" + JSON.stringify(value.interceptors));
            }
            return {
                srcPath: value.srcPath ?? "",
                path: value.path as string,
                type: this.getTplRouteType(value.annotation ?? ""),
                factory: value.className,
                singleton: value.singleton,
                priority: value.priority,
                global: value.global,
                interceptors: JSON.stringify(value.interceptors)
            }
        });
        const routeImports: TemplateImport[] = routes.filter((route) => {
            return route.factory && route.factory.length > 0;
        }).map((route) => {
            return {
                name: route.factory!,
                // routemap.ets相对路径
                srcPath: ".." + route.srcPath.split(Constant.TEMPLATE_SRC_ROOT_PATH)[1]
            }
        })
        const templateModel: TemplateModel = new TemplateModel(this.mNode.getNodeName(), routes, routeImports);
        const templateContent = FileUtil.readFileSync(this.getTplFilePath()).toString();
        // 注册模版函数
        Handlebars.registerHelper('eq', function (arg1, arg2, options) {
            return arg1 === arg2;
        });
        // Handlebars.registerHelper('toArrayString', function (array) {
        //     return JSON.stringify(array).replace(/\\\"/g, '"');
        // });
        Handlebars.registerHelper('showValue', function (value) {
            return value === false ? 'false' : value;
        });
        const template = Handlebars.compile(templateContent);
        const output = template(templateModel);
        const outputPath = FileUtil.pathResolve(this.mNode.nodeDir.filePath, Constant.TEMPLATE_OUTPUT_PATH);
        FileUtil.ensureFileSync(outputPath);
        FileUtil.writeFileSync(outputPath, output);
        Logger.info(`writeRouteMap ${outputPath} finished!`);
    }

    // 获取路由表路径
    public getRouteMapSrcPath() {
        return this.mNode.getNodeName() + "/" + Constant.TEMPLATE_OUTPUT_PATH
    }

    // 获取路由表
    public getRouteInfo() {
        return this.mAnalyzeResultSet
    }

    public getRouteMap(): RouteMap {
        return {
            moduleName: this.getModuleName(),
            srcPath: this.getRouteMapSrcPath(),
            routes: this.getRouteInfo()
        }
    }

    // 写入路由表配置
    public writeRouteMapJson(routeMap: RouteMap[]) {
        // 合并路由表
        const mergedRouteMap: RouteMap[] = [];
        if (this.getRouteInfo().length > 0) {
            mergedRouteMap.push(this.getRouteMap())
        }
        mergedRouteMap.push(...routeMap);
        const routeSet = {
            "routeMap": mergedRouteMap
        };
        const output = JSON.stringify(routeSet);
        const outputPath = FileUtil.pathResolve(this.mNode.nodeDir.filePath, Constant.ROUTE_MAP_OUTPUT_PATH);
        FileUtil.ensureFileSync(outputPath);
        FileUtil.writeFileSync(outputPath, output);
    }
}