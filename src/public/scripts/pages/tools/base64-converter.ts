import { copyValue, showAlert, showResult } from '../../functions.js';

const input = document.querySelector('#input') as HTMLTextAreaElement;
const encodeButton = document.querySelector('#encode') as HTMLButtonElement;
const decodeButton = document.querySelector('#decode') as HTMLButtonElement;
const clearButton = document.querySelector('#clear') as HTMLButtonElement;
const result = document.querySelector('#result') as HTMLTextAreaElement;
const copyResultButton = document.querySelector('#copy-result') as HTMLButtonElement;

/* Add event listeners */
encodeButton.addEventListener('click', encode);
decodeButton.addEventListener('click', decode);
clearButton.addEventListener('click', () => {
    input.value = '';
    result.value = '';
    copyResultButton.disabled = true;

    clearButton.disabled = true;
    clearButton.textContent = 'Cleared!';
    showAlert('Cleared!', 'success');

    setTimeout(() => {
        copyResultButton.disabled = true;

        clearButton.disabled = false;
        clearButton.textContent = 'Clear';
    }, 2000);
});
copyResultButton.addEventListener('click', () => {
    copyValue(copyResultButton, result);
});

/**
 * Encodes the base64 and displays the result.
 */
function encode() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'warning');
        showResult(encodeButton, 'warning');
    } else
        try {
            result.value = btoa(input.value);
            showResult(encodeButton, 'success');
            copyResultButton.disabled = false;
        } catch {
            showAlert('Malformed input!', 'error');
            showResult(encodeButton, 'error');
        }
}

/**
 * Decodes the base64 and displays the result.
 */
function decode() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'warning');
        showResult(decodeButton, 'warning');
    } else
        try {
            result.value = atob(input.value);
            showResult(decodeButton, 'success');
            copyResultButton.disabled = false;
        } catch {
            showAlert('Malformed input!', 'error');
            showResult(decodeButton, 'error');
        }
}
