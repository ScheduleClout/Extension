import {BitClout} from "./BitClout";

export const Scheduler = {
    Status: async (items, status) => {
        const posts = await Scheduler.Posts();

        for (let post of items) {
            let index = posts.findIndex(value => value.uuid === post.uuid);

            posts[index] = {...post, status}
        }

        chrome.storage.local.set({posts});
    },
    Sort: (a, b) => new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime(),
    Posts: async () => new Promise(resolve => {
        let callback = ({posts}) => resolve(posts ? posts.sort(Scheduler.Sort) : []);
        chrome.storage.local.get(['posts'], callback);
    }),
    Add: async (value) => {
        const posts = await Scheduler.Posts();

        posts.push(value);
        posts.sort(Scheduler.Sort);

        chrome.storage.local.set({posts});
    },
    Remove: async (value) => {
        let posts = await Scheduler.Posts();

        posts = posts.filter(post => post.uuid !== value.uuid);

        chrome.storage.local.set({posts});
    },
    Publish: async () => {
        const posts = await Scheduler.Posts(),
            queue = posts.filter(post => new Date(post.publishAt) <= new Date() && !post.hasOwnProperty('status'));

        await Scheduler.Status(queue, 'processing');
        await Promise.all(queue.map((post) => BitClout.Submit(post)));

        return new Promise(async resolve => {
            let filter = posts.filter(post => queue.indexOf(post) === -1);
            chrome.storage.local.set({posts: filter}, () => resolve());
        });
    },
};