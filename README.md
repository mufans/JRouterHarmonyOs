# JRouterHarmonyOs

鸿蒙路由框架，使用hvigor插件代码生成模版，支持跨模块通信，实现代码解耦。

### 功能

- 跨模块命名路由跳转（基于**@ohos.router**)
- 自定义拦截器，支持全局和指定拦截器注册
- SPI服务发现



### 配置

1. 项目**hvigor**目录下新建**hvigor-config.json** 文件, 添加插件依赖

   ```ts
   {
     "modelVersion": "5.0.0",
     "dependencies": {
       "@mufans/router-plugin": "file:../plugin/lib/mufans-router-plugin-1.0.0.tgz" // 插件包
     },
     "execution": {
       // "daemon": true,                          /* Enable daemon compilation. Default: true */
       // "incremental": true,                     /* Enable incremental compilation. Default: true */
       // "parallel": true,                        /* Enable parallel compilation. Default: true */
       // "typeCheck": false,                      /* Enable typeCheck. Default: false */
     },
     "logging": {
       // "level": "info"                          /* Define the log level. Value: [ "debug" | "info" | "warn" | "error" ]. Default: "info" */
     },
     "debugging": {
       // "stacktrace": false                      /* Disable stacktrace compilation. Default: false */
     }
   }
   ```

   

2. 在模块的**hvigorfile.ts**文件中添加对应插件

   ```ts
   import { harTasks } from '@ohos/hvigor-ohos-plugin';
   import {hapPlugin} from '@mufans/router-plugin';
   export default {
       system: harTasks,  /* Built-in plugin of Hvigor. It cannot be modified. */
       plugins:[hapPlugin()]         /* Custom plugin to extend the functionality of Hvigor. */
   }
   
   import { harTasks } from '@ohos/hvigor-ohos-plugin';
   import {harPlugin} from '@mufans/router-plugin';
   export default {
       system: harTasks,  /* Built-in plugin of Hvigor. It cannot be modified. */
       plugins:[harPlugin()]         /* Custom plugin to extend the functionality of Hvigor. */
   }
   
   import { harTasks } from '@ohos/hvigor-ohos-plugin';
   import {hspPlugin} from '@mufans/router-plugin';
   export default {
       system: harTasks,  /* Built-in plugin of Hvigor. It cannot be modified. */
       plugins:[hspPlugin()]         /* Custom plugin to extend the functionality of Hvigor. */
   }
   ```

   

3. 在项目根目录或者模块目录添加配置文件 **router_config.json ** , 插件优先读取当前目录的配置

```json
{
  disablePlugin: false, // 是否禁用插件
  root: 'demo', // 模块的根目录，默认目录无需配置
  dirs: ['src/main/ets/components'] // 添加源码扫描目录，提升构建性能
}
```



4. 添加路由库依赖

```json
 { 
   "devDependencies": {
    "@mufans/jrouter": "file:./libRouter"
  }
 }
```



### 装饰器

1. **@JRouter** 标识页面路由

   参数说明:

   **path** : 页面路由唯一路径，支持常量

   **interceptors**: 指定拦截器，不设置使用全局拦截器

   ```ts
   @JRouter({ path: TEST_PAGE,interceptors:["SpecialInterceptor"] })
   @Entry({ routeName: TEST_PAGE })
   @Component
   export struct MainPage {
   }
   ```

   

2. **@JRouterInterceptor** 标识拦截器

   参数说明:

   **path** : 唯一标识，支持常量

   **global**: 标识全局拦截器

   **priority:** 拦截器优先级

   ```ts
   @JRouterInterceptor({path:"SpecialInterceptor",global:false,priority:100})
   export class SpecialInterceptor implements IInterceptor {
     async intercept(options: NamedRouterOptions): Promise<InterceptorResult> {
       console.log("SpecialInterceptor..........")
       ToastUtil.showToast(`${options.name} intercepted by SpecialInterceptor `)
       return {
         terminal: true, // terminal 为true表示行为终止，不会执行后续的拦截器和页面跳转
         options: options // 路由参数，多个拦截器可以修改参数实现多层级aop的功能
       }
     }
   }
   ```

   

3. **@JProvider** 标识服务接口

   参数说明:

   **path** : 唯一标识，支持常量

   **singleton:** 标识是否单例

   ```ts
   @JProvider({
     path: "TestService2",
     singleton: true,
   })
   export class TestService2Impl implements ITestService2{
     execute(): void {
       console.log("TestService2 ......")
       ToastUtil.showToast(`TestService2Impl execute `)
     }
   }
   ```



### 编译

执行项目构建后，插件会执行以下操作

- 读取配置，遍历包含装饰器的代码，生成路由表。

- 在模块 **generate**目录下生成 **routemap.ets**,  用于运行时注册路由表。 
- 在hap模块的rawFile目录中生成合并后的路由表**routemap.json**, 用来运行时构建路由表。



### 使用

1. 在EntryAbility中初始化路由框架	

```ts
    RouterWrapper.init(this.context, {
      entry: () => {
        // routeMap为hap generate下的routemap, 框架使用了动态导入实现命名路由，由于hap无法被其他模块引用，所以这里手动添加
        return routeMap; 
      }
    });
```

2. 页面跳转

```ts
RouterWrapper.pushNamedRoute({ name: "test_page" });
```

3. SPI

```ts
// 定义接口
export interface ITestService2 {
  execute(): void
}

// 实现接口
@JProvider({
  path: "TestService2",
  singleton: true,
})
export class TestService2Impl implements ITestService2{
  execute(): void {
    console.log("TestService2 ......")
    ToastUtil.showToast(`TestService2Impl execute `)
  }

}
// 获取接口
RouterWrapper.findServiceAsync<ITestService2>("TestService2").then((service) => {service?.execute();});
```

4. 拦截器

```ts
@JRouterInterceptor({path:"SpecialInterceptor",priority:100})
export class SpecialInterceptor implements IInterceptor {
  async intercept(options: NamedRouterOptions): Promise<InterceptorResult> {
    console.log("SpecialInterceptor..........")
    ToastUtil.showToast(`${options.name} intercepted by SpecialInterceptor `)
    return {
      terminal: true, // terminal 为true表示行为终止，不会执行后续的拦截器和页面跳转
      options: options // 路由参数，多个拦截器可以修改参数实现多层级aop的功能
    }
  }
}
```



### 参考项目

-------------

- [HMRouter](https://gitee.com/hadss/hmrouter)