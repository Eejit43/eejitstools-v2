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
    if (input.value !== '') {
        switch (parseInt(inputType.value)) {
            /*
            1: Binary (2)
            2: Octal (8)
            3: Decimal (10)
            4: Hex (16)
            */
            case 1:
                if (/^[01]*$/.test(input.value)) {
                    convert(parseInt(input.value), 2);
                } else notValid();
                break;
            case 2:
                if (/^[0-7]*$/.test(input.value)) {
                    convert(parseInt(input.value), 8);
                } else notValid();
                break;
            case 3:
                if (/^[0-9]*$/.test(input.value)) {
                    convert(parseInt(input.value), 10);
                } else notValid();
                break;
            case 4:
                if (/^[0-9a-fA-F]*$/.test(input.value)) {
                    convert(input.value, 16);
                } else notValid();
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
    let outputTypeNumber;
    switch (parseInt(outputType.value)) {
        case 1:
            outputTypeNumber = 2;
            break;
        case 2:
            outputTypeNumber = 8;
            break;
        case 3:
            outputTypeNumber = 10;
            break;
        case 4:
            outputTypeNumber = 16;
            break;
    }

    message.innerHTML = '';
    output.value = parseInt(value, radix).toString(outputTypeNumber);
    copyOutput.disabled = false;
}

/**
 * Handles an invalid input
 */
function notValid() {
    let inputTypeText;
    switch (parseInt(inputType.value)) {
        case 1:
            inputTypeText = 'binary';
            break;
        case 2:
            inputTypeText = 'octal';
            break;
        case 3:
            inputTypeText = 'decimal';
            break;
        case 4:
            inputTypeText = 'hex';
            break;
    }

    message.innerHTML = `<i class="fa-solid fa-exclamation-triangle"></i> Malformed input (should be in ${inputTypeText} format)!<br />`;
    output.value = '';
    copyOutput.disabled = true;
}
