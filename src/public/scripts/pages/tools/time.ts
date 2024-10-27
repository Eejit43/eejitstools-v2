import { updateInnerHtml } from '../../functions.js';

setInterval(() => {
    const currentTime = new Date();

    updateInnerHtml(
        document.querySelector<HTMLSpanElement>('#time')!,
        currentTime.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric', second: 'numeric' }),
    );

    updateInnerHtml(document.querySelector<HTMLSpanElement>('#dst')!, isDaylightSavingsTimeObserved(currentTime) ? 'Yes' : 'No');

    updateInnerHtml(
        document.querySelector<HTMLSpanElement>('#date')!,
        `${currentTime.toLocaleDateString(undefined, { year: 'numeric', month: 'long', weekday: 'long', day: 'numeric' })} (${currentTime.toLocaleDateString()})`,
    );

    updateInnerHtml(document.querySelector<HTMLSpanElement>('#unix')!, currentTime.getTime().toString());

    updateInnerHtml(
        document.querySelector<HTMLSpanElement>('#timezone')!,
        `${Intl.DateTimeFormat().resolvedOptions().timeZone} (UTC${currentTime.getTimezoneOffset() < 0 ? '+' : '-'}${currentTime.getTimezoneOffset() / 60})`,
    );

    updateInnerHtml(document.querySelector<HTMLSpanElement>('#jp-time')!, currentTime.toLocaleString([], { timeZone: 'Japan' }));

    updateInnerHtml(
        document.querySelector<HTMLSpanElement>('#cr-time')!,
        currentTime.toLocaleString([], { timeZone: 'America/Costa_Rica' }),
    );

    updateInnerHtml(document.querySelector<HTMLSpanElement>('#gb-time')!, currentTime.toLocaleString([], { timeZone: 'Europe/London' }));

    updateInnerHtml(document.querySelector<HTMLSpanElement>('#utc-time')!, currentTime.toLocaleString([], { timeZone: 'UTC' }));
}, 100);

/**
 * Checks if Daylight Savings Time is currently observed.
 * @param date The date to check.
 * @see https://stackoverflow.com/questions/11887934
 */
function isDaylightSavingsTimeObserved(date: Date) {
    return (
        date.getTimezoneOffset() <
        Math.max(new Date(date.getFullYear(), 0, 1).getTimezoneOffset(), new Date(date.getFullYear(), 6, 1).getTimezoneOffset())
    );
}
