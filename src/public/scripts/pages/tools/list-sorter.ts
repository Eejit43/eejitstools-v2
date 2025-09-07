import { copyValue, showAlert, showResult, shuffleArray } from '../../functions.js';

const input = document.querySelector<HTMLTextAreaElement>('#input')!;
const separatorInput = document.querySelector<HTMLInputElement>('#separator')!;
const alphabetizeButton = document.querySelector<HTMLButtonElement>('#alphabetize')!;
const numericalOrderButton = document.querySelector<HTMLButtonElement>('#numerical-order')!;
const randomizeButton = document.querySelector<HTMLButtonElement>('#randomize')!;
const reverseButton = document.querySelector<HTMLButtonElement>('#reverse')!;
const removeDuplicatesButton = document.querySelector<HTMLButtonElement>('#remove-duplicates')!;
const clearButton = document.querySelector<HTMLButtonElement>('#clear')!;
const result = document.querySelector<HTMLTextAreaElement>('#result')!;
const copyResultButton = document.querySelector<HTMLButtonElement>('#copy-result')!;

/* Add event listeners */
alphabetizeButton.addEventListener('click', alphabetize);
numericalOrderButton.addEventListener('click', numericalOrder);
randomizeButton.addEventListener('click', randomize);
reverseButton.addEventListener('click', reverse);
removeDuplicatesButton.addEventListener('click', removeDuplicates);
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
 * Alphabetizes the provided list and displays the result.
 */
function alphabetize() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'warning');
        showResult(alphabetizeButton, 'warning');
    } else {
        result.value = input.value
            .split(JSON.parse(`"${separatorInput.value}"`) as string)
            .sort((a, b) => a.localeCompare(b)) // eslint-disable-line unicorn/no-array-sort
            .join(JSON.parse(`"${separatorInput.value}"`) as string);

        showResult(alphabetizeButton, 'success');
        copyResultButton.disabled = false;
    }
}

/**
 * Sorts the provided list in numerical order and displays the result.
 */
function numericalOrder() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'warning');
        showResult(numericalOrderButton, 'warning');
    } else {
        result.value = input.value
            .split(JSON.parse(`"${separatorInput.value}"`) as string)
            .map((value) => Number.parseInt(value))
            .filter((number) => !!number || number === 0)
            .sort((a, b) => a - b) // eslint-disable-line unicorn/no-array-sort
            .join(JSON.parse(`"${separatorInput.value}"`) as string);

        showResult(numericalOrderButton, 'success');
        copyResultButton.disabled = false;
    }
}

/**
 * Randomizes the provided list and displays the result.
 */
function randomize() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'warning');
        showResult(randomizeButton, 'warning');
    } else {
        result.value = shuffleArray(input.value.split(JSON.parse(`"${separatorInput.value}"`) as string)).join(
            JSON.parse(`"${separatorInput.value}"`) as string,
        );

        showResult(randomizeButton, 'success');
        copyResultButton.disabled = false;
    }
}

/**
 * Reverses the provided list and displays the result.
 */
function reverse() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'warning');
        showResult(reverseButton, 'warning');
    } else {
        result.value = input.value
            .split(JSON.parse(`"${separatorInput.value}"`) as string)
            .reverse() // eslint-disable-line unicorn/no-array-reverse
            .join(JSON.parse(`"${separatorInput.value}"`) as string);

        showResult(reverseButton, 'success');
        copyResultButton.disabled = false;
    }
}

/**
 * Removes duplicates from the provided list and displays the result.
 */
function removeDuplicates() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'warning');
        showResult(reverseButton, 'warning');
    } else {
        const set = new Set(input.value.split(JSON.parse(`"${separatorInput.value}"`) as string));
        result.value = [...set.values()].join(JSON.parse(`"${separatorInput.value}"`) as string);

        showResult(removeDuplicatesButton, 'success');
        copyResultButton.disabled = false;
    }
}
