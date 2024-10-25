import {FileUtil} from '@ohos/hvigor';
import {Constant} from './common/Constant';
import {Logger} from './common/Logger';

export interface PluginConfig{
    disablePlugin?:boolean,
    root?:string,
    dirs?:string[]
}

export function readPluginConfig(dir:string):PluginConfig{
    let dirLevel = 0;
    let configPath:string|undefined = undefined;
    while(dirLevel<4){
        let path = FileUtil.pathResolve(dir,Constant.PARENT_DIR.repeat(dirLevel)+Constant.CONFIG_FILE_NAME);
        if (FileUtil.exist(path)){
            configPath = path;
            break;
        }
        dirLevel++;
    }
    let config = {}
    if(configPath){
        config = FileUtil.readJson5(configPath);
    }
    return config;

}