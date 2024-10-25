import { hapTasks } from '@ohos/hvigor-ohos-plugin';
import {hapPlugin} from '@mufans/router-plugin';

export default {
    system: hapTasks,  /* Built-in plugin of Hvigor. It cannot be modified. */
    plugins:[hapPlugin()]         /* Custom plugin to extend the functionality of Hvigor. */
}


