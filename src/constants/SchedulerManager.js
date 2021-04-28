import {Constants} from "./Constants";
import $ from "jquery";
import moment from "moment";

export const SchedulerManager = {
    initializeDOM() {
        this.$feed = $(Constants.SELECTORS.FEED._);
        this.$createPost = this.$feed.find(Constants.SELECTORS.FEED.CREATE_POST._);
        this.$textarea = this.$createPost.find(Constants.SELECTORS.FEED.CREATE_POST.TEXTAREA);
        this.$status = this.$createPost.find(Constants.SELECTORS.FEED.CREATE_POST.STATUS._);
        this.$scheduleWrap = this.$status.find(Constants.SELECTORS.FEED.CREATE_POST.STATUS.SCHEDULE_WRAP._);
        this.$datetime = this.$scheduleWrap.find(Constants.SELECTORS.FEED.CREATE_POST.STATUS.SCHEDULE_WRAP.DATETIME_INPUT);
    },
    setMessage(message, isError = false) {
        const selector = Constants.SELECTORS.FEED.CREATE_POST.STATUS.MESSAGE,
            template = Constants.TEMPLATES.MESSAGE(message, isError);

        if (message === undefined) {
            this.$status.find(selector).remove();
            return;
        }

        if (this.$status.find(selector).length > 0)
            this.$status.find(selector).remove();

        this.$status.prepend(template);
    },
    enableScheduleButton() {
        $(Constants.SELECTORS.FEED.CREATE_POST.STATUS.POST_BUTTON).hide();
        $(Constants.SELECTORS.FEED.CREATE_POST.STATUS.SCHEDULE_BUTTON).show();
    },
    disableScheduleButton() {
        $(Constants.SELECTORS.FEED.CREATE_POST.STATUS.POST_BUTTON).show();
        $(Constants.SELECTORS.FEED.CREATE_POST.STATUS.SCHEDULE_BUTTON).hide();
    },
    setDatetimeValue(value) {
        let getMessage = chrome.i18n.getMessage,
            now = new Date();

        if (!value || value < now) {
            let message = !value ? undefined : getMessage('invalidDatetime');

            this.setMessage(message, true);
            this.disableScheduleButton();

            this.$datetime.val(undefined);
        } else {
            let message = chrome.i18n.getMessage('publish').replace('%MESSAGE%', moment(value).fromNow());

            this.setMessage(message, false);
            this.enableScheduleButton();
        }
    },
    setTextareaValue(value) {
        const inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true,
        });

        this.$textarea.val(value).get(0).dispatchEvent(inputEvent);
    },
    getBodyObjAndResetForm() {
        const BodyObj = {
            Body: this.$textarea.val(),
            ImageURLs: [],
            Images: []
        };

        const $image = this.$createPost.find(Constants.SELECTORS.FEED.CREATE_POST.IMAGE),
            $delete = this.$createPost.find(Constants.SELECTORS.FEED.CREATE_POST.IMAGE_DELETE),
            src = $image.attr('src');

        if (src.length > 0) {
            BodyObj.Images.push(src);
            $delete.trigger('click');
        }

        this.setTextareaValue(undefined);
        this.setDatetimeValue(undefined);

        return BodyObj;
    }
};

