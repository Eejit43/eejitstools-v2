// Refer to https://en.wikipedia.org/wiki/List_of_tz_database_time_zones for time zone names

// If DST code modified from https://stackoverflow.com/questions/11887934/how-to-check-if-dst-daylight-saving-time-is-in-effect-and-if-so-the-offset
Date.prototype.stdTimezoneOffset = function () {
    let jan = new Date(this.getFullYear(), 0, 1);
    let jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

Date.prototype.isDstObserved = function () {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
};

function showResult(element, variable) {
    if (document.getElementById(element).innerHTML !== eval(variable)) {
        document.getElementById(element).innerHTML = eval(variable);
    }
}

let finaltime, isDst, finaldate, unixtime, finaltimezone, jptime, crtime, gbtime, utctime;

function time() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let currentTime = new Date();
    let day = days[currentTime.getDay()];
    let date = currentTime.getDate();
    let month = months[currentTime.getMonth()];
    let monthnumber = currentTime.getMonth() + 1;
    let year = currentTime.getFullYear();
    let shortyear = year.toString().substr(-2);
    let fullhours = currentTime.getHours();
    let hours = ((fullhours + 11) % 12) + 1;
    let minutes = currentTime.getMinutes();
    let sec = currentTime.getSeconds();
    unixtime = currentTime.getTime();
    let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let toffset = new Date().getTimezoneOffset();
    let offsetsign = toffset < 0 ? '+' : '-';
    let timeoffset = offsetsign + ((toffset / 60) | 0);
    jptime = currentTime.toLocaleString('en-US', {
        timeZone: 'Japan',
    });
    crtime = currentTime.toLocaleString('en-US', {
        timeZone: 'America/Costa_Rica',
    });
    gbtime = currentTime.toLocaleString('en-US', {
        timeZone: 'Europe/London',
    });
    utctime = currentTime.toLocaleString('en-US', {
        timeZone: 'Etc/UTC',
    });
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (sec < 10) {
        sec = '0' + sec;
    }

    isDst = new Date().isDstObserved() ? 'In' : 'Not';

    let timesuffix = fullhours >= 12 ? 'PM' : 'AM';

    finaltime = hours + ':' + minutes + ':' + sec + ' ' + timesuffix;
    finaldate = day + ', ' + month + ' ' + date + ', ' + year + ' (' + monthnumber + '/' + date + '/' + shortyear + ')';
    finaltimezone = timezone + ' (UTC' + timeoffset + ')';

    showResult('time', 'finaltime');
    showResult('dst', 'isDst');
    showResult('date', 'finaldate');
    showResult('unix', 'unixtime');
    showResult('timezone', 'finaltimezone');
    showResult('jptime', 'jptime');
    showResult('crtime', 'crtime');
    showResult('gbtime', 'gbtime');
    showResult('utctime', 'utctime');
    setTimeout(time, 100);
}

time();
