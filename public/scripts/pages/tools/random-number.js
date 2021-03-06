import { resetResult, showAlert, showResult } from '/scripts/functions.js';

const minNumber = document.getElementById('min-number');
const maxNumber = document.getElementById('max-number');
const generate = document.getElementById('generate-number');
const resetButton = document.getElementById('reset');
const outputNumber = document.getElementById('random-number');

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
 * Generates and displays a random number
 */
function generateNumber() {
    const min = Number(minNumber.value);
    const max = Number(maxNumber.value);
    if (min.length === 0 || max.length === 0) {
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
