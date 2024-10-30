import { FileUtil, HvigorNode } from '@ohos/hvigor'
import { PluginConfig } from './PluginConfig'
import ts, { Declaration, Expression, Identifier, idText, StringLiteral, StringLiteralLike } from 'typescript'
import { Constant } from './common/Constant';
import { Logger } from './common/Logger';
import { createSourceFile } from './common/CommonFileUtils';
import { PackageJson5 } from './PackageJson5';

interface NodeInfo {
    key: string,
    value: any
}

export class Analyzer {

    private mNodeName: string;

    private mNodeDir: string;

    private mNodePath: string;

    private mPath: string;

    // 配置
    private mConfig: PluginConfig;

    // 包配置信息
    private mPackageInfo: PackageJson5;

    // 解析结果
    private mResult: RouteInfo | undefined;

    // 记录关键字位置
    private mKeywordPos: number = -1;

    // 导包信息
    private mImportMap: Map<string, string[]> = new Map();


    constructor(nodeName: string, nodeDir: string, path: string, config: PluginConfig, packageInfo: PackageJson5) {
        this.mNodeName = nodeName;
        this.mNodeDir = nodeDir;
        this.mPath = path;
        this.mNodePath = path.substring(path.indexOf(nodeName), path.length).split(".ets")[0];
        this.mConfig = config;
        this.mPackageInfo = packageInfo;
    }


    public start(): void {
        if (this.mConfig.disablePlugin) {
            return;
        }
        const sourceCode = FileUtil.readFileSync(this.mPath).toString();
        Logger.info("start resolve sourceCode" + this.mPath);
        const sourceFile = ts.createSourceFile(this.mPath, sourceCode, ts.ScriptTarget.ES2021, false);
        ts.forEachChild(sourceFile, node => {
            this.resolveNode(node);
        });
        this.finalProcess();
    }

    // 最终处理
    private finalProcess() {
        if (!this.mResult?.annotation || !this.mResult?.path) {
            return;
        }

        // 默认值处理
        if (this.mResult.annotation === Constant.ANNOTATION_INTERCEPTOR) {
            this.mResult.singleton = true;
            if (!this.mResult.global) {
                this.mResult.global = false;
            }
            if (!this.mResult.priority) {
                this.mResult.priority = 0;
            }
        } else if (this.mResult.annotation === Constant.ANNOTATION_PAGE) {
            if (!this.mResult.interceptors) {
                this.mResult.interceptors = [];
            }
        }

        // 替换常量表达式
        const pageUrl = this.mResult.path as SpecializedType;
        if (pageUrl.type === "constant") {
            const path = this.resolveConstPath(pageUrl.name);
            if (path) {
                const constSourceFile = createSourceFile(path);
                if (constSourceFile) {
                    this.replaceConstant(constSourceFile, pageUrl);
                }
            }
        } else if (pageUrl.type === "object") {
            const path = this.resolveConstPath(pageUrl.name);
            if (path) {
                const constSourceFile = createSourceFile(path);
                if (constSourceFile) {
                    this.replaceObject(constSourceFile, pageUrl);
                }
            }
        }
        Logger.info("after final Process :" + JSON.stringify(this.mResult));
    }

    // 替换常量
    private replaceConstant(constSourceFile: ts.SourceFile, pageUrl: SpecializedType) {
        ts.forEachChild(constSourceFile, node => {
            if (!ts.isVariableStatement(node)) {
                return;
            }
            node.declarationList.declarations.forEach(declaration => {
                let key = declaration.name as ts.Identifier;
                if (key.escapedText.toString() == pageUrl.name) {
                    if (declaration.initializer && ts.isStringLiteral(declaration.initializer)) {
                        this.mResult!.path = (declaration.initializer as ts.StringLiteral).text;
                    }
                    return;
                }
            });
        });
    }

    private replaceObject(constSourceFile: ts.SourceFile, pageUrl: SpecializedType) {
        ts.forEachChild(constSourceFile, node => {
            if (!ts.isClassDeclaration(node) || node.name?.escapedText.toString() !== pageUrl.name) {
                return;
            }
            node.members.forEach(member => {
                // @ts-ignore
                if (member.name?.escapedText.toString() === pageUrl.property) {
                    // @ts-ignore
                    this.mResult!.path = member.initializer.text;
                    return
                };
            });
        });
    }

    // 查找常量代码路径
    private resolveConstPath(constName: string) {
        let path: string | undefined = undefined
        this.mImportMap.forEach((value, key) => {
            if (value.includes(constName)) {
                path = key + ".ets";
                return;
            }
        });
        if (!path) {
            return null;
        } else {
            const p: string = path!
            let depDir: string | undefined = undefined // 依赖模块路径
            if (p.includes("/")) {
                const pathRoot = p.split("/")[0]
                this.mPackageInfo.dependencies.forEach((value, key) => {
                    if (key === pathRoot) {
                        depDir = value.split("file:")[1];
                        return;
                    }
                });
            }
            let sourcePath: string | null = null;
            if (depDir) {
                // 跨模块常量
                sourcePath = FileUtil.pathResolve(this.mNodeDir, depDir + p.substring(p.indexOf("/"), p.length));
            } else {
                // 常量当前模块内部
                sourcePath = FileUtil.pathResolve(this.mPath.substring(0, this.mPath.lastIndexOf("/")), path)
            }
            Logger.info(`resolveConstPath ${constName} in ${sourcePath}`);
            return sourcePath;
        }
    }

    private resolveNode(node: ts.Node) {
        if (ts.isImportDeclaration(node)) {
            this.resolveImportDeclaration(node);
        } else if (ts.isMissingDeclaration(node)) {
            this.resolveMissingDeclaration(node);
        } else if (ts.isClassDeclaration(node)) {
            if (this.acceptClass(node))
                this.resolveClass(node);
        } else if (ts.isDecorator(node)) {
            this.resolveDecorator(node);
        } else if (ts.isCallExpression(node)) {
            this.resolveCallExpression(node);
        } else if (ts.isPropertyAssignment(node)) {
            return this.resolvePropertyAssignment(node);
        } else if (ts.isExpressionStatement(node)) {
            this.resolveExpressionStatement(node);
        } else if (ts.isPropertyAccessExpression(node)) {

        }
    }

    private resolveImportDeclaration(node: ts.ImportDeclaration) {
        let variableArr: string[] = [];
        node.importClause?.namedBindings?.forEachChild(child => {
            if (ts.isImportSpecifier(child)) {
                variableArr.push(child.name.escapedText!);
            }
        });
        variableArr.push(node.importClause?.name?.text!);
        let key = node.moduleSpecifier;
        if (ts.isModuleName(key)) {
            this.mImportMap.set(key.text, variableArr);
        }
    }

    private resolveMissingDeclaration(node: ts.MissingDeclaration) {
        this.mResult = {};
        node.forEachChild(child => this.resolveNode(child));
    }

    // 解析类声明
    private resolveClass(node: ts.ClassDeclaration) {
        this.mResult = {};

        const className = node.name?.escapedText;

        if (!className) {
            return;
        }

        // 类名赋值
        this.mResult.className = className;

        // 类解析开始
        node.modifiers?.forEach(modifier => {
            this.resolveNode(modifier);
        });
        // 类解析结束
        if (this.mResult.annotation) {
            this.mResult.name = node.name?.text;
        }

    }

    // 解析装饰器
    private resolveDecorator(node: ts.Decorator) {

        if (ts.isCallExpression(node.expression)) {
            const callExpression = node.expression as ts.CallExpression;
            if (ts.isIdentifier(callExpression.expression)) {
                this.switchIdentifier(callExpression);
            }
        }
    }

    // 解析调用表达式
    private resolveCallExpression(node: ts.CallExpression) {
        const identifier = node.expression as ts.Identifier
        // 解析参数
        node.arguments.flatMap((e: ts.Expression) => (e as ts.ObjectLiteralExpression).properties)
            .forEach((e: ts.ObjectLiteralElementLike) => {
                // 字面量对象
                this.parseConfig(e);
            });
    }


    // 解析声明表达式
    private resolveExpressionStatement(node: ts.ExpressionStatement) {
        if (ts.isIdentifier(node.expression)) {
            let identifier = node.expression as ts.Identifier;
            let identifierText = identifier.escapedText.toString();
            // 记录struct位置
            if (identifierText == 'struct') {
                this.mKeywordPos = node.end;
            }
            // 判断是连续的表达式
            if (this.mResult?.annotation === Constant.ANNOTATION[0] && this.mKeywordPos == node.pos) {
                this.mResult.name = identifierText;
            }
        }
    }

    private parseConfig(node: ts.ObjectLiteralElementLike) {
        const info = this.resolveNode(node) as NodeInfo;
        Logger.info("parseConfig" + JSON.stringify(info));
        if (this.mResult && info.key && info.value != null && info.value != undefined) {
            Reflect.set(this.mResult, info['key'], info['value']);
        }
    }

    // 注解参数
    private resolvePropertyAssignment(node: ts.PropertyAssignment): NodeInfo {
        const key = node.name as ts.StringLiteral;
        const initializer = node.initializer;
        let value: any = this.resolveProperty(initializer);
        return {
            key: key.text,
            value: value
        }
    }

    /**
     * 属性解析
     * @param initializer 
     * @returns 
     */
    private resolveProperty(initializer: ts.Expression) {
        let value: any = "";
        if (ts.isIdentifier(initializer)) {
            value = {
                type: "constant",
                name: initializer.escapedText.toString()
            };
        } else if (ts.isPropertyAccessExpression(initializer)) {
            value = {
                type: "object", // 对象
                name: (initializer.expression as Identifier).escapedText,
                property: initializer.name.escapedText
            };
        }
        else if (ts.isNumericLiteral(initializer)) {
            value = parseInt(initializer.text);
        } else if (ts.isStringLiteral(initializer)) {
            value = initializer.text;
        } else if (ts.isArrayLiteralExpression(initializer)) {
            value = initializer.elements.map(e => {
                return this.resolveProperty(e);
            });
        } else if (initializer.kind === ts.SyntaxKind.TrueKeyword) {
            value = true;
        } else if (initializer.kind === ts.SyntaxKind.FalseKeyword) {
            value = false;
        }
        return value;
    }

    private acceptClass(node: ts.ClassDeclaration) {
        return node.modifiers?.some(
            (item: any) => Constant.ANNOTATION.includes(item.expression?.expression?.text)
        )
    }

    private switchIdentifier(callExpression: ts.CallExpression) {
        const identifier = callExpression.expression as ts.Identifier;
        if (this.mResult && Constant.ANNOTATION.some(item => item === identifier.text)) {
            this.mResult.annotation = identifier.text;
            this.mResult.srcPath = this.mNodePath;
            this.resolveNode(callExpression);
        }
    }


    public getResult(): RouteInfo | undefined {
        this.checkResult();
        return this.mResult;
    }

    private checkResult() {
        const result = this.mResult;
        if (!result) {
            return;
        }
        if (!this.validateResult(result)) {
            this.mResult = undefined;
        }
    }


    private validateResult(result: RouteInfo) {
        return result.annotation != null && result.annotation != '' && result.name != null && result.name != '' && result.srcPath != null && result.srcPath != '';
    }
}



export interface RouteInfo {
    annotation?: string, // 注解
    name?: string, // 名称
    path?: AnnoArgType, // 路径
    srcPath?: string, // 源码路径
    className?: string, // 类名
    singleton?: boolean, // 单例标志
    interceptors?: string[], // 拦截器
    priority?: number, // 拦截器优先级
    global?: boolean // 全局拦截器标志
}

export interface SpecializedType {
    type: string,
    name: string,
    property?: string
}

export type AnnoArgType = string | number | boolean | SpecializedType

