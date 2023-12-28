import { copyValue, showAlert, showResult, shuffleArray } from '../../functions.js';

const input = document.querySelector('#input') as HTMLTextAreaElement;
const separatorInput = document.querySelector('#separator') as HTMLInputElement;
const alphabetizeButton = document.querySelector('#alphabetize') as HTMLButtonElement;
const numericalOrderButton = document.querySelector('#numerical-order') as HTMLButtonElement;
const randomizeButton = document.querySelector('#randomize') as HTMLButtonElement;
const reverseButton = document.querySelector('#reverse') as HTMLButtonElement;
const clearButton = document.querySelector('#clear') as HTMLButtonElement;
const result = document.querySelector('#result') as HTMLTextAreaElement;
const copyResultButton = document.querySelector('#copy-result') as HTMLButtonElement;

/* Add event listeners */
alphabetizeButton.addEventListener('click', alphabetize);
numericalOrderButton.addEventListener('click', numericalOrder);
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
function alphabetize() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'warning');
        showResult(alphabetizeButton, 'warning');
    } else {
        result.value = input.value
            .split(JSON.parse(`"${separatorInput.value}"`) as string)
            .sort((a, b) => a.localeCompare(b))
            .join(JSON.parse(`"${separatorInput.value}"`) as string);
        showResult(alphabetizeButton, 'success');
        copyResultButton.disabled = false;
    }
}

/**
 * Sorts the provided string in numerical order and displays the result.
 */
function numericalOrder() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'warning');
        showResult(numericalOrderButton, 'warning');
    } else {
        result.value = input.value
            .split(JSON.parse(`"${separatorInput.value}"`) as string)
            .map((value) => Number.parseInt(value))
            .filter((x) => x === 0 || Boolean(x))
            .sort((a, b) => a - b)
            .join(JSON.parse(`"${separatorInput.value}"`) as string);
        showResult(numericalOrderButton, 'success');
        copyResultButton.disabled = false;
    }
}

/**
 * Randomizes the provided string and displays the result.
 */
function randomize() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'warning');
        showResult(randomizeButton, 'warning');
    } else {
        result.value = shuffleArray(input.value.split(JSON.parse(`"${separatorInput.value}"`) as string)).join(JSON.parse(`"${separatorInput.value}"`) as string);
        showResult(randomizeButton, 'success');
        copyResultButton.disabled = false;
    }
}

/**
 * Reverses the provided string and displays the result.
 */
function reverse() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'warning');
        showResult(reverseButton, 'warning');
    } else {
        result.value = input.value
            .split(JSON.parse(`"${separatorInput.value}"`) as string)
            .reverse()
            .join(JSON.parse(`"${separatorInput.value}"`) as string);
        showResult(reverseButton, 'success');
        copyResultButton.disabled = false;
    }
}
