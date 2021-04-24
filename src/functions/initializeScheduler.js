import $ from 'jquery';
import moment from "moment";
import {Constants} from "../constants/Constants";
import {Utils} from "../constants/Utils";

export const initializeScheduler = async () => {
    const $feed = await Utils.waitForElement(Constants.SELECTORS.FEED._);

    if ($feed.hasClass('initialized') || $feed.hasClass('processing'))
        return;

    $feed.addClass('processing');

    const $createPost = $feed.find(Constants.SELECTORS.FEED.CREATE_POST._),
        $textarea = $createPost.find(Constants.SELECTORS.FEED.CREATE_POST.TEXTAREA);

    const $status = $createPost.find(Constants.SELECTORS.FEED.CREATE_POST.STATUS._),
        $imageIcon = $status.find(Constants.SELECTORS.FEED.CREATE_POST.STATUS.IMAGE_ICON);

    $imageIcon.after(Constants.TEMPLATES.SCHEDULE_WRAP);

    let label = chrome.i18n.getMessage('scheduleButton');
    $status.append(Constants.TEMPLATES.SCHEDULE_BUTTON(label));

    const $scheduleWrap = $status.find(Constants.SELECTORS.FEED.CREATE_POST.STATUS.SCHEDULE_WRAP._),
        $datetime = $scheduleWrap.find(Constants.SELECTORS.FEED.CREATE_POST.STATUS.SCHEDULE_WRAP.DATETIME_INPUT);

    const setMessage = (message, isError = false) => {
            const selector = Constants.SELECTORS.FEED.CREATE_POST.STATUS.MESSAGE,
                template = Constants.TEMPLATES.MESSAGE(message, isError);

            if (message === undefined) {
                $status.find(selector).remove();
                return;
            }

            if ($status.find(selector).length > 0)
                $status.find(selector).remove();

            $status.prepend(template);
        },
        enableScheduleButton = () => {
            $(Constants.SELECTORS.FEED.CREATE_POST.STATUS.POST_BUTTON).hide();
            $(Constants.SELECTORS.FEED.CREATE_POST.STATUS.SCHEDULE_BUTTON).show();
        },
        disableScheduleButton = () => {
            $(Constants.SELECTORS.FEED.CREATE_POST.STATUS.POST_BUTTON).show();
            $(Constants.SELECTORS.FEED.CREATE_POST.STATUS.SCHEDULE_BUTTON).hide();
        },
        setDatetimeValue = (value) => {
            let getMessage = chrome.i18n.getMessage,
                now = new Date();

            if (!value || value < now) {
                let message = !value ? undefined : getMessage('invalidDatetime');

                setMessage(message, true);
                disableScheduleButton();

                $datetime.val(undefined);
            } else {
                let message = chrome.i18n.getMessage('publish').replace('%MESSAGE%', moment(value).fromNow());

                setMessage(message, false);
                enableScheduleButton();
            }
        },
        setTextareaValue = (value) => {
            const inputEvent = new Event('input', {
                bubbles: true,
                cancelable: true,
            });

            $textarea.val(value).get(0).dispatchEvent(inputEvent);
        },
        getBodyObjAndResetForm = () => {
            const BodyObj = {
                Body: $textarea.val(),
                ImageURLs: [],
                Images: []
            };

            const $image = $createPost.find(Constants.SELECTORS.FEED.CREATE_POST.IMAGE),
                $delete = $createPost.find(Constants.SELECTORS.FEED.CREATE_POST.IMAGE_DELETE),
                src = $image.attr('src');

            if (src.length > 0) {
                BodyObj.Images.push(src);
                $delete.trigger('click');
            }

            setTextareaValue(undefined);
            setDatetimeValue(undefined);

            return BodyObj;
        };

    $datetime.on('change', () => {
        let value = $datetime.val();

        if (value !== undefined)
            setDatetimeValue(new Date(value));
    });

    $(Constants.SELECTORS.FEED.CREATE_POST.STATUS.SCHEDULE_BUTTON).on('click', () => {
        let value = $datetime.val();
        if (value === undefined)
            return;

        let publicKey = JSON.parse(localStorage.getItem('lastLoggedInUser')),
            encryptedSeedHex = publicKey ? JSON.parse(localStorage.getItem('identityUsers'))[publicKey].encryptedSeedHex : undefined;

        if (publicKey && encryptedSeedHex)
            chrome.runtime.sendMessage({
                type: 'ADD_POST',
                data: {
                    UpdaterPublicKeyBase58Check: publicKey,
                    PostHashHexToModify: "",
                    ParentStakeID: "",
                    Title: "",
                    BodyObj: getBodyObjAndResetForm(),
                    RecloutedPostHashHex: "",
                    Sub: "",
                    CreatorBasisPoints: 0,
                    StakeMultipleBasisPoints: 12500,
                    IsHidden: false,
                    MinFeeRateNanosPerKB: 1000
                },
                user: {
                    publicKey,
                    encryptedSeedHex
                },
                publishAt: value,
                uuid: Utils.uuid()
            });
    });

    $createPost.on('click', 'a[data-action="cancel"]', () => setDatetimeValue(undefined));

    $feed.removeClass('processing');
    $feed.addClass('initialized');
};