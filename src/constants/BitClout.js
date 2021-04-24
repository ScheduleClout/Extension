import {Constants} from "./Constants";

// @todo this file needs to be rewritten

const waitForTabByUrl = async (window, url) => {
        let callback = tab => tab.url === url || tab.pendingUrl === url;
        await forCallback(() => window.tabs.filter(callback).length > 0);

        let filter = window.tabs.filter(callback),
            tab = filter.length > 0 ? filter[0] : undefined;

        await forTab(tab);

        return {tab, window};
    },
    forTab = async (tab) => {
        tab = await chrome.tabs.get(tab.id);

        if (tab.status !== 'complete')
            return forTab(tab);

        return true;
    },
    forCallback = (callback) => new Promise((resolve) => {
        let interval = setInterval(() => {
            if (callback()) {
                clearInterval(interval);
                resolve();
            }
        }, Constants.INTERVAL.TIMEOUT);
    }),
    createWindow = () => new Promise(resolve => {
        let url = 'https://www.bitclout.com/';

        chrome.windows.create({
            url,
            focused: false,
            state: 'minimized'
        }, async (window) => {
            console.log({window});
            resolve(await waitForTabByUrl(window, url));
        })
    });

export const BitClout = {
    target: undefined,
    async SubmitPost(post) {
        let response = await fetch('https://api.bitclout.com/submit-post', {
                method: 'POST',
                headers: new Headers({
                    'content-type': 'application/json'
                }),
                body: JSON.stringify(post.data),
            }),
            text = JSON.parse(await response.clone().text());

        return 'TransactionHex' in text ? text.TransactionHex : undefined;
    },
    async SignTransactionHex(encryptedSeedHex, transactionHex) {
        chrome.storage.local.set({encryptedSeedHex, transactionHex});

        chrome.scripting.executeScript({
            function: () => {
                chrome.storage.local.get(['encryptedSeedHex', 'transactionHex'], function ({encryptedSeedHex, transactionHex}) {
                    document.getElementById('identity').contentWindow.postMessage({
                        id: {
                            type: 'SIGN',
                        },
                        method: 'sign',
                        payload: {
                            encryptedSeedHex,
                            transactionHex
                        }
                    }, '*');
                });

                return true;
            },
            target: this.target
        });

        let key = `SIGNED_TRANSACTION_HEX`,
            signedTransactionHex = undefined;

        while (!signedTransactionHex) {
            signedTransactionHex = await new Promise(resolve => {
                chrome.storage.local.get([key], value => {
                    if (value[key]) {
                        resolve(value[key]);
                        return;
                    }

                    resolve(undefined);
                });
            })
        }

        await new Promise(resolve => chrome.storage.local.remove(key, () => resolve()));

        return signedTransactionHex;
    },
    async SubmitTransaction(encryptedSeedHex, transactionHex) {
        await fetch('https://api.bitclout.com/submit-transaction', {
            method: 'POST',
            headers: new Headers({
                'content-type': 'application/json'
            }),
            body: JSON.stringify({
                TransactionHex: await this.SignTransactionHex(encryptedSeedHex, transactionHex)
            }),
        })
    },
    async Submit(post) {
        let {tab, window} = await createWindow();
        this.target = {tabId: tab.id};

        let encryptedSeedHex = post.user.encryptedSeedHex,
            transactionHex = await this.SubmitPost(post);

        if (!encryptedSeedHex || !transactionHex)
            return;

        await this.SubmitTransaction(encryptedSeedHex, transactionHex);

        chrome.windows.remove(window.id);
    }
};