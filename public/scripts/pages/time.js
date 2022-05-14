// Refer to https://en.wikipedia.org/wiki/List_of_tz_database_time_zones for time zone names

/**
 * Whether or not Daylight Savings Time is currently observed
 * @param {Date} date The date to check
 * @returns {boolean}
 * @see https://stackoverflow.com/questions/11887934/how-to-check-if-dst-daylight-saving-time-is-in-effect-and-if-so-the-offset
 */
function isDstObserved(date) {
    return date.getTimezoneOffset() < Math.max(new Date(date.getFullYear(), 0, 1).getTimezoneOffset(), new Date(date.getFullYear(), 6, 1).getTimezoneOffset());
}

function showResult(element, variable) {
    if (document.getElementById(element).innerHTML !== eval(variable)) document.getElementById(element).innerHTML = eval(variable);
}

let finalTime, isDst, finalDate, unixTime, finalTimezone, jpTime, crTime, gbTime, utcTime;

function time() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentTime = new Date();
    const day = days[currentTime.getDay()];
    const date = currentTime.getDate();
    const month = months[currentTime.getMonth()];
    const monthNumber = currentTime.getMonth() + 1;
    const year = currentTime.getFullYear();
    const shortYear = year.toString().substr(-2);
    const fullHours = currentTime.getHours();
    const hours = ((fullHours + 11) % 12) + 1;
    let minutes = currentTime.getMinutes();
    let seconds = currentTime.getSeconds();
    unixTime = currentTime.getTime();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneOffset = new Date().getTimezoneOffset();
    const offsetSign = timezoneOffset < 0 ? '+' : '-';
    const timeOffset = offsetSign + ((timezoneOffset / 60) | 0);
    jpTime = currentTime.toLocaleString('en-US', { timeZone: 'Japan' });
    crTime = currentTime.toLocaleString('en-US', { timeZone: 'America/Costa_Rica' });
    gbTime = currentTime.toLocaleString('en-US', { timeZone: 'Europe/London' });
    utcTime = currentTime.toLocaleString('en-US', { timeZone: 'Etc/UTC' });
    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;

    isDst = isDstObserved(new Date()) ? 'In' : 'Not';

    const timeSuffix = fullHours >= 12 ? 'PM' : 'AM';

    finalTime = hours + ':' + minutes + ':' + seconds + ' ' + timeSuffix;
    finalDate = day + ', ' + month + ' ' + date + ', ' + year + ' (' + monthNumber + '/' + date + '/' + shortYear + ')';
    finalTimezone = timezone + ' (UTC' + timeOffset + ')';

    showResult('time', 'finalTime');
    showResult('dst', 'isDst');
    showResult('date', 'finalDate');
    showResult('unix', 'unixTime');
    showResult('timezone', 'finalTimezone');
    showResult('jp-time', 'jpTime');
    showResult('cr-time', 'crTime');
    showResult('gb-time', 'gbTime');
    showResult('utc-time', 'utcTime');
    setTimeout(time, 100);
}

time();
