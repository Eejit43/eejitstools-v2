import { copyValue, updateArrow } from '../../functions.js';

const standardInput = document.getElementById('standard-input') as HTMLInputElement;
const standardInputReset = document.getElementById('standard-input-reset') as HTMLButtonElement;
const standardArrow = document.getElementById('standard-arrow') as HTMLElement;
const unixInput = document.getElementById('unix-input') as HTMLInputElement;
const unixInputReset = document.getElementById('unix-input-reset') as HTMLButtonElement;
const unixInputSwitch = document.getElementById('unix-input-switch') as HTMLButtonElement;
const unixArrow = document.getElementById('unix-arrow') as HTMLElement;
const unixOutputCopy = document.getElementById('unix-output-copy') as HTMLButtonElement;
const unixOutputSwitch = document.getElementById('unix-output-switch') as HTMLButtonElement;
const standardOutputCopy = document.getElementById('standard-output-copy') as HTMLButtonElement;
const standardOutput = document.getElementById('standard-output') as HTMLInputElement;
const unixOutput = document.getElementById('unix-output') as HTMLInputElement;

const unixOutputTitle = document.getElementById('unix-output-title') as HTMLSpanElement;
const unixInputTitle = document.getElementById('unix-input-title') as HTMLSpanElement;

/* Add event listeners */
standardInput.addEventListener('input', updateUnixOutput);
standardInputReset.addEventListener('click', updateStandardTime);
unixInput.addEventListener('input', updateStandardOutput);
unixInputReset.addEventListener('click', updateUnixTime);
unixInputSwitch.addEventListener('click', switchUnixInput);
unixOutputCopy.addEventListener('click', () => copyValue(unixOutputCopy, unixOutput));
unixOutputSwitch.addEventListener('click', switchUnixOutput);
standardOutputCopy.addEventListener('click', () => copyValue(standardOutputCopy, standardOutput));

let unixInputState = 's';
let unixOutputState = 's';

/**
 * Updates the standard time input and triggers the update of the unix time output
 */
function updateStandardTime() {
    const currentTime = new Date();

    standardInput.value = `${currentTime.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', second: 'numeric' })}, ${currentTime.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}`;

    updateUnixOutput();
}

/**
 * Updates the unix time output
 */
function updateUnixOutput() {
    const standardTime = new Date(standardInput.value);
    if (standardInput.value.length === 0) {
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

        unixOutput.value = unixOutputState === 'ms' ? standardTime.getTime().toString() : standardTime.getTime().toString().slice(0, -3);
        unixOutputCopy.disabled = false;
        unixOutputSwitch.disabled = false;
    }
}

/**
 * Updates the unix time input and triggers the update of the standard time output
 */
function updateUnixTime() {
    unixInput.value = unixInputState === 's' ? new Date().getTime().toString().slice(0, -3) : new Date().getTime().toString();
    updateStandardOutput();
}

/**
 * Updates the standard time output
 */
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
        standardOutput.value = `${unixInputState === 'ms' ? timeString.replace(/ (AM|PM)/, `.${unixTime.getMilliseconds().toString().padStart(3, '0')} $1`) : timeString}, ${unixTime.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}`;
        standardOutputCopy.disabled = false;
    }
}

/**
 * Switches the state of the unix time output (seconds to milliseconds and vice versa)
 */
function switchUnixOutput() {
    if (unixOutputState === 's') {
        unixOutputState = 'ms';
        unixOutputTitle.textContent = 'UNIX Time (milliseconds):';
        unixOutputSwitch.textContent = 'Switch to seconds';
    } else if (unixOutputState === 'ms') {
        unixOutputState = 's';
        unixOutputTitle.textContent = 'UNIX Time (seconds):';
        unixOutputSwitch.textContent = 'Switch to milliseconds';
    }
    updateUnixOutput();
}

/**
 * Switches the state of the unix time input (seconds to milliseconds and vice versa)
 */
function switchUnixInput() {
    if (unixInputState === 's') {
        unixInputState = 'ms';
        unixInputTitle.textContent = 'UNIX Time (milliseconds):';
        unixInputSwitch.textContent = 'Switch to seconds';
    } else if (unixInputState === 'ms') {
        unixInputState = 's';
        unixInputTitle.textContent = 'UNIX Time (seconds):';
        unixInputSwitch.textContent = 'Switch to milliseconds';
    }
    updateStandardOutput();
}

updateStandardTime();
updateUnixOutput();
updateUnixTime();
updateStandardOutput();
