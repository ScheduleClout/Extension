import $ from 'jquery';
import {Tick} from "./Tick";
import {Constants} from "./Constants";

export const Utils = {
    initialize: () => {
        setInterval(() => dispatchEvent(Tick), Constants.INTERVAL.TIMEOUT);
    },
    onTick: (callback) => {
        addEventListener(Constants.INTERVAL.EVENT_NAME, callback);
    },
    waitFor: async (callback, value = true) => new Promise((resolve) => {
        const listener = () => {
            if (callback() !== value)
                return;

            resolve();
            removeEventListener(Constants.INTERVAL.EVENT_NAME, listener);
        };

        addEventListener(Constants.INTERVAL.EVENT_NAME, listener);
    }),
    waitForElement: async (selector) => {
        await Utils.waitFor(() => $(selector).length > 0);
        return $(selector);
    },
    uuid() {
        const s4 = () => Math.floor(Math.random() * 65536).toString(16).padStart(4, '0');

        return s4() + s4() + '-' + s4() + '-' + "4" + s4().substr(1) + '-' + s4() + '-' + s4() + s4() + s4();
    }
};