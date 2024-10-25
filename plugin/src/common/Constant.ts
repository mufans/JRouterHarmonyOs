export class Constant {

    public static readonly HAP_PLUGIN_ID = 'HAP_ROUTER_PLUGIN'
    public static readonly HSP_PLUGIN_ID = 'HSP_ROUTER_PLUGIN'
    public static readonly HAR_PLUGIN_ID = 'HAR_ROUTER_PLUGIN'

    // 上一级目录
    public static readonly PARENT_DIR = "../"
    // 配置文件
    public static readonly CONFIG_FILE_NAME: string = "router_config.json5"

    public static readonly SCAN_FILE_SUFFIX = ".ets"

    // 注解类型
    public static readonly ANNOTATION_PAGE = "JRouter";

    public static readonly ANNOTATION_INTERCEPTOR = "JRouterInterceptor";

    public static readonly ANNOTATION_PROVIDER = "JProvider";

    public static readonly ANNOTATION = ["JRouter", "JRouterInterceptor", "JProvider"]

    public static readonly TEMPLATE_FILE = "routemap.tpl"
    
    public static readonly TEMPLATE_SRC_ROOT_PATH = "src/main/ets"

    public static readonly TEMPLATE_OUTPUT_PATH = "src/main/ets/generate/routemap.ets"

    public static readonly ROUTE_MAP_OUTPUT_PATH = "src/main/resources/rawfile/routemap.json"

    public static readonly PAGE = "PAGE"

    public static readonly PROVIDER = "PROVIDER"

    public static readonly INTERCEPTOR = "INTERCEPTOR"

    public static readonly ANN_MAPPER: Map<string, string> = new Map([["JRouter", "PAGE"], ["JRouterInterceptor", "INTERCEPTOR"], ["JProvider", "PROVIDER"]])

}