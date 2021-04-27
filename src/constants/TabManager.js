import $ from 'jquery';
import {Constants} from "./Constants";

const WRAP_SELECTOR = `${Constants.SELECTORS.PROFILE._} ${Constants.SELECTORS.PROFILE.TABS._}`,
    DEFAULT_TABS_SELECTOR = `${WRAP_SELECTOR} ${Constants.SELECTORS.PROFILE.TABS.TAB}`,
    TAB_ATTRIBUTE_NAME = Constants.TAB_MANAGER.ATTRIBUTE_NAME.TAB,
    CONTENT_ATTRIBUTE_NAME = Constants.TAB_MANAGER.ATTRIBUTE_NAME.CONTENT;

export const TabManager = {
    initialized: false,
    tabs: {
        registered: {},
        wrap: () => $(WRAP_SELECTOR),
        default: () => $(DEFAULT_TABS_SELECTOR)
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
        if (this.initialized) return;

        const selector = `[${TAB_ATTRIBUTE_NAME}]`;

        $(document).on('click', selector, (event) => {
            const $target = $(event.target),
                $tab = $target.attr(TAB_ATTRIBUTE_NAME) ? $target : $target.parents(selector),
                tab = $tab.attr(TAB_ATTRIBUTE_NAME);

            TabManager.activateCustom(tab);
        });

        $(document).on('click', DEFAULT_TABS_SELECTOR, (event) => {
            const $target = $(event.target),
                selector = '.flex-column',
                $tab = $target.hasClass(selector) ? $target : $target.parents(selector);

            TabManager.activateDefault($tab);
        });

        this.initialized = true;
    },
    findByName(name) {
        return this.tabs.wrap().find(`[${TAB_ATTRIBUTE_NAME}=${name}]`);
    },
    register(name, label, callback, visible = () => true) {
        if (this.findByName(name).length !== 0)
            return;

        const template = $(Constants.TEMPLATES.TAB_HEADING(name, label));

        this.tabs.wrap().append(template);
        this.tabs.registered[name] = {label, callback, visible};
    },
    remove(name) {
        this.findByName(name).remove();
        delete this.tabs.registered[name];
    },
    async customContent(name) {
        const selector = `[${CONTENT_ATTRIBUTE_NAME}]`,
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
    hideCustomContent() {
        const selector = `[${CONTENT_ATTRIBUTE_NAME}]`,
            $wrap = $(Constants.SELECTORS.PROFILE.TABS.SELECTOR).parent();

        $wrap.find(selector).remove();
    },
    toggleCustom(tab, active) {
        const $tab = this.tabs.wrap().find(`[${TAB_ATTRIBUTE_NAME}=${tab}]`),
            label = $tab.attr('data-label'),
            template = Constants.TEMPLATES.TAB_HEADING(tab, label, active);

        $tab.replaceWith(template);
    },
    activateCustom(tab) {
        this.tabs.default().each((index, element) => {
            let $element = $(element),
                selector = '.tab-underline-active';

            if ($element.find(selector).length > 0) {
                this.previousTabIndex = index;
                this.deactivateDefault($element);
            }
        });

        this.toggleCustom(tab, true);
        this.customContent(tab);
    },
    deactivateCustom(tab) {
        this.toggleCustom(tab, false);
    },
    toggleDefault($element, from, to) {
        let classNames = this.defaultClassNames;

        $element.find(`.${classNames.underline[from]}`).removeClass(classNames.underline[from]).addClass(classNames.underline[to]);
        $element.find(`.${classNames.label[from]}`).removeClass(classNames.label[from]).addClass(classNames.label[to]);

        $(Constants.SELECTORS.PROFILE.TABS.CONTENT)[0].style.setProperty('display', to === 'active' ? 'inherit' : 'none', 'important');
    },
    activateDefault($element) {
        this.hideCustomContent();

        $element.siblings().each((index, element) => {
            let $element = $(element),
                tab = $element.attr(`${TAB_ATTRIBUTE_NAME}`);

            if (tab) this.deactivateCustom(tab);
            else this.deactivateDefault($element);
        });

        this.toggleDefault($element, 'inactive', 'active');
    },
    deactivateDefault($element) {
        this.toggleDefault($element, 'active', 'inactive');
    }
};
