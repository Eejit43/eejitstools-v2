import { copyValue, updateArrow } from '../../functions.js';

const standardInput = document.getElementById('standard-input') as HTMLInputElement;
const standardInputResetButton = document.getElementById('standard-input-reset') as HTMLButtonElement;
const standardArrow = document.getElementById('standard-arrow') as HTMLElement;
const unixInput = document.getElementById('unix-input') as HTMLInputElement;
const unixInputResetButton = document.getElementById('unix-input-reset') as HTMLButtonElement;
const unixInputSwitchButton = document.getElementById('unix-input-switch') as HTMLButtonElement;
const unixArrow = document.getElementById('unix-arrow') as HTMLElement;
const unixOutputCopyButton = document.getElementById('unix-output-copy') as HTMLButtonElement;
const unixOutputSwitchButton = document.getElementById('unix-output-switch') as HTMLButtonElement;
const standardOutputCopyButton = document.getElementById('standard-output-copy') as HTMLButtonElement;
const standardOutput = document.getElementById('standard-output') as HTMLInputElement;
const unixOutput = document.getElementById('unix-output') as HTMLInputElement;

const unixOutputTitle = document.getElementById('unix-output-title') as HTMLSpanElement;
const unixInputTitle = document.getElementById('unix-input-title') as HTMLSpanElement;

/* Add event listeners */
standardInput.addEventListener('input', updateUnixOutput);
standardInputResetButton.addEventListener('click', updateStandardTime);
unixInput.addEventListener('input', updateStandardOutput);
unixInputResetButton.addEventListener('click', updateUnixTime);
unixInputSwitchButton.addEventListener('click', switchUnixInput);
unixOutputCopyButton.addEventListener('click', () => copyValue(unixOutputCopyButton, unixOutput));
unixOutputSwitchButton.addEventListener('click', switchUnixOutput);
standardOutputCopyButton.addEventListener('click', () => copyValue(standardOutputCopyButton, standardOutput));

let unixInputState = 's';
let unixOutputState = 's';

/**
 * Updates the standard time input and triggers the update of the unix time output.
 */
function updateStandardTime() {
    const currentTime = new Date();

    standardInput.value = `${currentTime.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric', second: 'numeric' })}, ${currentTime.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`;

    updateUnixOutput();
}

/**
 * Updates the unix time output.
 */
function updateUnixOutput() {
    const standardTime = new Date(standardInput.value);
    if (standardInput.value.length === 0) {
        updateArrow(standardArrow, 'reset', 'down');
        unixOutput.value = '';
        unixOutputCopyButton.disabled = true;
        unixOutputSwitchButton.disabled = true;
    } else if (isNaN(standardTime.getTime())) {
        updateArrow(standardArrow, 'error');
        unixOutput.value = '';
        unixOutputCopyButton.disabled = true;
        unixOutputSwitchButton.disabled = true;
    } else {
        updateArrow(standardArrow, 'success', 'down');

        unixOutput.value = unixOutputState === 'ms' ? standardTime.getTime().toString() : standardTime.getTime().toString().slice(0, -3);
        unixOutputCopyButton.disabled = false;
        unixOutputSwitchButton.disabled = false;
    }
}

/**
 * Updates the unix time input and triggers the update of the standard time output.
 */
function updateUnixTime() {
    unixInput.value = unixInputState === 's' ? new Date().getTime().toString().slice(0, -3) : new Date().getTime().toString();
    updateStandardOutput();
}

/**
 * Updates the standard time output.
 */
function updateStandardOutput() {
    const unixTime = unixInputState === 'ms' ? new Date(parseInt(unixInput.value)) : new Date(parseInt(unixInput.value) * 1000);
    if (unixInput.value.length === 0) {
        updateArrow(unixArrow, 'reset', 'down');
        standardOutput.value = '';
        standardOutputCopyButton.disabled = true;
    } else if (isNaN(unixTime.getTime())) {
        updateArrow(unixArrow, 'error');
        standardOutput.value = '';
        standardOutputCopyButton.disabled = true;
    } else {
        updateArrow(unixArrow, 'success', 'down');

        const timeString = unixTime.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric', second: 'numeric' });
        standardOutput.value = `${unixInputState === 'ms' ? timeString.replace(/ (AM|PM)/, `.${unixTime.getMilliseconds().toString().padStart(3, '0')} $1`) : timeString}, ${unixTime.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`;
        standardOutputCopyButton.disabled = false;
    }
}

/**
 * Switches the state of the unix time output (seconds to milliseconds and vice versa).
 */
function switchUnixOutput() {
    if (unixOutputState === 's') {
        unixOutputState = 'ms';
        unixOutputTitle.textContent = 'UNIX Time (milliseconds):';
        unixOutputSwitchButton.textContent = 'Switch to seconds';
    } else if (unixOutputState === 'ms') {
        unixOutputState = 's';
        unixOutputTitle.textContent = 'UNIX Time (seconds):';
        unixOutputSwitchButton.textContent = 'Switch to milliseconds';
    }
    updateUnixOutput();
}

/**
 * Switches the state of the unix time input (seconds to milliseconds and vice versa).
 */
function switchUnixInput() {
    if (unixInputState === 's') {
        unixInputState = 'ms';
        unixInputTitle.textContent = 'UNIX Time (milliseconds):';
        unixInputSwitchButton.textContent = 'Switch to seconds';
    } else if (unixInputState === 'ms') {
        unixInputState = 's';
        unixInputTitle.textContent = 'UNIX Time (seconds):';
        unixInputSwitchButton.textContent = 'Switch to milliseconds';
    }
    updateStandardOutput();
}

updateStandardTime();
updateUnixOutput();
updateUnixTime();
updateStandardOutput();
