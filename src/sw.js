import {Scheduler} from "./constants/Scheduler";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log({request});
    if ('type' in request) {
        let type = request.type;
        delete request.type;

        switch (type) {
            case 'ADD_POST':
                Scheduler.Add(request);
                break;
            case 'REMOVE_POST':
                Scheduler.Remove(request);
                break;
        }
    }
});

chrome.alarms.create({periodInMinutes: 0.1});
chrome.alarms.onAlarm.addListener(() => Scheduler.Publish());
