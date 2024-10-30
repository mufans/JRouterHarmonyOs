export class TemplateModel{
    routeMapName:string // 路由表名称
    route:TemplateRoute[] // 路由
    entryImport:EntryImport[] // 入口导包
    routeImport:TemplateImport[] // 导包
    constructor(routeMapName:string,route:TemplateRoute[],routeImport:TemplateImport[],entryImport:EntryImport[]=[]){
        this.routeMapName  = routeMapName;
        this.route = route;
        this.routeImport = routeImport;
        this.entryImport = entryImport;
    }
}


export interface TemplateRoute{
    srcPath:string,
    type:string,
    path:string,
    factory?:string,
    singleton?:boolean,
    interceptors?:string,
    global?:boolean,
    priority?:number
}

export interface TemplateImport{
    name:string,
    srcPath:string
}

export interface EntryImport{
    srcPath:string
}