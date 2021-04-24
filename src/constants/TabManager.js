import $ from 'jquery';
import {Constants} from "./Constants";

export const TabManager = {
    attributeName: {
        tab: 'data-tab',
        content: 'data-tab-content'
    },
    tabs: {
        registered: {},
        custom: () => $(`${Constants.SELECTORS.PROFILE._} ${Constants.SELECTORS.PROFILE.TABS._}`),
        default: () => $(`${Constants.SELECTORS.PROFILE._} ${Constants.SELECTORS.PROFILE.TABS._} ${Constants.SELECTORS.PROFILE.TABS.TAB}`)
    },
    defaultClassNames: {
        label: {
            active: 'fc-default',
            inactive: 'fc-muted'
        },
        underline: {
            active: 'tab-underline-active',
            inactive: 'tab-underline-inactive',
        }
    },
    previousTabIndex: 0,
    async initialize() {
        const selector = `[${this.attributeName.tab}]`;

        $(document).on('click', selector, (event) => {
            const $target = $(event.target),
                $tab = $target.attr(this.attributeName.tab) ? $target : $target.parents(selector),
                tab = $tab.attr(this.attributeName.tab);

            TabManager.activateCustomTab(tab);
        });

        this.tabs.default().on('click', (event) => {
            const $target = $(event.target),
                selector = '.flex-column',
                $tab = $target.hasClass(selector) ? $target : $target.parents(selector);

            TabManager.activateDefaultTab($tab);
        });
    },
    register(name, label, callback) {
        const template = $(Constants.TEMPLATES.TAB_HEADING(name, label));

        this.tabs.custom().append(template);
        this.tabs.registered[name] = {label, callback};
    },
    async customTabContent(name) {
        const selector = `[${this.attributeName.content}]`,
            $wrap = $(Constants.SELECTORS.PROFILE.TABS.SELECTOR).parent();

        let html = await this.tabs.registered[name].callback();

        if (!html) {
            let message = chrome.i18n.getMessage("noContent");
            html = Constants.TEMPLATES.TAB_CONTENT_EMPTY(message);
        }

        if ($wrap.find(selector).length === 0) {
            const template = Constants.TEMPLATES.TAB_CONTENT,
                $template = $(template),
                $element = $template.is(selector) ? $template : $($template.find(selector));

            $element.html(html);
            $wrap.append($element);
        } else {
            $wrap.find(selector).html(html).show();
        }
    },
    hideCustomTabContent() {
        const selector = `[${this.attributeName.content}]`,
            $wrap = $(Constants.SELECTORS.PROFILE.TABS.SELECTOR).parent();

        $wrap.find(selector).remove();
    },
    toggleCustomTab(tab, active) {
        const $tab = this.tabs.custom().find(`[${this.attributeName.tab}=${tab}]`),
            label = $tab.attr('data-label'),
            template = Constants.TEMPLATES.TAB_HEADING(tab, label, active);

        $tab.replaceWith(template);
    },
    activateCustomTab(tab) {
        this.tabs.default().each((index, element) => {
            let $element = $(element),
                selector = '.tab-underline-active';

            if ($element.find(selector).length > 0) {
                this.previousTabIndex = index;
                this.deactivateDefaultTab($element);
            }
        });

        this.toggleCustomTab(tab, true);
        this.customTabContent(tab);
    },
    deactivateCustomTab(tab) {
        this.toggleCustomTab(tab, false);
    },
    toggleDefaultTab($element, from, to) {
        let classNames = this.defaultClassNames;

        $element.find(`.${classNames.underline[from]}`).removeClass(classNames.underline[from]).addClass(classNames.underline[to]);
        $element.find(`.${classNames.label[from]}`).removeClass(classNames.label[from]).addClass(classNames.label[to]);

        $(Constants.SELECTORS.PROFILE.TABS.CONTENT)[0].style.setProperty('display', to === 'active' ? 'inherit' : 'none', 'important');
    },
    activateDefaultTab($element) {
        this.hideCustomTabContent();

        $element.siblings().each((index, element) => {
            let $element = $(element),
                tab = $element.attr('data-tab');

            if (tab) this.deactivateCustomTab(tab);
            else this.deactivateDefaultTab($element);
        });

        this.toggleDefaultTab($element, 'inactive', 'active');
    },
    deactivateDefaultTab($element) {
        this.toggleDefaultTab($element, 'active', 'inactive');
    }
};