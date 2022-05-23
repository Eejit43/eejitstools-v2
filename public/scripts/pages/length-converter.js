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

math.createUnit('nauticalmile', { definition: '1852 meter' });

function convert() {
    if (/^-?([0-9]\d*)(\.\d*|,\d*)*$/g.test(input.value) || /^-?\d*\.\d+$/g.test(input.value)) {
        let inputTypeName, outputTypeName;
        if (inputType.value === '1') inputTypeName = 'kilometer';
        else if (inputType.value === '2') inputTypeName = 'meter';
        else if (inputType.value === '3') inputTypeName = 'centimeter';
        else if (inputType.value === '4') inputTypeName = 'millimeter';
        else if (inputType.value === '5') inputTypeName = 'micrometer';
        else if (inputType.value === '6') inputTypeName = 'nanometer';
        else if (inputType.value === '7') inputTypeName = 'mile';
        else if (inputType.value === '8') inputTypeName = 'yard';
        else if (inputType.value === '9') inputTypeName = 'foot';
        else if (inputType.value === '10') inputTypeName = 'inch';
        else if (inputType.value === '11') inputTypeName = 'nauticalmile';

        if (outputType.value === '1') outputTypeName = 'kilometer';
        else if (outputType.value === '2') outputTypeName = 'meter';
        else if (outputType.value === '3') outputTypeName = 'centimeter';
        else if (outputType.value === '4') outputTypeName = 'millimeter';
        else if (outputType.value === '5') outputTypeName = 'micrometer';
        else if (outputType.value === '6') outputTypeName = 'nanometer';
        else if (outputType.value === '7') outputTypeName = 'mile';
        else if (outputType.value === '8') outputTypeName = 'yard';
        else if (outputType.value === '9') outputTypeName = 'foot';
        else if (outputType.value === '10') outputTypeName = 'inch';
        else if (outputType.value === '11') outputTypeName = 'nauticalmile';

        message.innerHTML = '';
        output.value = math.number(math.format(math.evaluate(`${input.value} ${inputTypeName} to ${outputTypeName}`), { notation: 'fixed', precision: 15 }).replace(/[^0-9-.]/g, '')).toLocaleString(undefined, { maximumFractionDigits: 12 });
        copyOutput.disabled = false;
    } else {
        if (input.value !== '') message.innerHTML = '<i class="fa-solid fa-exclamation-triangle"></i> Input is not a number!<br />';
        else message.innerHTML = '';
        output.value = '';
        copyOutput.disabled = true;
    }
}
