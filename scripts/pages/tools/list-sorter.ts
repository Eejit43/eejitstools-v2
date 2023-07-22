import { copyValue, resetResult, showAlert, showResult, shuffleArray } from '../../functions.js';

const input = document.querySelector('#input') as HTMLTextAreaElement;
const separatorInput = document.querySelector('#separator') as HTMLInputElement;
const alphabetizeNormalButton = document.querySelector('#alphabetize-normal') as HTMLButtonElement;
const numerizeButton = document.querySelector('#numerize') as HTMLButtonElement;
const randomizeButton = document.querySelector('#randomize') as HTMLButtonElement;
const reverseButton = document.querySelector('#reverse') as HTMLButtonElement;
const clearButton = document.querySelector('#clear') as HTMLButtonElement;
const result = document.querySelector('#result') as HTMLTextAreaElement;
const copyResultButton = document.querySelector('#copy-result') as HTMLButtonElement;

const separatorValue = separatorInput.value.replace('\\n', '\n');

/* Add event listeners */
alphabetizeNormalButton.addEventListener('click', alphabetizeNormal);
numerizeButton.addEventListener('click', numerize);
randomizeButton.addEventListener('click', randomize);
reverseButton.addEventListener('click', reverse);
clearButton.addEventListener('click', () => {
    input.value = '';
    result.value = '';
    separatorInput.value = '\\n';
    copyResultButton.disabled = true;

    clearButton.disabled = true;
    clearButton.textContent = 'Cleared!';
    showAlert('Cleared!', 'success');
    resetResult('alphabetize');
    resetResult('numerize');
    resetResult('randomize');
    resetResult('reverse');

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
        copyResultButton.disabled = false;
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
            .map((value) => Number.parseInt(value))
            .filter((x) => x === 0 || Boolean(x))
            .sort((a, b) => a - b)
            .join(separatorValue);
        showResult('numerize', 'success');
        copyResultButton.disabled = false;
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
        copyResultButton.disabled = false;
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
        copyResultButton.disabled = false;
    }
}
