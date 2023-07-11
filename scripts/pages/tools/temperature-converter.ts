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
const copyOutput = document.getElementById('copy-output') as HTMLButtonElement;

/* Add event listeners */
inputType.addEventListener('change', convert);
input.addEventListener('input', convert);
resetButton.addEventListener('click', () => {
    input.value = '';
    output.value = '';
    message.textContent = '';
    inputType.value = '1';
    outputType.value = '2';
    copyOutput.disabled = true;

    resetButton.disabled = true;
    resetButton.textContent = 'Reset!';
    showAlert('Reset!', 'success');

    setTimeout(() => {
        copyOutput.disabled = true;

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
copyOutput.addEventListener('click', () => {
    copyValue(copyOutput, output);
});

/**
 * Converts a temperature to the specified output type and displays the result.
 */
function convert() {
    input.value = input.value.replace(/,/g, '');

    if (/^-?([0-9]\d*)(\.\d*|,\d*)*$/g.test(input.value) || /^-?\d*\.\d+$/g.test(input.value)) {
        message.textContent = '';
        output.value = Number(window.math.format(window.math.evaluate(`${input.value} ${types[inputType.value]} to ${types[outputType.value]}`), { notation: 'fixed', precision: 4 }).replace(/[^0-9-.]/g, '')).toLocaleString();
        copyOutput.disabled = false;
    } else {
        if (input.value !== '') message.innerHTML = '<i class="fa-solid fa-exclamation-triangle"></i> Input is not a number!<br />';
        else message.textContent = '';

        output.value = '';
        copyOutput.disabled = true;
    }
}

const types: { [key: string]: string } = {
    1: 'degF',
    2: 'degC',
    3: 'K'
};
