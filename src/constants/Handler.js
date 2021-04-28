import Swal from "sweetalert2";
import {SchedulerManager} from "./SchedulerManager";
import {Utils} from "./Utils";

export const Handler = {
    cancel() {
        SchedulerManager.setDatetimeValue(undefined);
    },
    schedule() {
        let value = SchedulerManager.$datetime.val();
        if (value === undefined)
            return;

        let publicKey = Utils.publicKey(),
            encryptedSeedHex = Utils.encryptedSeedHex();

        if (publicKey && encryptedSeedHex) {
            chrome.runtime.sendMessage({
                type: 'ADD_POST',
                data: {
                    UpdaterPublicKeyBase58Check: publicKey,
                    PostHashHexToModify: "",
                    ParentStakeID: "",
                    Title: "",
                    BodyObj: SchedulerManager.getBodyObjAndResetForm(),
                    RecloutedPostHashHex: "",
                    Sub: "",
                    CreatorBasisPoints: 0,
                    StakeMultipleBasisPoints: 12500,
                    IsHidden: false,
                    MinFeeRateNanosPerKB: 1000
                },
                publicKey,
                encryptedSeedHex,
                publishAt: value,
                uuid: Utils.uuid()
            });

            let title = chrome.i18n.getMessage('scheduledAlertTitle'),
                description = chrome.i18n.getMessage('scheduledAlertDescription');

            Swal.fire(title, description, 'success')
        }
    },
    remove($element) {
        const $post = $element.parents('[data-sid]'),
            sid = $post.attr('data-sid');

        chrome.runtime.sendMessage({type: 'REMOVE_POST', uuid: sid});
        $post.remove();

        let title = chrome.i18n.getMessage('cancelledAlertTitle'),
            description = chrome.i18n.getMessage('cancelledAlertDescription');

        Swal.fire(title, description, 'success');
    }
};
