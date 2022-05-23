import { updateInnerHTML } from '/scripts/functions.js';

setInterval(() => {
    const currentTime = new Date();

    updateInnerHTML(document.getElementById('time'), currentTime.toLocaleTimeString());
    updateInnerHTML(document.getElementById('dst'), isDstObserved(currentTime) ? 'In' : 'Not');
    updateInnerHTML(document.getElementById('date'), `${currentTime.toLocaleDateString([], { year: 'numeric', month: 'long', weekday: 'long', day: 'numeric' })} (${currentTime.toLocaleDateString()})`);
    updateInnerHTML(document.getElementById('unix'), currentTime.getTime());
    updateInnerHTML(document.getElementById('timezone'), `${Intl.DateTimeFormat().resolvedOptions().timeZone} (UTC${currentTime.getTimezoneOffset() < 0 ? '+' : '-'}${currentTime.getTimezoneOffset() / 60})`);
    updateInnerHTML(document.getElementById('jp-time'), currentTime.toLocaleString([], { timeZone: 'Japan' }));
    updateInnerHTML(document.getElementById('cr-time'), currentTime.toLocaleString([], { timeZone: 'America/Costa_Rica' }));
    updateInnerHTML(document.getElementById('gb-time'), currentTime.toLocaleString([], { timeZone: 'Europe/London' }));
    updateInnerHTML(document.getElementById('utc-time'), currentTime.toLocaleString([], { timeZone: 'UTC' }));
}, 100);

/**
 * Whether or not Daylight Savings Time is currently observed
 * @param {Date} date The date to check
 * @returns {boolean} whether or not Daylight Savings Time is currently observed
 * @see https://stackoverflow.com/questions/11887934/how-to-check-if-dst-daylight-saving-time-is-in-effect-and-if-so-the-offset
 */
function isDstObserved(date) {
    return date.getTimezoneOffset() < Math.max(new Date(date.getFullYear(), 0, 1).getTimezoneOffset(), new Date(date.getFullYear(), 6, 1).getTimezoneOffset());
}
