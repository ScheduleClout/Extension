import {Scheduler} from "./constants/Scheduler";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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

chrome.alarms.create({periodInMinutes: parseFloat(process.env.ALARM_PERIOD_IN_MINUTES)});
chrome.alarms.onAlarm.addListener(() => Scheduler.Publish());
