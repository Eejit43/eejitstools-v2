import { copyValue, showAlert } from '/scripts/functions.js';

const inputType = document.getElementById('input-type');
const input = document.getElementById('input');
const resetButton = document.getElementById('reset');
const message = document.getElementById('message');
const outputType = document.getElementById('output-type');
const output = document.getElementById('output');
const copyOutput = document.getElementById('copy-output');

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

    resetButton.disabled = true;
    resetButton.textContent = 'Reset!';
    showAlert('Reset!', 'success');

    setTimeout(() => {
        copyOutput.disabled = true;

        resetButton.disabled = false;
        resetButton.textContent = 'Reset';
    }, 2000);
});
outputType.addEventListener('change', findInput);
copyOutput.addEventListener('click', () => {
    copyValue(copyOutput, output);
});

/**
 * Checks the input value and gives an error message if the input is invalid
 */
function findInput() {
    if (input.value.length > 0) {
        switch (radices[inputType.value].number) {
            case 2:
                if (/^[01]*$/.test(input.value)) convert(input.value, 2);
                else notValid();
                break;
            case 8:
                if (/^[0-7]*$/.test(input.value)) convert(input.value, 8);
                else notValid();
                break;
            case 10:
                if (/^[0-9]*$/.test(input.value)) convert(input.value, 10);
                else notValid();
                break;
            case 16:
                if (/^[0-9a-fA-F]*$/.test(input.value)) convert(input.value, 16);
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
    }
}

/**
 * Converts the given value and displays the converted value
 * @param {number} value the value to convert
 * @param {number} radix the base of the input value
 */
function convert(value, radix) {
    message.innerHTML = '';
    output.value = parseInt(value, radix).toString(radices[outputType.value].number);
    copyOutput.disabled = false;
}

/**
 * Handles an invalid input
 */
function notValid() {
    message.innerHTML = `<i class="fa-solid fa-exclamation-triangle"></i> Malformed input${radices[inputType.value] ? ` (should be in ${radices[inputType.value].name} format)` : ''}!<br />`;
    output.value = '';
    copyOutput.disabled = true;
}

const radices = {
    1: { number: 2, name: 'binary' },
    2: { number: 8, name: 'octal' },
    3: { number: 10, name: 'decimal' },
    4: { number: 16, name: 'hexadecimal' }
};
