import { resetResult, showAlert, showResult } from '../../functions.js';

const minNumber = document.getElementById('min-number') as HTMLInputElement;
const maxNumber = document.getElementById('max-number') as HTMLInputElement;
const generate = document.getElementById('generate-number') as HTMLButtonElement;
const resetButton = document.getElementById('reset') as HTMLButtonElement;
const outputNumber = document.getElementById('random-number') as HTMLSpanElement;

/* Add event listeners */
generate.addEventListener('click', generateNumber);
resetButton.addEventListener('click', () => {
    minNumber.value = '1';
    maxNumber.value = '10';
    outputNumber.textContent = '0';

    showAlert('Reset!', 'success');
    resetResult('generate');
});

/**
 * Generates and displays a random number.
 */
function generateNumber() {
    const min = Number(minNumber.value);
    const max = Number(maxNumber.value);
    if (minNumber.value.length === 0 || maxNumber.value.length === 0) {
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
