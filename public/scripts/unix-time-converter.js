const standardInput = document.getElementById('standard-input');
const standardInputReset = document.getElementById('standard-input-reset');
const unixInput = document.getElementById('unix-input');
const unixInputReset = document.getElementById('unix-input-reset');
const unixInputSwitch = document.getElementById('unix-input-switch');
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
    copyValue('unix-output', 'unix-output-copy');
});
unixOutputSwitch.addEventListener('click', switchUnixOutput);
standardOutputCopy.addEventListener('click', () => {
    copyValue('standard-output', 'standard-output-copy');
});

let unixInputState = 1; // 1 = seconds, 2 = milliseconds
let unixOutputState = 1; // 1 = seconds, 2 = milliseconds

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
        let unixTime = new Date(standardTime).getTime();
        if (unixOutputState === 1) unixTime = unixTime.toString().slice(0, -3);
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
