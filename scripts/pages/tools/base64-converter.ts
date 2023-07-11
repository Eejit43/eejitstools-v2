import { copyValue, resetResult, showAlert, showResult } from '../../functions.js';

const input = document.getElementById('input') as HTMLTextAreaElement;
const encodeButton = document.getElementById('encode') as HTMLButtonElement;
const decodeButton = document.getElementById('decode') as HTMLButtonElement;
const clearButton = document.getElementById('clear') as HTMLButtonElement;
const result = document.getElementById('result') as HTMLTextAreaElement;
const copyResult = document.getElementById('copy-result') as HTMLButtonElement;

/* Add event listeners */
encodeButton.addEventListener('click', encode);
decodeButton.addEventListener('click', decode);
clearButton.addEventListener('click', () => {
    input.value = '';
    result.value = '';
    copyResult.disabled = true;

    clearButton.disabled = true;
    clearButton.textContent = 'Cleared!';
    showAlert('Cleared!', 'success');
    resetResult('encode');
    resetResult('decode');

    setTimeout(() => {
        copyResult.disabled = true;

        clearButton.disabled = false;
        clearButton.textContent = 'Clear';
    }, 2000);
});
copyResult.addEventListener('click', () => {
    copyValue(copyResult, result);
});

/**
 * Encodes the base64 and displays the result.
 */
function encode() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('encode', 'error');
    } else
        try {
            result.value = btoa(input.value);
            showResult('encode', 'success');
            copyResult.disabled = false;
        } catch {
            showAlert('Malformed input!', 'error');
            showResult('encode', 'error');
        }
}

/**
 * Decodes the base64 and displays the result.
 */
function decode() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('decode', 'error');
    } else
        try {
            result.value = atob(input.value);
            showResult('decode', 'success');
            copyResult.disabled = false;
        } catch {
            showAlert('Malformed input!', 'error');
            showResult('decode', 'error');
        }
}
