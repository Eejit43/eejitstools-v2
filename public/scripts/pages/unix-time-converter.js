import { copyValue, updateArrow } from '/scripts/functions.js';

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
    const currentTime = new Date();

    standardInput.value = `${currentTime.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', second: 'numeric' })}, ${currentTime.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}`;

    updateUnixOutput();
}

function updateUnixOutput() {
    const standardTime = new Date(standardInput.value);
    if (standardTime.length === 0) {
        updateArrow(standardArrow, 'reset', 'down');
        unixOutput.value = '';
        unixOutputCopy.disabled = true;
        unixOutputSwitch.disabled = true;
    } else if (isNaN(standardTime.getTime())) {
        updateArrow(standardArrow, 'error');
        unixOutput.value = '';
        unixOutputCopy.disabled = true;
        unixOutputSwitch.disabled = true;
    } else {
        updateArrow(standardArrow, 'success', 'down');

        unixOutput.value = unixOutputState === 'ms' ? standardTime.getTime() : standardTime.getTime().toString().slice(0, -3);
        unixOutputCopy.disabled = false;
        unixOutputSwitch.disabled = false;
    }
}

function updateUnixTime() {
    unixInput.value = unixInputState === 's' ? new Date().getTime().toString().slice(0, -3) : new Date().getTime();
    updateStandardOutput();
}

function updateStandardOutput() {
    const unixTime = unixInputState === 'ms' ? new Date(parseInt(unixInput.value)) : new Date(parseInt(unixInput.value) * 1000);
    if (unixInput.value.length === 0) {
        updateArrow(unixArrow, 'reset', 'down');
        standardOutput.value = '';
        standardOutputCopy.disabled = true;
    } else if (isNaN(unixTime.getTime())) {
        updateArrow(unixArrow, 'error');
        standardOutput.value = '';
        standardOutputCopy.disabled = true;
    } else {
        updateArrow(unixArrow, 'success', 'down');

        const timeString = unixTime.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', second: 'numeric' });
        standardOutput.value = `${unixInputState === 'ms' ? timeString.replace(/ (AM|PM)/, `.${unixTime.getMilliseconds()} $1`) : timeString}, ${unixTime.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}`;
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
