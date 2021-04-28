import {Crypto} from "./Crypto";

const EncryptionKey = async () => new Promise(resolve => {
        let callback = ({encryptionKey}) => resolve(encryptionKey);
        chrome.storage.local.get(['encryptionKey'], callback);
    }),
    SubmitPost = async data => {
        let response = await fetch(`https://${process.env.NODE_API_HOSTNAME}/submit-post`, {
                method: 'POST',
                headers: new Headers({
                    'content-type': 'application/json'
                }),
                body: JSON.stringify(data),
            }),
            text = JSON.parse(await response.clone().text());

        return 'TransactionHex' in text ? text.TransactionHex : undefined;
    },
    SignTransactionHex = (encryptedSeedHex, transactionHex, privateKey) => {
        const transactionBytes = new Buffer(transactionHex, 'hex'),
            transactionHash = new Buffer(sha256.x2(transactionBytes), 'hex'),
            signature = privateKey.sign(transactionHash),
            signatureBytes = new Buffer(signature.toDER()),
            signatureLength = Crypto.uintToBuf(signatureBytes.length);

        const signedTransactionBytes = Buffer.concat([
            // This slice is bad. We need to remove the existing signature length field prior to appending the new one.
            // Once we have frontend transaction construction we won't need to do this.
            transactionBytes.slice(0, -1),
            signatureLength,
            signatureBytes,
        ]);

        return signedTransactionBytes.toString('hex');
    },
    SubmitTransaction = async (encryptedSeedHex, transactionHex, privateKey) => {
        await fetch(`https://${process.env.NODE_API_HOSTNAME}/submit-transaction`, {
            method: 'POST',
            headers: new Headers({
                'content-type': 'application/json'
            }),
            body: JSON.stringify({
                TransactionHex: await SignTransactionHex(encryptedSeedHex, transactionHex, privateKey)
            }),
        })
    };

export const BitClout = {
    /**
     * @param post
     * @constructor
     */
    async Submit(post) {
        const {encryptedSeedHex, data} = post,
            [transactionHex, encryptionKey] = await Promise.all([
                SubmitPost(data),
                EncryptionKey()
            ]),
            privateKey = Crypto.encryptedSeedHexToPrivateKey(encryptedSeedHex, encryptionKey);

        return SubmitTransaction(encryptedSeedHex, transactionHex, privateKey);
    }
};
