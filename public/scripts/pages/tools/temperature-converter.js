/* global math */

import { copyValue, showAlert } from '/scripts/functions.js';

const inputType = document.getElementById('input-type');
const input = document.getElementById('input');
const resetButton = document.getElementById('reset');
const switchButton = document.getElementById('switch');
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
    inputType.value = 1;
    outputType.value = 2;
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

    showAlert('Moved to input!', '#1c62d4');
});
outputType.addEventListener('change', convert);
copyOutput.addEventListener('click', () => {
    copyValue(copyOutput, output);
});

/**
 * Converts a temperature to the specified output type and displays the result
 */
function convert() {
    if (/^-?([0-9]\d*)(\.\d*|,\d*)*$/g.test(input.value) || /^-?\d*\.\d+$/g.test(input.value)) {
        message.innerHTML = '';
        output.value = Number(math.format(math.evaluate(`${input.value} ${types[inputType.value]} to ${types[outputType.value]}`), { notation: 'fixed', precision: 4 }).replace(/[^0-9-.]/g, '')).toLocaleString();
        copyOutput.disabled = false;
    } else {
        if (input.value !== '') message.innerHTML = '<i class="fa-solid fa-exclamation-triangle"></i> Input is not a number!<br />';
        else message.innerHTML = '';

        output.value = '';
        copyOutput.disabled = true;
    }
}

const types = {
    1: 'degF',
    2: 'degC',
    3: 'K'
};
