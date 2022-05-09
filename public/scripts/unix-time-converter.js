const standardInput = document.getElementById('standard-input');
const standardInputReset = document.getElementById('standard-input-reset');
const standardArrow = document.getElementById('standard-arrow');
const unixInput = document.getElementById('unix-input');
const unixInputReset = document.getElementById('unix-input-reset');
const unixInputSwitch = document.getElementById('unix-input-switch');
const unixArrow = document.getElementById('unix-arrow');
const unixOutputCopy = document.getElementById('unix-output-copy');
const unixOutputSwitch = document.getElementById('unix-output-switch');
const standardOutputCopy = document.getElementById('standard-output-copy');
const standardOutput = document.getElementById('standard-output');
const unixOutput = document.getElementById('unix-output');

/* Add event listeners */
standardInput.addEventListener('input', updateUnixOutput);
standardInputReset.addEventListener('click', updateStandardTime);
unixInput.addEventListener('input', updateStandardOutput);
unixInputReset.addEventListener('click', updateUnixTime);
unixInputSwitch.addEventListener('click', switchUnixInput);
unixOutputCopy.addEventListener('click', () => {
    copyValue(unixOutputCopy, unixOutput);
});
unixOutputSwitch.addEventListener('click', switchUnixOutput);
standardOutputCopy.addEventListener('click', () => {
    copyValue(standardOutputCopy, standardOutput);
});

let unixInputState = 's';
let unixOutputState = 's';

function updateStandardTime() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentTime = new Date();
    const date = currentTime.getDate();
    const month = months[currentTime.getMonth()];
    const year = currentTime.getFullYear();
    const fullHours = currentTime.getHours();
    const hours = ((fullHours + 11) % 12) + 1;
    let minutes = currentTime.getMinutes();
    let seconds = currentTime.getSeconds();
    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;

    const timeSuffix = fullHours >= 12 ? 'PM' : 'AM';

    standardInput.value = `${month} ${date}, ${year} ${hours}:${minutes}:${seconds} ${timeSuffix}`;

    updateUnixOutput();
}

function updateUnixOutput() {
    const standardTime = standardInput.value;
    const valid = new Date(standardTime).getTime() > 0;
    if (standardTime.length === 0) {
        updateArrow(standardArrow, 'reset', 'down');
        unixOutput.value = '';
        unixOutputCopy.disabled = true;
        unixOutputSwitch.disabled = true;
    } else if (valid === false) {
        updateArrow(standardArrow, 'error');
        unixOutput.value = '';
        unixOutputCopy.disabled = true;
        unixOutputSwitch.disabled = true;
    } else {
        updateArrow(standardArrow, 'success', 'down');
        let unixTime = new Date(standardTime).getTime();
        if (unixOutputState === 's') unixTime = unixTime.toString().slice(0, -3);
        unixOutput.value = unixTime;
        unixOutputCopy.disabled = false;
        unixOutputSwitch.disabled = false;
    }
}

function updateUnixTime() {
    unixInput.value = unixInputState === 1 ? new Date().getTime().toString().slice(0, -3) : new Date().getTime();
    updateStandardOutput();
}

function updateStandardOutput() {
    const standardTime = parseInt(unixInput.value) * 1000;
    const valid = new Date(standardTime).getTime() > 0;
    if (unixInput.value.length === 0) {
        updateArrow(unixArrow, 'reset', 'down');
        standardOutput.value = '';
        standardOutputCopy.disabled = true;
    } else if (valid === false) {
        updateArrow(unixArrow, 'error');
        standardOutput.value = '';
        standardOutputCopy.disabled = true;
    } else {
        updateArrow(unixArrow, 'success', 'down');
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const time = unixInputState === 2 ? new Date(parseInt(standardTime.toString().slice(0, -3))) : new Date(parseInt(standardTime));
        const date = time.getDate();
        const month = months[time.getMonth()];
        const year = time.getFullYear();
        const fullHours = time.getHours();
        const hours = ((fullHours + 11) % 12) + 1;
        let minutes = time.getMinutes();
        let seconds = time.getSeconds();
        const milliseconds = time.getMilliseconds();

        if (minutes < 10) minutes = '0' + minutes;
        if (seconds < 10) seconds = '0' + seconds;

        const timeSuffix = fullHours >= 12 ? 'PM' : 'AM';

        standardOutput.value = `${month} ${date}, ${year} ${hours}:${minutes}:${seconds}${unixInputState === 2 ? `.${milliseconds}` : ''} ${timeSuffix}`;
        standardOutputCopy.disabled = false;
    }
}

function switchUnixInput() {
    const title = document.getElementById('unix-input-title');
    if (unixInputState === 's') {
        unixInputState = 'ms';
        title.innerHTML = 'UNIX Time (milliseconds):';
        unixInputSwitch.innerHTML = 'Switch to seconds';
    } else if (unixInputState === 'ms') {
        unixInputState = 's';
        title.innerHTML = 'UNIX Time (seconds):';
        unixInputSwitch.innerHTML = 'Switch to milliseconds';
    }
    updateStandardOutput();
}

function switchUnixOutput() {
    const title = document.getElementById('unix-output-title');
    if (unixOutputState === 's') {
        unixOutputState = 'ms';
        title.innerHTML = 'UNIX Time (milliseconds):';
        unixOutputSwitch.innerHTML = 'Switch to seconds';
    } else if (unixOutputState === 'ms') {
        unixOutputState = 's';
        title.innerHTML = 'UNIX Time (seconds):';
        unixOutputSwitch.innerHTML = 'Switch to milliseconds';
    }
    updateUnixOutput();
}

updateStandardTime();
updateUnixOutput();
updateUnixTime();
updateStandardOutput();
