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
                    Constants.TEMPLATES.OPTION('fa-trash', chrome.i18n.getMessage('cancel'), 'remove')
                ],
                publicKey = JSON.parse(localStorage.getItem('lastLoggedInUser')),
                posts = (await Scheduler.Posts()).filter(post => post.publicKey === publicKey),
                templates = [];

            for (let i = 0; i < posts.length; i++) {
                const {
                        data: {
                            BodyObj: {
                                Body,
                                Images
                            },
                            PostExtraData: {
                                EmbedVideoURL
                            }
                        },
                        uuid,
                        publishAt
                    } = posts[i],
                    image = Images && Images.length > 0 ? Images[0] : undefined,
                    video = EmbedVideoURL && EmbedVideoURL.length > 0 ? EmbedVideoURL : undefined,
                    label = chrome.i18n.getMessage('postCaption').replace('%MESSAGE%', moment(publishAt).fromNow());

                templates.push(Constants.TEMPLATES.POST(uuid, options.join(''), Body, image, video, label))
            }

            return templates.join('')
        });
    } else
        TabManager.remove('posts');
};
