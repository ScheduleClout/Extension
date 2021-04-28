import {Buffer} from 'buffer';
import {ec as EC} from 'elliptic';
import {createDecipher, randomBytes} from "crypto";

export const Crypto = {
    decryptSeedHex(encryptedSeedHex, encryptionKey) {
        const decipher = createDecipher('aes-256-gcm', encryptionKey);

        return decipher.update(Buffer.from(encryptedSeedHex, 'hex')).toString();
    },
    seedHexToPrivateKey(seedHex) {
        const ec = new EC('secp256k1');
        return ec.keyFromPrivate(seedHex);
    },
    encryptedSeedHexToPrivateKey(encryptedSeedHex, encryptionKey) {
        const seedHex = this.decryptSeedHex(encryptedSeedHex, encryptionKey);
        return this.seedHexToPrivateKey(seedHex);
    },
    newEncryptionKey() {
        return randomBytes(32).toString('hex');
    },
    seedHexEncryptionKey(hostname) {
        const storageKey = `seed-hex-key-${hostname}`;
        let encryptionKey = localStorage.getItem(storageKey);

        if (!encryptionKey) {
            encryptionKey = this.newEncryptionKey();
            localStorage.setItem(storageKey, encryptionKey);
        }

        // If the encryption key is unset or malformed we need to stop
        // everything to avoid returning unencrypted information.
        if (!encryptionKey || encryptionKey.length !== 64) {
            throw new Error('Failed to load or generate encryption key; this should never happen');
        }

        return encryptionKey;
    },
    uintToBuf(uint) {
        const result = [];

        while (uint >= 0x80) {
            result.push((uint & 0xFF) | 0x80);
            uint >>>= 7;
        }

        result.push(uint | 0);

        return new Buffer(result);
    }
};
