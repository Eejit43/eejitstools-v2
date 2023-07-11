import type math from 'mathjs';
import { copyValue, showAlert } from '../../functions.js';

declare global {
    interface Window {
        math: typeof math;
    }
}

const inputType = document.getElementById('input-type') as HTMLSelectElement;
const input = document.getElementById('input') as HTMLInputElement;
const resetButton = document.getElementById('reset') as HTMLButtonElement;
const switchButton = document.getElementById('switch') as HTMLButtonElement;
const message = document.getElementById('message') as HTMLSpanElement;
const outputType = document.getElementById('output-type') as HTMLSelectElement;
const output = document.getElementById('output') as HTMLInputElement;
const copyOutputButton = document.getElementById('copy-output') as HTMLButtonElement;

/* Add event listeners */
inputType.addEventListener('change', convert);
input.addEventListener('input', convert);
resetButton.addEventListener('click', () => {
    input.value = '';
    output.value = '';
    message.textContent = '';
    inputType.value = '7';
    outputType.value = '5';
    copyOutputButton.disabled = true;

    resetButton.disabled = true;
    resetButton.textContent = 'Reset!';
    showAlert('Reset!', 'success');

    setTimeout(() => {
        copyOutputButton.disabled = true;

        resetButton.disabled = false;
        resetButton.textContent = 'Reset';
    }, 2000);
});
switchButton.addEventListener('click', () => {
    const inputValue = input.value;
    const inputTypeValue = inputType.value;
    const outputValue = output.value;
    const outputTypeValue = outputType.value;

    input.value = outputValue;
    inputType.value = outputTypeValue;
    output.value = inputValue;
    outputType.value = inputTypeValue;

    convert();

    showAlert('Swapped input and output!', '#1c62d4');
});
outputType.addEventListener('change', convert);
copyOutputButton.addEventListener('click', () => copyValue(copyOutputButton, output));

/**
 * Converts the provided time value and displays the result.
 */
function convert() {
    input.value = input.value.replace(/,/g, '');

    if (/^-?([0-9]\d*)(\.\d*|,\d*)*$/g.test(input.value) || /^-?\d*\.\d+$/g.test(input.value)) {
        message.textContent = '';
        output.value = window.math.number(window.math.format(window.math.evaluate(`${input.value} ${types[inputType.value]} to ${types[outputType.value]}`), { notation: 'fixed', precision: 15 }).replace(/[^0-9-.]/g, '')).toLocaleString(undefined, { maximumFractionDigits: 12 });
        copyOutputButton.disabled = false;
    } else {
        if (input.value !== '') message.innerHTML = '<i class="fa-solid fa-exclamation-triangle"></i> Input is not a number!<br />';
        else message.textContent = '';
        output.value = '';
        copyOutputButton.disabled = true;
    }
}

const types: { [key: string]: string } = {
    1: 'nanoseconds',
    2: 'microseconds',
    3: 'milliseconds',
    4: 'seconds',
    5: 'minutes',
    6: 'hours',
    7: 'days',
    8: 'weeks',
    9: 'months',
    10: 'years',
    11: 'decades',
    12: 'centuries',
    13: 'millennia'
};
