import { showAlert, showResult } from '../../functions.js';

const minNumberInput = document.querySelector('#min-number') as HTMLInputElement;
const maxNumberInput = document.querySelector('#max-number') as HTMLInputElement;
const generateButton = document.querySelector('#generate-number') as HTMLButtonElement;
const resetButton = document.querySelector('#reset') as HTMLButtonElement;
const outputNumber = document.querySelector('#random-number') as HTMLSpanElement;

/* Add event listeners */
generateButton.addEventListener('click', generateNumber);
resetButton.addEventListener('click', () => {
    minNumberInput.value = '1';
    maxNumberInput.value = '10';
    outputNumber.textContent = '0';

    showAlert('Reset!', 'success');
});

/**
 * Generates and displays a random number.
 */
function generateNumber() {
    const min = Number(minNumberInput.value);
    const max = Number(maxNumberInput.value);
    if (minNumberInput.value.length === 0 || maxNumberInput.value.length === 0) {
        showAlert('Empty input!', 'warning');
        showResult(generateButton, 'warning');
    } else if (min >= max) {
        showAlert('The minimum must be less than the maximum!', 'error');
        showResult(generateButton, 'error');
    } else {
        outputNumber.textContent = Math.floor(Math.random() * (max - min + 1) + min).toLocaleString();
        showResult(generateButton, 'success');
    }
}
