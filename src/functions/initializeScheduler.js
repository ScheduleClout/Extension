import $ from 'jquery';
import {Constants} from "../constants/Constants";

export const initializeScheduler = async () => {
    const $feed = $(Constants.SELECTORS.FEED._);

    if ($feed.length === 0 || $feed.hasClass('initialized'))
        return;

    const $createPost = $feed.find(Constants.SELECTORS.FEED.CREATE_POST._),
        $status = $createPost.find(Constants.SELECTORS.FEED.CREATE_POST.STATUS._),
        $imageIcon = $status.find(Constants.SELECTORS.FEED.CREATE_POST.STATUS.IMAGE_ICON);

    $imageIcon.after(Constants.TEMPLATES.SCHEDULE_WRAP);

    let label = chrome.i18n.getMessage('scheduleButton');
    $status.append(Constants.TEMPLATES.SCHEDULE_BUTTON(label));

    $feed.addClass('initialized');
};
