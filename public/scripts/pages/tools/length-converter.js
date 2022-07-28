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
    inputType.value = 9;
    outputType.value = 7;
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
copyOutput.addEventListener('click', () => {
    copyValue(copyOutput, output);
});

math.createUnit('nauticalMile', { definition: '1852 meter' });

/**
 * Converts the provided length value and displays the result
 */
function convert() {
    if (/^-?([0-9]\d*)(\.\d*|,\d*)*$|^-?\d*\.\d+$/g.test(input.value)) {
        message.innerHTML = '';
        output.value = math.number(math.format(math.evaluate(`${input.value} ${types[inputType.value]} to ${types[outputType.value]}`), { notation: 'fixed', precision: 15 }).replace(/[^0-9-.]/g, '')).toLocaleString(undefined, { maximumFractionDigits: 12 });
        copyOutput.disabled = false;
    } else {
        message.innerHTML = input.value.length > 0 ? '<i class="fa-solid fa-exclamation-triangle"></i> Input is not a number!<br />' : '';
        output.value = '';
        copyOutput.disabled = true;
    }
}

const types = {
    1: 'kilometer',
    2: 'meter',
    3: 'centimeter',
    4: 'millimeter',
    5: 'micrometer',
    6: 'nanometer',
    7: 'mile',
    8: 'yard',
    9: 'foot',
    10: 'inch',
    11: 'nauticalMile'
};
