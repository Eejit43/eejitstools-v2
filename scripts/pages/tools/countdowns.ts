import { twemojiUpdate } from '/scripts/functions.js';
import { holidayEmojis } from '/data/pages.js';

/**
 * @type {{holidays: {name: string, date: string}[], moonPhases: {name: string, date: string}[]}}
 */
let { holidays } = await (await fetch('/calendar-events')).json();
holidays = holidays.map((holiday, index) => ({ ...holiday, id: `holiday-${index}` })).filter((holiday) => getTimeUntil(holiday.date) && !/^First day of/i.test(holiday.name));

const result = [];
for (const holiday of holidays) result.push(`Time until <span class="tooltip-bottom" data-tooltip="${new Date(`${holiday.date} 00:00:00`).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}">${holiday.name}</span>: <span id="${holiday.id}">${getTimeUntil(holiday.date)}</span>${holidayEmojis[holiday.name] ? ` ${holidayEmojis[holiday.name]}` : ''}`);

document.getElementById('countdowns').innerHTML = result.length > 0 ? result.join('<br />') : 'No upcoming events!';

if (result.length > 0) {
    twemojiUpdate();

    setInterval(() => {
        for (const holiday of holidays) {
            const result = getTimeUntil(holiday.date);
            const timeDisplay = document.getElementById(holiday.id);

            if (!timeDisplay || timeDisplay.innerHTML === result) continue;

            if (result) timeDisplay.innerHTML = result;
            else timeDisplay.innerHTML = '<span class="error">This event has already occurred!</span>';
        }
    }, 500);
}

/**
 * Calculates the time until a given date
 * @param {string} date The date to calculate time to
 * @returns {string|null} The time until the given date, or null if it has occurred or is over 60 days away
 */
function getTimeUntil(date) {
    const countdownDate = new Date(`${date} 00:00:00`);

    const distance = countdownDate - new Date();

    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);

    const formatTimeUnit = (value, unit) => {
        if (value === 1) return `${value} ${unit}`;
        else if (value > 1) return `${value} ${unit}s`;
        else return '';
    };

    const daysFinal = formatTimeUnit(days, 'day');
    const hoursFinal = formatTimeUnit(hours, 'hour');
    const minutesFinal = formatTimeUnit(minutes, 'minute');
    const secondsFinal = formatTimeUnit(seconds, 'second');

    const result = [daysFinal, hoursFinal, minutesFinal, secondsFinal].filter(Boolean);

    if (distance <= 0 || distance >= 60 * 86400000) return null; // Don't show already occurred or if over 60 days away
    else return result.join(', ');
}
