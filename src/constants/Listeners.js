import $ from "jquery";
import {Handler} from "./Handler";
import {Constants} from "./Constants";
import {SchedulerManager} from "./SchedulerManager";

const dataActionListener = () => {
        let attributeName = 'data-action',
            selector = `[${attributeName}]`;

        $(document).on('click', selector, (event) => {
            const $target = $(event.target),
                $element = $target.is(selector) ? $target : $target.parents(selector),
                action = $element.attr(attributeName);

            switch (action) {
                case 'schedule':
                    Handler.schedule();
                    break;
                case 'cancel':
                    Handler.cancel();
                    break;
                case 'remove':
                    Handler.remove($element);
                    break;
            }
        });
    },
    dateTimeChangeListener = () => {
        let selector = Constants.SELECTORS.FEED.CREATE_POST.STATUS.SCHEDULE_WRAP.DATETIME_INPUT;
        $(document).on('change', selector, (event) => {
            let value = $(event.target).val();

            if (value !== undefined)
                SchedulerManager.setDatetimeValue(new Date(value));
        });
    };

export const Listeners = {
    initialize() {
        dataActionListener();
        dateTimeChangeListener();
    }
};
