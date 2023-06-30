import { updateInnerHtml } from '/scripts/functions.js';

setInterval(() => {
    const currentTime = new Date();

    updateInnerHtml(document.getElementById('time'), currentTime.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', second: 'numeric' }));
    updateInnerHtml(document.getElementById('dst'), isDstObserved(currentTime) ? 'In' : 'Not');
    updateInnerHtml(document.getElementById('date'), `${currentTime.toLocaleDateString([], { year: 'numeric', month: 'long', weekday: 'long', day: 'numeric' })} (${currentTime.toLocaleDateString()})`);
    updateInnerHtml(document.getElementById('unix'), currentTime.getTime());
    updateInnerHtml(document.getElementById('timezone'), `${Intl.DateTimeFormat().resolvedOptions().timeZone} (UTC${currentTime.getTimezoneOffset() < 0 ? '+' : '-'}${currentTime.getTimezoneOffset() / 60})`);
    updateInnerHtml(document.getElementById('jp-time'), currentTime.toLocaleString([], { timeZone: 'Japan' }));
    updateInnerHtml(document.getElementById('cr-time'), currentTime.toLocaleString([], { timeZone: 'America/Costa_Rica' }));
    updateInnerHtml(document.getElementById('gb-time'), currentTime.toLocaleString([], { timeZone: 'Europe/London' }));
    updateInnerHtml(document.getElementById('utc-time'), currentTime.toLocaleString([], { timeZone: 'UTC' }));
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
