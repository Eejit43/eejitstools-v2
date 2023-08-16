import { CalendarEvents } from '../../../app.js';
import { holidayEmojis } from '../../../data/pages.js';
import { twemojiUpdate } from '../../functions.js';

const { holidays } = (await (await fetch('/calendar-events')).json()) as CalendarEvents;

const parsedHolidays = holidays.map((holiday, index) => ({ ...holiday, id: `holiday-${index}` })).filter((holiday) => getTimeUntil(holiday.date) && !/^first day of/i.test(holiday.name));

const result = parsedHolidays.map(
    (holiday) =>
        `Time until <span class="tooltip-bottom" data-tooltip="${new Date(`${holiday.date} 00:00:00`).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })}">${holiday.name}</span>: <span id="${holiday.id}">${getTimeUntil(holiday.date)!}</span>${holidayEmojis[holiday.name] ? ` ${holidayEmojis[holiday.name]}` : ''}`,
);

(document.querySelector('#countdowns') as HTMLDivElement).innerHTML = result.length > 0 ? result.join('<br />') : 'No upcoming events!';

if (result.length > 0) {
    twemojiUpdate();

    setInterval(() => {
        for (const holiday of parsedHolidays) {
            const result = getTimeUntil(holiday.date);
            const timeDisplay = document.querySelector(`#${holiday.id}`);

            if (!timeDisplay || timeDisplay.innerHTML === result) continue;

            timeDisplay.innerHTML = result ?? '<span class="error">This event has already occurred!</span>';
        }
    }, 500);
}

/**
 * Formats a time value with a given unit, adding plurals if applicable.
 * @param value The value to format.
 * @param unit The unit to format.
 */
function formatTimeUnit(value: number, unit: string) {
    if (value === 1) return `${value} ${unit}`;
    else if (value > 1) return `${value} ${unit}s`;
    else return null;
}

/**
 * Gets the milliseconds until a given date (or null if it has occurred or is over 60 days away).
 * @param date The date to calculate time to.
 */
function getTimeUntil(date: string) {
    const distance = new Date(`${date} 00:00:00`).getTime() - Date.now();

    const days = Math.floor(distance / 86_400_000);
    const hours = Math.floor((distance % 86_400_000) / 3_600_000);
    const minutes = Math.floor((distance % 3_600_000) / 60_000);
    const seconds = Math.floor((distance % 60_000) / 1000);

    const daysFinal = formatTimeUnit(days, 'day');
    const hoursFinal = formatTimeUnit(hours, 'hour');
    const minutesFinal = formatTimeUnit(minutes, 'minute');
    const secondsFinal = formatTimeUnit(seconds, 'second');

    const result = [daysFinal, hoursFinal, minutesFinal, secondsFinal].filter(Boolean);

    return distance <= 0 || distance >= 60 * 86_400_000 ? null : result.join(', ');
}
