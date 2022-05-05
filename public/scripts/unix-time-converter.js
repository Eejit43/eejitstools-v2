let standardInput = document.getElementById('standard-input');
let standardInputReset = document.getElementById('standard-input-reset');
let unixInput = document.getElementById('unix-input');
let unixInputReset = document.getElementById('unix-input-reset');
let unixInputSwitch = document.getElementById('unix-input-switch');
let unixOutputCopy = document.getElementById('unix-output-copy');
let unixOutputSwitch = document.getElementById('unix-output-switch');
let standardOutputCopy = document.getElementById('standard-output-copy');
let standardOutput = document.getElementById('standard-output');
let unixOutput = document.getElementById('unix-output');

/* Add event listeners */
standardInput.addEventListener('input', updateUnixOutput);
standardInputReset.addEventListener('click', updateStandardTime);
unixInput.addEventListener('input', updateStandardOutput);
unixInputReset.addEventListener('click', updateUnixTime);
unixInputSwitch.addEventListener('click', switchUnixInput);
unixOutputCopy.addEventListener('click', function () {
    copyValue('unix-output', 'unix-output-copy');
});
unixOutputSwitch.addEventListener('click', switchUnixOutput);
standardOutputCopy.addEventListener('click', function () {
    copyValue('standard-output', 'standard-output-copy');
});

let unixInputState = 1; // 1 = seconds, 2 = milliseconds
let unixOutputState = 1; // 1 = seconds, 2 = milliseconds

function updateStandardTime() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let currentTime = new Date();
    let date = currentTime.getDate();
    let month = months[currentTime.getMonth()];
    let year = currentTime.getFullYear();
    let fullhours = currentTime.getHours();
    let hours = ((fullhours + 11) % 12) + 1;
    let minutes = currentTime.getMinutes();
    let sec = currentTime.getSeconds();

    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (sec < 10) {
        sec = '0' + sec;
    }

    let timesuffix = fullhours >= 12 ? 'PM' : 'AM';

    let output = month + ' ' + date + ', ' + year + ' ' + hours + ':' + minutes + ':' + sec + ' ' + timesuffix;

    standardInput.value = output;

    updateUnixOutput();
}

function updateUnixOutput() {
    let standardtime = standardInput.value;
    let valid = new Date(standardtime).getTime() > 0;
    if (standardtime.length === 0) {
        updateArrow('standard', 'reset', 'down');
        unixOutput.value = '';
        unixOutputCopy.disabled = true;
        unixOutputSwitch.disabled = true;
    } else if (valid === false) {
        updateArrow('standard', 'error');
        unixOutput.value = '';
        unixOutputCopy.disabled = true;
        unixOutputSwitch.disabled = true;
    } else {
        updateArrow('standard', 'success', 'down');
        let unixtime = new Date(standardtime).getTime();
        if (unixOutputState === 1) {
            unixtime = unixtime.toString().slice(0, -3);
        }
        unixOutput.value = unixtime;
        unixOutputCopy.disabled = false;
        unixOutputSwitch.disabled = false;
    }
}

function updateUnixTime() {
    let output = new Date().getTime();
    if (unixInputState === 1) {
        output = output.toString().slice(0, -3);
    }

    unixInput.value = output;

    updateStandardOutput();
}

function updateStandardOutput() {
    let standardtime = parseInt(unixInput.value, 10) * 1000;
    let valid = new Date(standardtime).getTime() > 0;
    if (unixInput.value.length === 0) {
        updateArrow('unix', 'reset', 'down');
        standardOutput.value = '';
        standardOutputCopy.disabled = true;
    } else if (valid === false) {
        updateArrow('unix', 'error');
        standardOutput.value = '';
        standardOutputCopy.disabled = true;
    } else {
        updateArrow('unix', 'success', 'down');
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let time = new Date(parseInt(standardtime));
        let time2 = new Date(parseInt(standardtime.toString().slice(0, -3)));
        if (unixInputState === 2) {
            time = new Date(parseInt(standardtime.toString().slice(0, -3)));
        }
        let date = time.getDate();
        let month = months[time.getMonth()];
        let year = time.getFullYear();
        let fullhours = time.getHours();
        let hours = ((fullhours + 11) % 12) + 1;
        let minutes = time.getMinutes();
        let sec = time.getSeconds();
        let msec = time2.getMilliseconds();

        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (sec < 10) {
            sec = '0' + sec;
        }

        let timesuffix = fullhours >= 12 ? 'PM' : 'AM';
        let output;
        if (unixInputState === 2) {
            output = month + ' ' + date + ', ' + year + ' ' + hours + ':' + minutes + ':' + sec + '.' + msec + ' ' + timesuffix;
        } else {
            output = month + ' ' + date + ', ' + year + ' ' + hours + ':' + minutes + ':' + sec + ' ' + timesuffix;
        }
        standardOutput.value = output;
        standardOutputCopy.disabled = false;
    }
}

function switchUnixInput() {
    let title = document.getElementById('unix-input-title');
    let button = unixInputSwitch;
    if (unixInputState === 1) {
        unixInputState = 2;
        title.innerHTML = 'UNIX Time (milliseconds):';
        button.innerHTML = 'Switch to seconds';
    } else if (unixInputState === 2) {
        unixInputState = 1;
        title.innerHTML = 'UNIX Time (seconds):';
        button.innerHTML = 'Switch to milliseconds';
    }
    updateStandardOutput();
}

function switchUnixOutput() {
    let title = document.getElementById('unix-output-title');
    let button = unixOutputSwitch;
    if (unixOutputState === 1) {
        unixOutputState = 2;
        title.innerHTML = 'UNIX Time (milliseconds):';
        button.innerHTML = 'Switch to seconds';
    } else if (unixOutputState === 2) {
        unixOutputState = 1;
        title.innerHTML = 'UNIX Time (seconds):';
        button.innerHTML = 'Switch to milliseconds';
    }
    updateUnixOutput();
}

updateStandardTime();
updateUnixOutput();
updateUnixTime();
updateStandardOutput();
