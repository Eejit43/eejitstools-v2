import { copyValue, resetResult, showAlert, showResult } from '/scripts/functions.js';

const input = document.getElementById('input');
const toBinaryBtn = document.getElementById('to-binary');
const fromBinaryBtn = document.getElementById('from-binary');
const clearBtn = document.getElementById('clear');
const result = document.getElementById('result');
const resultCopy = document.getElementById('copy-result');

/* Add event listeners */
toBinaryBtn.addEventListener('click', toBinary);
fromBinaryBtn.addEventListener('click', fromBinary);
clearBtn.addEventListener('click', () => {
    input.value = '';
    result.value = '';
    resultCopy.disabled = true;

    clearBtn.disabled = true;
    clearBtn.textContent = 'Cleared!';
    showAlert('Cleared!', 'success');
    resetResult('encode');
    resetResult('decode');

    setTimeout(() => {
        resultCopy.disabled = true;

        clearBtn.disabled = false;
        clearBtn.textContent = 'Clear';
    }, 2000);
});
resultCopy.addEventListener('click', () => {
    copyValue(resultCopy, result);
});

/**
 * Converts the provided string to binary and displays the result
 */
function toBinary() {
    if (input.value.trim().length <= 0) {
        result.value = '';
        resultCopy.disabled = true;
        showResult('encode', 'error');
        showAlert('Empty input!', 'error');
    } else {
        result.value = stringToBinary(input.value.trim());
        resultCopy.disabled = false;
        showResult('encode', 'success');
    }
}

/**
 * Converts the provided string from binary and displays the result
 */
function fromBinary() {
    if (input.value.trim().length <= 0) {
        result.value = '';
        resultCopy.disabled = true;
        showResult('decode', 'error');
        showAlert('Empty input!', 'error');
    } else if (/^[ 01]+$/gm.test(input.value.trim())) {
        result.value = binaryToString(input.value.trim());
        resultCopy.disabled = false;
        showResult('decode', 'success');
    } else {
        result.value = '';
        resultCopy.disabled = true;
        showResult('decode', 'error');
        showAlert('Invalid binary!', 'error');
    }
}

/**
 * Encodes a string into binary
 * @param {string} string String to encode
 * @returns {string} Encoded string
 */
function stringToBinary(string) {
    return string
        .split('')
        .map((char) => char.charCodeAt(0).toString(2))
        .join(' ');
}

/**
 * Decodes binary to string
 * @param {string} binary Binary to decode
 * @returns {string} Decoded string
 */
function binaryToString(binary) {
    return binary
        .split(' ')
        .map((elem) => String.fromCharCode(parseInt(elem, 2)))
        .join('');
}
