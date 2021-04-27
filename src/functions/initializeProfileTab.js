import $ from 'jquery';
import moment from "moment";
import {Constants} from "../constants/Constants";
import {TabManager} from "../constants/TabManager";
import {Scheduler} from "../constants/Scheduler";

export const initializeProfileTab = async () => {
    await TabManager.initialize();

    let isUserProfile = $(Constants.SELECTORS.MENU.PROFILE.ACTIVE).length > 0;
    if (isUserProfile) {
        TabManager.register('posts', chrome.i18n.getMessage('scheduledPosts'), async () => {
            const options = [
                    Constants.TEMPLATES.OPTION('fa-trash', chrome.i18n.getMessage('cancel'), 'cancel')
                ],
                publicKey = JSON.parse(localStorage.getItem('lastLoggedInUser')),
                posts = (await Scheduler.Posts()).filter(post => post.user.publicKey === publicKey),
                templates = [];

            for (let i = 0; i < posts.length; i++) {
                const {
                        data: {
                            BodyObj: {
                                Body,
                                Images
                            }
                        },
                        uuid,
                        publishAt
                    } = posts[i],
                    image = Images && Images.length > 0 ? Images[0] : undefined,
                    label = chrome.i18n.getMessage('postCaption').replace('%MESSAGE%', moment(publishAt).fromNow());

                templates.push(Constants.TEMPLATES.POST(uuid, options.join(), Body, image, label))
            }

            return templates.join()
        });
    } else
        TabManager.remove('posts');

    let selector = '[data-action="cancel"]';
    $(document).on('click', selector, (event) => {
        const $target = $(event.target),
            $element = $target.is(selector) ? $target : $target.parents(selector),
            $post = $element.parents('[data-sid]'),
            sid = $post.attr('data-sid');

        chrome.runtime.sendMessage({type: 'REMOVE_POST', uuid: sid});
        $post.remove();
    });
};
