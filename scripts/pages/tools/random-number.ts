import { resetResult, showAlert, showResult } from '../../functions.js';

const minNumberInput = document.getElementById('min-number') as HTMLInputElement;
const maxNumberInput = document.getElementById('max-number') as HTMLInputElement;
const generateButton = document.getElementById('generate-number') as HTMLButtonElement;
const resetButton = document.getElementById('reset') as HTMLButtonElement;
const outputNumber = document.getElementById('random-number') as HTMLSpanElement;

/* Add event listeners */
generateButton.addEventListener('click', generateNumber);
resetButton.addEventListener('click', () => {
    minNumberInput.value = '1';
    maxNumberInput.value = '10';
    outputNumber.textContent = '0';

    showAlert('Reset!', 'success');
    resetResult('generate');
});

/**
 * Generates and displays a random number.
 */
function generateNumber() {
    const min = Number(minNumberInput.value);
    const max = Number(maxNumberInput.value);
    if (minNumberInput.value.length === 0 || maxNumberInput.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('generate', 'error');
    } else if (min >= max) {
        showAlert('The minimum must be less than the maximum!', 'error');
        showResult('generate', 'error');
    } else {
        outputNumber.textContent = Math.floor(Math.random() * (max - min + 1) + min).toLocaleString();
        showResult('generate', 'success');
    }
}
