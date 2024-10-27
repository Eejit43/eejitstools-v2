import type { MathJsInstance } from 'mathjs';
import { copyValue, showAlert, showResult } from '../../functions.js';

declare global {
    interface Window {
        math: MathJsInstance;
    }
}

const inputType = document.querySelector<HTMLSelectElement>('#input-type')!;
const input = document.querySelector<HTMLInputElement>('#input')!;
const resetButton = document.querySelector<HTMLButtonElement>('#reset')!;
const switchButton = document.querySelector<HTMLButtonElement>('#switch')!;
const message = document.querySelector<HTMLDivElement>('#message')!;
const outputType = document.querySelector<HTMLSelectElement>('#output-type')!;
const output = document.querySelector<HTMLInputElement>('#output')!;
const copyOutputButton = document.querySelector<HTMLButtonElement>('#copy-output')!;

/* Add event listeners */
inputType.addEventListener('change', convert);
input.addEventListener('input', convert);
resetButton.addEventListener('click', () => {
    input.value = '';
    output.value = '';
    message.textContent = '';
    inputType.value = '9';
    outputType.value = '7';
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

    showAlert('Swapped input and output!', 'success');
    showResult(switchButton, 'success');
});
outputType.addEventListener('change', convert);
copyOutputButton.addEventListener('click', () => {
    copyValue(copyOutputButton, output);
});

window.math.createUnit('nauticalMile', { definition: '1852 meter' });

/**
 * Converts the provided length value and displays the result.
 */
function convert() {
    input.value = input.value.replaceAll(',', '');

    if (/^-?(\d+)(\.\d*|,\d*)*$|^-?\d*\.\d+$/g.test(input.value)) {
        message.textContent = '';
        output.value = window.math
            .number(
                window.math
                    .format(window.math.evaluate(`${input.value} ${types[inputType.value]} to ${types[outputType.value]}`), {
                        notation: 'fixed',
                        precision: 15,
                    })
                    .replaceAll(/[^\d.-]/g, ''),
            )
            .toLocaleString(undefined, { maximumFractionDigits: 12 });
        copyOutputButton.disabled = false;
    } else {
        message.innerHTML = input.value.length > 0 ? '<i class="fa-solid fa-exclamation-triangle"></i> Input is not a number!<br />' : '';
        output.value = '';
        copyOutputButton.disabled = true;
    }
}

const types: Record<string, string> = {
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
    11: 'nauticalMile',
};
