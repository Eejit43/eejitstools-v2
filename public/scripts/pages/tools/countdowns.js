import { twemojiUpdate } from '/scripts/functions.js';

// Some dates from https://calendarific.com/api/v2/holidays?api_key=9f2483021d5643c59e75d133dc71bcab6672bfc0&country=US&year=2023&type=national

const dates = [
    { name: "New Year's Day", date: '2022-01-01', emoji: 'π', id: 'new_years_day_2022' },
    { name: 'Martin Luther King Jr. Day', date: '2022-01-17', emoji: 'π΄πΎ', id: 'martin_luther_king_jr_day_2022' },
    { name: "Valentine's Day", date: '2022-02-14', emoji: 'β€οΈ', id: 'valentines_day_2022' },
    { name: "Presidents' Day", date: '2022-02-21', emoji: 'π€΅', id: 'presidents_day_2022' },
    { name: "St. Patrick's Day", date: '2022-03-17', emoji: 'βοΈ', id: 'st_patricks_day_2022' },
    { name: 'Spring Equinox', date: '2022-03-20', emoji: 'π±', id: 'spring_equinox_2022' },
    { name: 'Easter', date: '2022-04-17', emoji: 'π', id: 'easter_2022' },
    { name: 'Memorial Day', date: '2022-05-30', emoji: 'πͺ¦', id: 'memorial_day_2022' },
    { name: 'Juneteenth', date: '2022-06-19', emoji: 'βπΏ', id: 'juneteenth_2022' },
    { name: 'Summer Solstice', date: '2022-06-21', emoji: 'βοΈ', id: 'summer_solstice_2022' },
    { name: 'Independence Day', date: '2022-07-04', emoji: 'πΊπΈ', id: 'independece_day_2022' },
    { name: 'Labor Day', date: '2022-09-05', emoji: 'π ', id: 'labor_day_2022' },
    { name: 'Autumn Equinox', date: '2022-09-22', emoji: 'π', id: 'autumn_equinox_2022' },
    { name: "Indigenous Peoples' Day", date: '2022-10-10', emoji: 'πͺΆ', id: 'indigenous_peoples_day_2022' },
    { name: 'Halloween', date: '2022-10-31', emoji: 'π', id: 'halloween_2022' },
    { name: 'Veterans Day', date: '2022-11-11', emoji: 'ποΈ', id: 'veterns_day_2022' },
    { name: 'Thanksgiving Day', date: '2022-11-24', emoji: 'π¦', id: 'thanksgiving_day_2022' },
    { name: 'Winter Solstice', date: '2022-12-21', emoji: 'βοΈ', id: 'winter_solstice_2022' },
    { name: 'Christmas Eve', date: '2022-12-24', emoji: 'ππ»', id: 'christmas_eve_2022' },
    { name: 'Christmas Day', date: '2022-12-25', emoji: 'π', id: 'christmas_day_2022' },
    { name: "New Year's Eve", date: '2022-12-31', emoji: 'π', id: 'new_years_eve_2022' },

    { name: "New Year's Day", date: '2023-01-01', emoji: 'π', id: 'new_years_day_2023' },
    { name: 'Martin Luther King Jr. Day', date: '2023-01-16', emoji: 'π΄πΎ', id: 'martin_luther_king_jr_day_2023' },
    { name: "Valentine's Day", date: '2023-02-14', emoji: 'β€οΈ', id: 'valentines_day_2023' },
    { name: "Presidents' Day", date: '2023-02-20', emoji: 'π€΅', id: 'presidents_day_2023' },
    { name: "St. Patrick's Day", date: '2023-03-17', emoji: 'βοΈ', id: 'st_patricks_day_2023' },
    { name: 'Spring Equinox', date: '2023-03-20', emoji: 'π±', id: 'spring_equinox_2023' },
    { name: 'Easter', date: '2023-04-17', emoji: 'π', id: 'easter_2023' },
    { name: 'Memorial Day', date: '2023-05-29', emoji: 'πͺ¦', id: 'memorial_day_2023' },
    { name: 'Juneteenth', date: '2023-06-19', emoji: 'βπΏ', id: 'juneteenth_2023' },
    { name: 'Summer Solstice', date: '2023-06-21', emoji: 'βοΈ', id: 'summer_solstice_2023' },
    { name: 'Independence Day', date: '2023-07-04', emoji: 'πΊπΈ', id: 'independece_day_2023' },
    { name: 'Labor Day', date: '2023-09-04', emoji: 'π ', id: 'labor_day_2023' },
    { name: 'Autumn Equinox', date: '2023-09-23', emoji: 'π', id: 'autumn_equinox_2023' },
    { name: "Indigenous Peoples' Day", date: '2023-10-09', emoji: 'πͺΆ', id: 'indigenous_peoples_day_2023' },
    { name: 'Halloween', date: '2023-10-31', emoji: 'π', id: 'halloween_2023' },
    { name: 'Veterans Day', date: '2023-11-11', emoji: 'ποΈ', id: 'veterns_day_2023' },
    { name: 'Thanksgiving Day', date: '2023-11-23', emoji: 'π¦', id: 'thanksgiving_day_2023' },
    { name: 'Winter Solstice', date: '2023-12-21', emoji: 'βοΈ', id: 'winter_solstice_2023' },
    { name: 'Christmas Eve', date: '2023-12-24', emoji: 'ππ»', id: 'christmas_eve_2023' },
    { name: 'Christmas Day', date: '2023-12-25', emoji: 'π', id: 'christmas_day_2023' },
    { name: "New Year's Eve", date: '2023-12-31', emoji: 'π', id: 'new_years_eve_2023' }
];

const result = [];
for (let i = 0; i < dates.length; i++) if (getTimeUntil(dates[i].date)) result.push(`Time until <span class="tooltip-bottom" data-tooltip="${new Date(`${dates[i].date} 00:00:00`).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}">${dates[i].name}</span>: <span id="${dates[i].id}">${getTimeUntil(dates[i].date)}</span> ${dates[i].emoji}`);

document.getElementById('countdowns').innerHTML = result.join('<br />');

twemojiUpdate();

setInterval(() => {
    for (const date in dates) {
        const result = getTimeUntil(dates[date].date);
        const timeDisplay = document.getElementById(dates[date].id);

        if (!timeDisplay || timeDisplay.innerHTML === result) continue;

        if (result) timeDisplay.innerHTML = result;
        else timeDisplay.innerHTML = '<span class="error">This event has already occurred!</span>';
    }
}, 500);

/**
 * Calculates the time until a given date
 * @param {string} date The date to calculate time to
 * @returns {string|null} The time until the given date, or null if it has occurred or is over 60 days away
 */
function getTimeUntil(date) {
    const countdownDate = new Date(`${date} 00:00:00`).getTime();

    const curTime = new Date().getTime();

    const distance = countdownDate - curTime;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    let daysFinal = days + ' days';
    if (days === 1) daysFinal = days + ' day';
    if (days === 0) daysFinal = '';

    let hoursFinal = hours + ' hours';
    if (hours === 1) hoursFinal = hours + ' hour';
    if (hours === 0) hoursFinal = '';

    let minutesFinal = minutes + ' minutes';
    if (minutes === 1) minutesFinal = minutes + ' minute';
    if (minutes === 0) minutesFinal = '';

    let secondsFinal = seconds + ' seconds';
    if (seconds === 1) secondsFinal = seconds + ' second';
    if (seconds === 0) secondsFinal = '';

    const result = [];
    if (daysFinal.length > 0) result.push(daysFinal);
    if (hoursFinal.length > 0) result.push(hoursFinal);
    if (minutesFinal.length > 0) result.push(minutesFinal);
    if (secondsFinal.length > 0) result.push(secondsFinal);

    if (distance <= 0 || distance >= 60 * 86400000) return; // Don't show already occurred or if over 60 days away
    else return result.join(', ');
}
