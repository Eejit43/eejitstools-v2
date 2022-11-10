import { copyValue, showAlert } from '/scripts/functions.js';

const inputType = document.getElementById('input-type');
const input = document.getElementById('input');
const resetButton = document.getElementById('reset');
const message = document.getElementById('message');
const outputType = document.getElementById('output-type');
const output = document.getElementById('output');
const copyOutput = document.getElementById('copy-output');
const toggleSpacers = document.getElementById('toggle-spacers');

/* Add event listeners */
inputType.addEventListener('change', findInput);
input.addEventListener('input', findInput);
resetButton.addEventListener('click', () => {
    input.value = '';
    output.value = '';
    message.innerHTML = '';
    inputType.value = 3;
    outputType.value = 1;
    copyOutput.disabled = true;
    toggleSpacers.disabled = true;

    resetButton.disabled = true;
    resetButton.textContent = 'Reset!';
    showAlert('Reset!', 'success');

    setTimeout(() => {
        copyOutput.disabled = true;
        toggleSpacers.disabled = true;

        resetButton.disabled = false;
        resetButton.textContent = 'Reset';
    }, 2000);
});
outputType.addEventListener('change', findInput);
copyOutput.addEventListener('click', () => {
    copyValue(copyOutput, output);
});

let addSpacers = true;
toggleSpacers.addEventListener('click', () => {
    addSpacers = !addSpacers;
    findInput();
});

/**
 * Checks the input value and gives an error message if the input is invalid
 */
function findInput() {
    if (input.value.length > 0) {
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
    } else {
        message.innerHTML = '';
        output.value = '';
        copyOutput.disabled = true;
        toggleSpacers.disabled = true;
    }
}

/**
 * Converts the given value and displays the converted value
 * @param {string} value the value to convert
 * @param {number} radix the base of the input value
 * @returns {void}
 */
function convert(value, radix) {
    if (value.match(/\./g)?.length > 1) return notValid();

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

    message.innerHTML = '';
    output.value = result;
    copyOutput.disabled = false;
    toggleSpacers.disabled = false;
}

/**
 * Converts a string to an integer/float
 * @param {string} number the number to convert
 * @param {number} [radix=10] the base of the number
 * @returns {number} the converted number
 */
function parseNumberWithRadix(number, radix) {
    radix = (radix || 10) | 0;
    const [a, b] = number.split('.');
    const l = parseInt('1' + (b || ''), radix).toString(radix).length;
    return parseInt(a, radix) + parseInt(b || '0', radix) / parseInt('1' + Array(l).join('0'), radix);
}

/**
 * Handles an invalid input
 */
function notValid() {
    message.innerHTML = `<i class="fa-solid fa-exclamation-triangle"></i> Malformed input${radices[inputType.value] ? ` (should be in ${radices[inputType.value].name} format)` : ''}!<br />`;
    output.value = '';
    copyOutput.disabled = true;
    toggleSpacers.disabled = true;
}

/**
 * Adds spaces to a binary number
 * @param {string} binary the binary number to add spaces to
 * @returns {string} the binary number with spaces
 */
function addBinarySpacers(binary) {
    const sign = binary.startsWith('-') ? '-' : '';

    binary = binary.replace(/^-/, '').split('.');

    let result = binary[0]
        .padStart(Math.ceil(binary[0].length / 4) * 4, '0')
        .match(/[01]{4}/g)
        .join(' ');

    if (binary.length > 1)
        result += `.${binary[1]
            .padEnd(Math.ceil(binary[1].length / 4) * 4, '0')
            .match(/[01]{4}/g)
            .join(' ')}`;

    return sign + result;
}

const radices = {
    1: { number: 2, name: 'binary' },
    2: { number: 8, name: 'octal' },
    3: { number: 10, name: 'decimal' },
    4: { number: 16, name: 'hexadecimal' }
};
