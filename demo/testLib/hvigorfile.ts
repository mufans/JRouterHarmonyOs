import { harTasks } from '@ohos/hvigor-ohos-plugin';
import {harPlugin} from '@mufans/router-plugin';
export default {
    system: harTasks,  /* Built-in plugin of Hvigor. It cannot be modified. */
    plugins:[harPlugin()]         /* Custom plugin to extend the functionality of Hvigor. */
}