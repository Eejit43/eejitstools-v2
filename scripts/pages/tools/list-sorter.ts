import { copyValue, resetResult, showAlert, showResult, shuffleArray } from '../../functions.js';

const input = document.getElementById('input') as HTMLTextAreaElement;
const separator = document.getElementById('separator') as HTMLInputElement;
const alphabetizeNormalButton = document.getElementById('alphabetize-normal') as HTMLButtonElement;
const numerizeButton = document.getElementById('numerize') as HTMLButtonElement;
const randomizeButton = document.getElementById('randomize') as HTMLButtonElement;
const reverseButton = document.getElementById('reverse') as HTMLButtonElement;
const clear = document.getElementById('clear') as HTMLButtonElement;
const result = document.getElementById('result') as HTMLTextAreaElement;
const copyResult = document.getElementById('copy-result') as HTMLButtonElement;

const separatorValue = separator.value.replace('\\n', '\n');

/* Add event listeners */
alphabetizeNormalButton.addEventListener('click', alphabetizeNormal);
numerizeButton.addEventListener('click', numerize);
randomizeButton.addEventListener('click', randomize);
reverseButton.addEventListener('click', reverse);
clear.addEventListener('click', () => {
    input.value = '';
    result.value = '';
    separator.value = '\\n';
    copyResult.disabled = true;

    clear.disabled = true;
    clear.textContent = 'Cleared!';
    showAlert('Cleared!', 'success');
    resetResult('alphabetize');
    resetResult('numerize');
    resetResult('randomize');
    resetResult('reverse');

    setTimeout(() => {
        copyResult.disabled = true;

        clear.disabled = false;
        clear.textContent = 'Clear';
    }, 2000);
});
copyResult.addEventListener('click', () => {
    copyValue(copyResult, result);
});

/**
 * Alphabetizes the provided string and displays the result.
 */
function alphabetizeNormal() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('alphabetize', 'error');
    } else {
        result.value = input.value
            .split(separatorValue)
            .sort((a, b) => a.localeCompare(b))
            .join(separatorValue);
        showResult('alphabetize', 'success');
        copyResult.disabled = false;
    }
}

/**
 * Numerizes the provided string and displays the result.
 */
function numerize() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('numerize', 'error');
    } else {
        result.value = input.value
            .split(separatorValue)
            .map((x) => parseInt(x))
            .filter((x) => x === 0 || Boolean(x))
            .sort((a, b) => a - b)
            .join(separatorValue);
        showResult('numerize', 'success');
        copyResult.disabled = false;
    }
}

/**
 * Randomizes the provided string and displays the result.
 */
function randomize() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('randomize', 'error');
    } else {
        result.value = shuffleArray(input.value.split(separatorValue)).join(separatorValue);
        showResult('randomize', 'success');
        copyResult.disabled = false;
    }
}

/**
 * Reverses the provided string and displays the result.
 */
function reverse() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('reverse', 'error');
    } else {
        result.value = input.value.split(separatorValue).reverse().join(separatorValue);
        showResult('reverse', 'success');
        copyResult.disabled = false;
    }
}
