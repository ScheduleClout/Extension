export const Constants = {
    INTERVAL: {
        EVENT_NAME: 'tick',
        TIMEOUT: 100,
    },
    TEMPLATES: {
        SCHEDULE_WRAP: `
            <div class="feed-create-post__schedule-wrap ml-15px">
                <i class="far fa-clock fa-lg text-grey8A cursor-pointer feed-create-post__schedule-icon" aria-hidden="true"></i>
                <input type="datetime-local" class="feed-create-post__schedule-input">
            </div>`,
        MESSAGE: (message, isError) => `<span class="ml-15px mr-auto roboto-regular feed-create-post__message fs-15px text-grey8A" data-error="${isError.toString()}"> ${message} </span>`,
        SCHEDULE_BUTTON: (label) => `<button class="btn btn-primary font-weight-bold ml-15px fs-14px br-12px" style="display: none" data-action="schedule"> ${label} </button>`,
        TAB_HEADING: (tab, label, active = false) => `
            <div class="d-flex flex-column align-items-center h-100 pl-15px pr-15px" data-tab="${tab}" data-label="${label}">
                <div class="d-flex h-100 align-items-center fs-15px fc-${active ? 'default' : 'muted'}"> ${label} </div>
                <div style="width: 50px;" class="tab-underline-${active ? 'active' : 'inactive'}"></div>
            </div>`,
        TAB_CONTENT: `<div data-tab-content></div>`,
        TAB_CONTENT_EMPTY: (message) => `<span class="fc-muted d-block pt-15px" style="text-align: center;">${message}</span>`,
        OPTION: (icon, label, action) => `
            <a class="dropdown-menu-item fs-12px d-block link--unstyled p-10px feed-post__dropdown-menu-item text-danger" data-action="${action}">
                <i class="fas ${icon}" aria-hidden="true"></i> ${label}
            </a>`,
        POST: (sid, options, text, image, label) => `
            <div data-sid="${sid}">
                <div class="border-bottom border-color-grey">
                    <feed-post>
                        <div class="d-flex flex-column js-feed-post js-feed-post-hover" style="overflow: hidden;">
                            <div class="feed-post__container d-flex justify-content-left w-100 px-15px pb-15px pt-15px">
                                <div class="w-100">
                                    <div class="d-flex align-items-center">
                                        <span class="fc-muted">
                                            <i class="far fa-clock" aria-hidden="true"></i>
                                            ${label}
                                        </span>
                                        ${options ? `<feed-post-dropdown class="ml-auto">
                                            <div>
                                                <a data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" class="js-feed-post__dropdown-toggle link--unstyled text-grey9">
                                                    <i class="fas fa-ellipsis-h" aria-hidden="true"></i>
                                                </a>
                                                <div class="dropdown-menu dropdown-menu-right p-0">${options}</div>
                                            </div>
                                        </feed-post-dropdown>` : ''}
                                    </div>
                                    ${text ? `<!--suppress CssInvalidPropertyValue, CssUnknownProperty, CssOverwrittenProperties -->
                                        <div class="roboto-regular mt-1" style="overflow-wrap: anywhere; -ms-word-break: break-all; word-break: break-all; word-break: break-word; outline: none;" tabindex="0">${text}</div>` : ''}
                                    ${image ? `<div class="feed-post__image-container"><img data-toggle="modal" class="feed-post__image" src="${image}" alt></div>` : ''}
                                </div>
                            </div>
                        </div>
                    </feed-post>
                </div>
            </div>`,
    },
    SELECTORS: {
        MENU: {
            PROFILE: `.left-bar__dot-active + div a:contains('Profile')`
        },
        PROFILE: {
            _: 'app-creator-profile-page',
            USERNAME: 'creator-profile-top-card .fs-24px',
            TABS: {
                _: 'creator-profile-top-card + tab-selector > div',
                TAB: '> div:not([data-tab])',
                SELECTOR: 'creator-profile-top-card + tab-selector',
                CONTENT: 'creator-profile-top-card + tab-selector + div:not([data-tab-content])'
            }
        },
        FEED: {
            _: 'feed',
            CREATE_POST: {
                _: 'feed-create-post',
                VALUE: 'textarea',
                TEXTAREA: '.feed-create-post__textarea',
                IMAGE: '.feed-post__image',
                IMAGE_DELETE: '.feed-post__image-delete',
                STATUS: {
                    _: '> div:last-child',
                    MESSAGE: '.feed-create-post__message',
                    IMAGE_ICON: '.fa-image',
                    POST_BUTTON: '.btn:not([data-action="schedule"])',
                    SCHEDULE_BUTTON: '.btn[data-action="schedule"]',
                    SCHEDULE_WRAP: {
                        _: '.feed-create-post__schedule-wrap',
                        DATETIME_INPUT: '.feed-create-post__schedule-input'
                    }
                }
            }
        }
    }
};