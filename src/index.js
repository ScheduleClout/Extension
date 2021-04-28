import './index.scss';
import {Utils} from "./constants/Utils";
import {initializeScheduler} from "./functions/initializeScheduler";
import {initializeProfileTab} from "./functions/initializeProfileTab";
import {setEncryptionKey} from "./functions/setEncryptionKey";
import {SchedulerManager} from "./constants/SchedulerManager";
import {Listeners} from "./constants/Listeners";

Utils.initialize();
Listeners.initialize();

Utils.on(() => [
    setEncryptionKey(),
    SchedulerManager.initializeDOM(),
    initializeScheduler(),
    initializeProfileTab(),
]);
