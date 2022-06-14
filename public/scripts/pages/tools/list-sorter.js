import { copyValue, resetResult, showAlert, showResult } from '/scripts/functions.js';

const input = document.getElementById('input');
const separator = document.getElementById('separator');
const alphabetizeNormalButton = document.getElementById('alphabetize-normal');
const numerizeButton = document.getElementById('numerize');
const randomizeButton = document.getElementById('randomize');
const reverseButton = document.getElementById('reverse');
const clear = document.getElementById('clear');
const result = document.getElementById('result');
const copyResult = document.getElementById('copy-result');

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
    clear.innerHTML = 'Cleared!';
    showAlert('Cleared!', 'success');
    resetResult('alphabetize');
    resetResult('numerize');
    resetResult('randomize');
    resetResult('reverse');

    setTimeout(() => {
        copyResult.disabled = true;

        clear.disabled = false;
        clear.innerHTML = 'Clear';
    }, 2000);
});
copyResult.addEventListener('click', () => {
    copyValue(copyResult, result);
});

/**
 * Alphabetizes the provided string and displays the result
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
 * Numerizes the provided string and displays the result
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
 * Randomizes the provided string and displays the result
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
 * Reverses the provided string and displays the result
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

/**
 * Shuffles the order of items in an array
 * @param {Array} array The array to shuffle
 * @returns {Array} shuffled array
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
