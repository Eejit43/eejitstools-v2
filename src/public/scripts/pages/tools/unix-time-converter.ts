import { copyValue, updateArrow } from '@scripts/functions.js';

const standardInput = document.querySelector<HTMLInputElement>('#standard-input')!;
const standardInputResetButton = document.querySelector<HTMLButtonElement>('#standard-input-reset')!;
const standardArrow = document.querySelector<HTMLElement>('#standard-arrow')!;
const unixInput = document.querySelector<HTMLInputElement>('#unix-input')!;
const unixInputResetButton = document.querySelector<HTMLButtonElement>('#unix-input-reset')!;
const unixInputSwitchButton = document.querySelector<HTMLButtonElement>('#unix-input-switch')!;
const unixArrow = document.querySelector<HTMLElement>('#unix-arrow')!;
const unixOutputCopyButton = document.querySelector<HTMLButtonElement>('#unix-output-copy')!;
const unixOutputSwitchButton = document.querySelector<HTMLButtonElement>('#unix-output-switch')!;
const standardOutputCopyButton = document.querySelector<HTMLButtonElement>('#standard-output-copy')!;
const standardOutput = document.querySelector<HTMLInputElement>('#standard-output')!;
const unixOutput = document.querySelector<HTMLInputElement>('#unix-output')!;

const unixOutputTitle = document.querySelector<HTMLHeadingElement>('#unix-output-title')!;
const unixInputTitle = document.querySelector<HTMLHeadingElement>('#unix-input-title')!;

/* Add event listeners */
standardInput.addEventListener('input', updateUnixOutput);
standardInputResetButton.addEventListener('click', updateStandardTime);
unixInput.addEventListener('input', () => {
    unixInput.value = unixInput.value.replaceAll(/\D/g, '');

    updateStandardOutput();
});
unixInputResetButton.addEventListener('click', updateUnixTime);
unixInputSwitchButton.addEventListener('click', switchUnixInput);
unixOutputCopyButton.addEventListener('click', () => {
    copyValue(unixOutputCopyButton, unixOutput);
});
unixOutputSwitchButton.addEventListener('click', switchUnixOutput);
standardOutputCopyButton.addEventListener('click', () => {
    copyValue(standardOutputCopyButton, standardOutput);
});

let unixInputState = 's';
let unixOutputState = 's';

/**
 * Updates the standard time input and triggers the update of the unix time output.
 */
function updateStandardTime() {
    const currentTime = new Date();

    standardInput.value = `${currentTime.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric', second: 'numeric' })}, ${currentTime.toLocaleDateString(
        undefined,
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        },
    )}`;

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
    } else if (Number.isNaN(standardTime.getTime())) {
        updateArrow(standardArrow, 'error', 'down');
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
    unixInput.value = unixInputState === 's' ? Date.now().toString().slice(0, -3) : Date.now().toString();
    updateStandardOutput();
}

/**
 * Updates the standard time output.
 */
function updateStandardOutput() {
    const unixTime =
        unixInputState === 'ms' ? new Date(Number.parseInt(unixInput.value)) : new Date(Number.parseInt(unixInput.value) * 1000);
    if (unixInput.value.length === 0) {
        updateArrow(unixArrow, 'reset', 'down');
        standardOutput.value = '';
        standardOutputCopyButton.disabled = true;
    } else if (Number.isNaN(unixTime.getTime())) {
        updateArrow(unixArrow, 'error', 'down');
        standardOutput.value = '';
        standardOutputCopyButton.disabled = true;
    } else {
        updateArrow(unixArrow, 'success', 'down');

        const timeString = unixTime.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric', second: 'numeric' });
        standardOutput.value = `${
            unixInputState === 'ms'
                ? timeString.replace(/ (AM|PM)/, `.${unixTime.getMilliseconds().toString().padStart(3, '0')} $1`)
                : timeString
        }, ${unixTime.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`;
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
