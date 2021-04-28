import {Crypto} from "../constants/Crypto";

export const setEncryptionKey = () => {
    if (window.location.hostname === 'identity.bitclout.com') {
        const encryptionKey = Crypto.seedHexEncryptionKey(process.env.NODE_HOSTNAME);

        chrome.storage.local.set({encryptionKey});
    }
};
