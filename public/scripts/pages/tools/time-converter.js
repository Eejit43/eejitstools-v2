/* global math */

import { copyValue, showAlert } from '/scripts/functions.js';

const inputType = document.getElementById('input-type');
const input = document.getElementById('input');
const resetButton = document.getElementById('reset');
const message = document.getElementById('message');
const outputType = document.getElementById('output-type');
const output = document.getElementById('output');
const copyOutput = document.getElementById('copy-output');

/* Add event listeners */
inputType.addEventListener('change', convert);
input.addEventListener('input', convert);
resetButton.addEventListener('click', () => {
    input.value = '';
    output.value = '';
    message.innerHTML = '';
    inputType.value = 7;
    outputType.value = 5;
    copyOutput.disabled = true;

    resetButton.disabled = true;
    resetButton.innerHTML = 'Reset!';
    showAlert('Reset!', 'success');

    setTimeout(() => {
        copyOutput.disabled = true;

        resetButton.disabled = false;
        resetButton.innerHTML = 'Reset';
    }, 2000);
});
outputType.addEventListener('change', convert);
copyOutput.addEventListener('click', () => copyValue(copyOutput, output));

/**
 * Converts the provided time value and displays the result
 */
function convert() {
    if (/^-?([0-9]\d*)(\.\d*|,\d*)*$/g.test(input.value) || /^-?\d*\.\d+$/g.test(input.value)) {
        message.innerHTML = '';
        output.value = math.number(math.format(math.evaluate(`${input.value} ${types[inputType.value]} to ${types[outputType.value]}`), { notation: 'fixed', precision: 15 }).replace(/[^0-9-.]/g, '')).toLocaleString(undefined, { maximumFractionDigits: 12 });
        copyOutput.disabled = false;
    } else {
        if (input.value !== '') message.innerHTML = '<i class="fa-solid fa-exclamation-triangle"></i> Input is not a number!<br />';
        else message.innerHTML = '';
        output.value = '';
        copyOutput.disabled = true;
    }
}

const types = {
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
