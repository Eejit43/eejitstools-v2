import { copyValue, resetResult, showAlert, showResult } from '../../functions.js';

const input = document.getElementById('input') as HTMLTextAreaElement;
const toBinaryButton = document.getElementById('to-binary') as HTMLButtonElement;
const fromBinaryButton = document.getElementById('from-binary') as HTMLButtonElement;
const clearButton = document.getElementById('clear') as HTMLButtonElement;
const result = document.getElementById('result') as HTMLTextAreaElement;
const resultCopy = document.getElementById('copy-result') as HTMLButtonElement;

/* Add event listeners */
toBinaryButton.addEventListener('click', toBinary);
fromBinaryButton.addEventListener('click', fromBinary);
clearButton.addEventListener('click', () => {
    input.value = '';
    result.value = '';
    resultCopy.disabled = true;

    clearButton.disabled = true;
    clearButton.textContent = 'Cleared!';
    showAlert('Cleared!', 'success');
    resetResult('encode');
    resetResult('decode');

    setTimeout(() => {
        resultCopy.disabled = true;

        clearButton.disabled = false;
        clearButton.textContent = 'Clear';
    }, 2000);
});
resultCopy.addEventListener('click', () => {
    copyValue(resultCopy, result);
});

/**
 * Converts the provided string to binary and displays the result.
 */
function toBinary() {
    if (input.value.trim().length <= 0) {
        result.value = '';
        resultCopy.disabled = true;
        showResult('encode', 'error');
        showAlert('Empty input!', 'error');
    } else {
        result.value = stringToBinary(input.value.trim());
        resultCopy.disabled = false;
        showResult('encode', 'success');
    }
}

/**
 * Converts the provided string from binary and displays the result.
 */
function fromBinary() {
    if (input.value.trim().length <= 0) {
        result.value = '';
        resultCopy.disabled = true;
        showResult('decode', 'error');
        showAlert('Empty input!', 'error');
    } else if (/^[ 01]+$/gm.test(input.value.trim())) {
        result.value = binaryToString(input.value.trim());
        resultCopy.disabled = false;
        showResult('decode', 'success');
    } else {
        result.value = '';
        resultCopy.disabled = true;
        showResult('decode', 'error');
        showAlert('Invalid binary!', 'error');
    }
}

/**
 * Encodes a string into binary.
 * @param string String to encode.
 */
function stringToBinary(string: string) {
    return string
        .split('')
        .map((character) => character.charCodeAt(0).toString(2))
        .join(' ');
}

/**
 * Decodes binary to string.
 * @param binary Binary to decode.
 */
function binaryToString(binary: string) {
    return binary
        .split(' ')
        .map((part) => String.fromCharCode(parseInt(part, 2)))
        .join('');
}
