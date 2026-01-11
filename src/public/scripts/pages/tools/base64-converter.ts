import { copyValue, showAlert, showResult } from '@scripts/functions.js';

const input = document.querySelector<HTMLTextAreaElement>('#input')!;
const encodeButton = document.querySelector<HTMLButtonElement>('#encode')!;
const decodeButton = document.querySelector<HTMLButtonElement>('#decode')!;
const clearButton = document.querySelector<HTMLButtonElement>('#clear')!;
const result = document.querySelector<HTMLTextAreaElement>('#result')!;
const copyResultButton = document.querySelector<HTMLButtonElement>('#copy-result')!;

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
