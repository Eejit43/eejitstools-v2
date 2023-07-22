import { updateInnerHtml } from '../../functions.js';

setInterval(() => {
    const currentTime = new Date();

    updateInnerHtml(document.querySelector('#time') as HTMLSpanElement, currentTime.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric', second: 'numeric' }));
    updateInnerHtml(document.querySelector('#dst') as HTMLSpanElement, isDaylightSavingsTimeObserved(currentTime) ? 'In' : 'Not');
    updateInnerHtml(document.querySelector('#date') as HTMLSpanElement, `${currentTime.toLocaleDateString(undefined, { year: 'numeric', month: 'long', weekday: 'long', day: 'numeric' })} (${currentTime.toLocaleDateString()})`);
    updateInnerHtml(document.querySelector('#unix') as HTMLSpanElement, currentTime.getTime().toString());
    updateInnerHtml(document.querySelector('#timezone') as HTMLSpanElement, `${Intl.DateTimeFormat().resolvedOptions().timeZone} (UTC${currentTime.getTimezoneOffset() < 0 ? '+' : '-'}${currentTime.getTimezoneOffset() / 60})`);
    updateInnerHtml(document.querySelector('#jp-time') as HTMLSpanElement, currentTime.toLocaleString([], { timeZone: 'Japan' }));
    updateInnerHtml(document.querySelector('#cr-time') as HTMLSpanElement, currentTime.toLocaleString([], { timeZone: 'America/Costa_Rica' }));
    updateInnerHtml(document.querySelector('#gb-time') as HTMLSpanElement, currentTime.toLocaleString([], { timeZone: 'Europe/London' }));
    updateInnerHtml(document.querySelector('#utc-time') as HTMLSpanElement, currentTime.toLocaleString([], { timeZone: 'UTC' }));
}, 100);

/**
 * Checks if Daylight Savings Time is currently observed.
 * @param date The date to check.
 * @see https://stackoverflow.com/questions/11887934
 */
function isDaylightSavingsTimeObserved(date: Date) {
    return date.getTimezoneOffset() < Math.max(new Date(date.getFullYear(), 0, 1).getTimezoneOffset(), new Date(date.getFullYear(), 6, 1).getTimezoneOffset());
}
