import './index.scss';
import {Utils} from "./constants/Utils";
import {initializeScheduler} from "./functions/initializeScheduler";
import {initializeProfileTab} from "./functions/initializeProfileTab";
import {setEncryptionKey} from "./functions/setEncryptionKey";

Utils.initialize();
Utils.on(() => [
    setEncryptionKey(),
    initializeScheduler(),
    initializeProfileTab(),
]);
