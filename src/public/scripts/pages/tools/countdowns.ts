import type { CalendarEvents } from '../../../../route-handlers/calendar.js';
import { holidayEmojis } from '../../../data/emojis.js';
import { twemojiUpdate } from '../../functions.js';

const countdownContainer = document.querySelector('#countdowns') as HTMLDivElement;

const { holidays } = (await (await fetch('/calendar-events')).json()) as CalendarEvents;

const parsedHolidays = holidays.map((holiday, index) => ({ ...holiday, id: `holiday-${index}` })).filter((holiday) => getTimeUntil(holiday.date) && !/^first day of/i.test(holiday.name));

const result = parsedHolidays.map((holiday) => {
    const container = document.createElement('div');

    const timeUntilSpan = document.createElement('span');
    timeUntilSpan.classList.add('time-until');

    const eventTooltip = document.createElement('span');
    eventTooltip.textContent = holiday.name;
    eventTooltip.dataset.tooltip = new Date(`${holiday.date} 00:00:00`).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    timeUntilSpan.append('Time until ', eventTooltip, ':');

    const timeResult = document.createElement('span');
    timeResult.id = holiday.id;
    timeResult.textContent = getTimeUntil(holiday.date);

    const emoji = holidayEmojis[holiday.name] ? ` ${holidayEmojis[holiday.name]}` : '';

    container.append(timeUntilSpan, ' ', timeResult, emoji);

    return container;
});

countdownContainer.textContent = '';

countdownContainer.append(...result);

if (result.length > 0) {
    twemojiUpdate();

    setInterval(() => {
        for (const holiday of parsedHolidays) {
            const result = getTimeUntil(holiday.date);
            const timeDisplay = document.querySelector(`#${holiday.id}`);

            if (!timeDisplay || timeDisplay.innerHTML === result) continue;

            if (result) timeDisplay.textContent = result;
            else {
                const errorElement = document.createElement('span');
                errorElement.classList.add('error');
                errorElement.textContent = 'This event has already occurred!';
            }
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
