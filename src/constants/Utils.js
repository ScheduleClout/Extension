import {Tick} from "./Tick";
import {Constants} from "./Constants";

export const Utils = {
    initialize() {
        setInterval(() => dispatchEvent(Tick), Constants.INTERVAL.TIMEOUT);
    },
    /**
     * @param callback {Function}
     * @param eventName {string}
     */
    on(callback, eventName = Constants.INTERVAL.EVENT_NAME) {
        addEventListener(eventName, callback);
    },
    /**
     * @param callback {Function}
     * @param eventName {string}
     */
    off(callback, eventName = Constants.INTERVAL.EVENT_NAME) {
        removeEventListener(eventName, callback);
    },
    /**
     * @param callback {Function}
     * @param value {*}
     * @return {Promise<void>}
     */
    for(callback, value = true) {
        return new Promise(resolve => {
            const listener = () => {
                if (callback() !== value)
                    return;

                resolve();
                this.off(listener);
            };

            this.on(listener);
        })
    },
    /**
     * @return {string}
     */
    uuid() {
        const s4 = () => Math.floor(Math.random() * 65536).toString(16).padStart(4, '0');

        return s4() + s4() + '-' + s4() + '-' + "4" + s4().substr(1) + '-' + s4() + '-' + s4() + s4() + s4();
    },
    /**
     * @return {string|undefined}
     */
    publicKey() {
        let item = localStorage.getItem('lastLoggedInUser');
        return item ? JSON.parse(item) : undefined;
    },
    /**
     * @param publicKey {string|null}
     * @return {string|undefined}
     */
    encryptedSeedHex(publicKey = null) {
        if (!publicKey)
            publicKey = Utils.publicKey();

        let item = localStorage.getItem('identityUsers');
        return item ? JSON.parse(item)[publicKey].encryptedSeedHex : undefined;
    }
};
