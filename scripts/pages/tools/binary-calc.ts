import { copyValue, showAlert } from '../../functions.js';

const inputType = document.getElementById('input-type') as HTMLSelectElement;
const input = document.getElementById('input') as HTMLInputElement;
const resetButton = document.getElementById('reset') as HTMLButtonElement;
const message = document.getElementById('message') as HTMLDivElement;
const outputType = document.getElementById('output-type') as HTMLSelectElement;
const output = document.getElementById('output') as HTMLInputElement;
const copyOutputButton = document.getElementById('copy-output') as HTMLButtonElement;
const toggleSpacersButton = document.getElementById('toggle-spacers') as HTMLButtonElement;

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
            case 2:
                if (/^-?[01.]+$/.test(input.value)) convert(input.value, 2);
                else notValid();
                break;
            case 8:
                if (/^-?[0-7.]+$/.test(input.value)) convert(input.value, 8);
                else notValid();
                break;
            case 10:
                if (/^-?[0-9.]+$/.test(input.value)) convert(input.value, 10);
                else notValid();
                break;
            case 16:
                if (/^-?[0-9a-fA-F.]+$/.test(input.value)) convert(input.value, 16);
                else notValid();
                break;
            default:
                notValid();
                break;
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
    if (periods && periods.length > 1) return notValid();

    let result = parseNumberWithRadix(value, radix).toString(radices[outputType.value].number);

    if (!result || result.toString() === 'NaN') return notValid(); // Not using isNaN() as it won't account for hex values

    switch (radices[outputType.value].name) {
        case 'binary':
            result = addSpacers ? addBinarySpacers(result) : result;
            break;
        case 'decimal':
            result = addSpacers ? parseInt(result).toLocaleString() : result;
            break;
        default:
            break;
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
    radix = radix | 0;
    const [a, b] = number.split('.');
    const l = parseInt('1' + (b || ''), radix).toString(radix).length;
    return parseInt(a, radix) + parseInt(b || '0', radix) / parseInt('1' + Array(l).join('0'), radix);
}

/**
 * Handles an invalid input.
 */
function notValid() {
    message.innerHTML = `<i class="fa-solid fa-exclamation-triangle"></i> Malformed input${radices[inputType.value] ? ` (should be in ${radices[inputType.value].name} format)` : ''}!<br />`;
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

    if (binary.length > 1) result += `.${(binaryParts[1].padEnd(Math.ceil(binaryParts[1].length / 4) * 4, '0').match(/[01]{4}/g) as string[]).join(' ')}`;

    return sign + result;
}

const radices: Record<string, { number: number; name: string }> = {
    1: { number: 2, name: 'binary' },
    2: { number: 8, name: 'octal' },
    3: { number: 10, name: 'decimal' },
    4: { number: 16, name: 'hexadecimal' }
};
