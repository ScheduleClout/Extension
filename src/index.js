import './index.scss';
import {Utils} from "./constants/Utils";
import {initializeScheduler} from "./functions/initializeScheduler";
import {initializeProfileTab} from "./functions/initializeProfileTab";

Utils.initialize();

window.addEventListener('message', (event) => {
    const {id, payload} = event.data;

    if (id && typeof id === 'object' && 'type' in id) {
        switch (id.type) {
            case 'SIGN':
                chrome.storage.local.set({
                    SIGNED_TRANSACTION_HEX: 'signedTransactionHex' in payload ? payload['signedTransactionHex'] : undefined,
                });
                break;
            default:
                console.error('Unknown custom event');
                break;
        }
    }
});

const initializer = async () => {
    await Promise.all([
        initializeScheduler(),
        initializeProfileTab(),
    ]);

    await initializer();
};

initializer();