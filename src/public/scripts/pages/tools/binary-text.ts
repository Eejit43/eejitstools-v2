import { copyValue, showAlert, showResult } from '../../functions.js';

const input = document.querySelector<HTMLTextAreaElement>('#input')!;
const toBinaryButton = document.querySelector<HTMLButtonElement>('#to-binary')!;
const fromBinaryButton = document.querySelector<HTMLButtonElement>('#from-binary')!;
const clearButton = document.querySelector<HTMLButtonElement>('#clear')!;
const result = document.querySelector<HTMLTextAreaElement>('#result')!;
const resultCopyButton = document.querySelector<HTMLButtonElement>('#copy-result')!;

/* Add event listeners */
toBinaryButton.addEventListener('click', toBinary);
fromBinaryButton.addEventListener('click', fromBinary);
clearButton.addEventListener('click', () => {
    input.value = '';
    result.value = '';
    resultCopyButton.disabled = true;

    clearButton.disabled = true;
    clearButton.textContent = 'Cleared!';
    showAlert('Cleared!', 'success');

    setTimeout(() => {
        resultCopyButton.disabled = true;

        clearButton.disabled = false;
        clearButton.textContent = 'Clear';
    }, 2000);
});
resultCopyButton.addEventListener('click', () => {
    copyValue(resultCopyButton, result);
});

/**
 * Converts the provided string to binary and displays the result.
 */
function toBinary() {
    if (input.value.trim().length <= 0) {
        result.value = '';
        resultCopyButton.disabled = true;
        showResult(toBinaryButton, 'warning');
        showAlert('Empty input!', 'warning');
    } else {
        result.value = stringToBinary(input.value.trim());
        resultCopyButton.disabled = false;
        showResult(toBinaryButton, 'success');
    }
}

/**
 * Converts the provided string from binary and displays the result.
 */
function fromBinary() {
    if (input.value.trim().length <= 0) {
        result.value = '';
        resultCopyButton.disabled = true;
        showResult(fromBinaryButton, 'warning');
        showAlert('Empty input!', 'warning');
    } else if (/^[ 01]+$/gm.test(input.value.trim())) {
        result.value = binaryToString(input.value.trim());
        resultCopyButton.disabled = false;
        showResult(fromBinaryButton, 'success');
    } else {
        result.value = '';
        resultCopyButton.disabled = true;
        showResult(fromBinaryButton, 'error');
        showAlert('Invalid binary!', 'error');
    }
}

/**
 * Encodes a string into binary.
 * @param string String to encode.
 */
function stringToBinary(string: string) {
    return [...string].map((character) => character.codePointAt(0)!.toString(2)).join(' '); // eslint-disable-line @typescript-eslint/no-misused-spread
}

/**
 * Decodes binary to string.
 * @param binary Binary to decode.
 */
function binaryToString(binary: string) {
    return binary
        .split(' ')
        .map((part) => String.fromCodePoint(Number.parseInt(part, 2)))
        .join('');
}
