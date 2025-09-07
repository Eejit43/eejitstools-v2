import { copyValue, showAlert } from '../../functions.js';

const inputType = document.querySelector<HTMLSelectElement>('#input-type')!;
const input = document.querySelector<HTMLInputElement>('#input')!;
const resetButton = document.querySelector<HTMLButtonElement>('#reset')!;
const message = document.querySelector<HTMLDivElement>('#message')!;
const outputType = document.querySelector<HTMLSelectElement>('#output-type')!;
const output = document.querySelector<HTMLInputElement>('#output')!;
const copyOutputButton = document.querySelector<HTMLButtonElement>('#copy-output')!;
const toggleSpacersButton = document.querySelector<HTMLButtonElement>('#toggle-spacers')!;

/* Add event listeners */
inputType.addEventListener('change', findInput);
input.addEventListener('input', findInput);
resetButton.addEventListener('click', () => {
    input.value = '';
    output.value = '';
    message.textContent = '';
    inputType.value = '3';
    outputType.value = '1';
    copyOutputButton.disabled = true;
    toggleSpacersButton.disabled = true;

    resetButton.disabled = true;
    resetButton.textContent = 'Reset!';
    showAlert('Reset!', 'success');

    setTimeout(() => {
        copyOutputButton.disabled = true;
        toggleSpacersButton.disabled = true;

        resetButton.disabled = false;
        resetButton.textContent = 'Reset';
    }, 2000);
});
outputType.addEventListener('change', findInput);
copyOutputButton.addEventListener('click', () => {
    copyValue(copyOutputButton, output);
});

let addSpacers = true;
toggleSpacersButton.addEventListener('click', () => {
    addSpacers = !addSpacers;
    findInput();
});

/**
 * Checks the input value and gives an error message if the input is invalid.
 */
function findInput() {
    if (input.value.length > 0)
        switch (radices[inputType.value].number) {
            case 2: {
                if (/^-?[.01]+$/.test(input.value)) convert(input.value, 2);
                else notValid();
                break;
            }
            case 8: {
                if (/^-?[.0-7]+$/.test(input.value)) convert(input.value, 8);
                else notValid();
                break;
            }
            case 10: {
                if (/^-?[\d.]+$/.test(input.value)) convert(input.value, 10);
                else notValid();
                break;
            }
            case 16: {
                if (/^-?[\d.A-Fa-f]+$/.test(input.value)) convert(input.value, 16);
                else notValid();
                break;
            }
            default: {
                notValid();
                break;
            }
        }
    else {
        message.textContent = '';
        output.value = '';
        copyOutputButton.disabled = true;
        toggleSpacersButton.disabled = true;
    }
}

/**
 * Converts the given value and displays the converted value.
 * @param value The value to convert.
 * @param radix The base of the input value.
 */
function convert(value: string, radix: number) {
    const periods = value.match(/\./g);
    if (periods && periods.length > 1) {
        notValid();
        return;
    }

    let result = parseNumberWithRadix(value, radix).toString(radices[outputType.value].number);

    // Not using isNaN() as it won't account for hex values
    if (!result || result === 'NaN') {
        notValid();
        return;
    }

    switch (radices[outputType.value].name) {
        case 'binary': {
            result = addSpacers ? addBinarySpacers(result) : result;
            break;
        }
        case 'decimal': {
            result = addSpacers ? Number.parseInt(result).toLocaleString() : result;
            break;
        }
        default: {
            break;
        }
    }

    message.textContent = '';
    output.value = result;
    copyOutputButton.disabled = false;
    toggleSpacersButton.disabled = false;
}

/**
 * Converts a string to an integer/float.
 * @param number The number to convert.
 * @param radix The base of the number (defaults to `10`).
 */
function parseNumberWithRadix(number: string, radix = 10) {
    radix = Math.trunc(radix);
    const [a, b] = number.split('.');
    const l = Number.parseInt('1' + (b || ''), radix).toString(radix).length;
    return Number.parseInt(a, radix) + Number.parseInt(b || '0', radix) / Number.parseInt('1' + Array.from({ length: l }).join('0'), radix);
}

/**
 * Handles an invalid input.
 */
function notValid() {
    message.innerHTML = `<i class="fa-solid fa-exclamation-triangle"></i> Malformed input${inputType.value in radices ? ` (should be in ${radices[inputType.value].name} format)` : ''}!<br />`;
    output.value = '';
    copyOutputButton.disabled = true;
    toggleSpacersButton.disabled = true;
}

/**
 * Adds spaces to a binary number.
 * @param binary The binary number to add spaces to.
 */
function addBinarySpacers(binary: string) {
    const sign = binary.startsWith('-') ? '-' : '';

    const binaryParts = binary.replace(/^-/, '').split('.');

    let result = (binaryParts[0].padStart(Math.ceil(binaryParts[0].length / 4) * 4, '0').match(/[01]{4}/g) as string[]).join(' ');

    if (binaryParts.length > 1)
        result += `.${(binaryParts[1].padEnd(Math.ceil(binaryParts[1].length / 4) * 4, '0').match(/[01]{4}/g) as string[]).join(' ')}`;

    return sign + result;
}

const radices: Record<string, { number: number; name: string }> = {
    1: { number: 2, name: 'binary' },
    2: { number: 8, name: 'octal' },
    3: { number: 10, name: 'decimal' },
    4: { number: 16, name: 'hexadecimal' },
};
