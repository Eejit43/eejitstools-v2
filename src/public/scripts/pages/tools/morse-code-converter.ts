import { copyText, showAlert, showResult } from '../../functions.js';

const input = document.querySelector('#input') as HTMLTextAreaElement;
const toMorseButton = document.querySelector('#to-morse') as HTMLButtonElement;
const fromMorseButton = document.querySelector('#from-morse') as HTMLButtonElement;
const clearButton = document.querySelector('#clear') as HTMLButtonElement;
const result = document.querySelector('#result') as HTMLTextAreaElement;
const copyButton = document.querySelector('#copy-result') as HTMLButtonElement;
const copyVerticalButton = document.querySelector('#copy-result-vertical') as HTMLButtonElement;
const copySpacesButton = document.querySelector('#copy-result-spaces') as HTMLButtonElement;

/* Add event listeners */
input.addEventListener('input', () => {
    input.value = input.value.replaceAll('…', '...');
});
toMorseButton.addEventListener('click', toMorse);
fromMorseButton.addEventListener('click', fromMorse);
clearButton.addEventListener('click', () => {
    input.value = '';
    result.value = '';
    copyButton.textContent = 'Copy';
    copyVerticalButton.textContent = 'Copy with vertical slash spacer';
    copySpacesButton.textContent = 'Copy with three space spacer';
    copyButton.disabled = true;
    copyVerticalButton.disabled = true;
    copySpacesButton.disabled = true;
    showAlert('Cleared!', 'success');
});
copyButton.addEventListener('click', () => {
    copyText(copyButton, result.value);
});
copyVerticalButton.addEventListener('click', () => {
    copyText(copyVerticalButton, result.value.replaceAll(' / ', ' | '));
});
copySpacesButton.addEventListener('click', () => {
    copyText(copySpacesButton, result.value.replaceAll(' / ', '   '));
});

/* eslint-disable @typescript-eslint/naming-convention */
const morseConversion: Record<string, string> = {
    'a': '.-',
    'b': '-...',
    'c': '-.-.',
    'd': '-..',
    'e': '.',
    'f': '..-.',
    'g': '--.',
    'h': '....',
    'i': '..',
    'j': '.---',
    'k': '-.-',
    'l': '.-..',
    'm': '--',
    'n': '-.',
    'o': '---',
    'p': '.--.',
    'q': '--.-',
    'r': '.-.',
    's': '...',
    't': '-',
    'u': '..-',
    'v': '...-',
    'w': '.--',
    'x': '-..-',
    'y': '-.--',
    'z': '--..',
    1: '.----',
    2: '..---',
    3: '...--',
    4: '....-',
    5: '.....',
    6: '-....',
    7: '--...',
    8: '---..',
    9: '----.',
    0: '-----',
    '_': '..--.-',
    '-': '-....-',
    ',': '--..--',
    ';': '-.-.-.',
    ':': '---...',
    '!': '-.-.--',
    '?': '..--..',
    '"': '.-..-.',
    '(': '-.--.',
    ')': '-.--.-',
    '@': '.--.-.',
    '/': '-..-.',
    '&': '.-...',
    '+': '.-.-.',
    '=': '-...-',
    "'": '.----.',
    '$': '...-..-',
    '.': '.-.-.-',
};
/* eslint-enable @typescript-eslint/naming-convention */

/**
 * Coverts a string to Morse code.
 * @param string The string to convert.
 */
function convertToMorse(string: string) {
    return [...string.toLowerCase()]
        .map((character) => morseConversion[character] ?? character)
        .join(' ')
        .replaceAll(/ {3}/g, ' / ');
}

/**
 * Converts the provided string to Morse code and displays the result.
 */
function toMorse() {
    if (input.value.trim().length <= 0) {
        result.value = '';
        copyButton.disabled = true;
        copyVerticalButton.disabled = true;
        copySpacesButton.disabled = true;
        showResult(toMorseButton, 'warning');
        showAlert('Empty input!', 'warning');
    } else if (/^[\w !"$&'()+,./:;=?@\\|-]*$/.test(input.value.trim())) {
        result.value = convertToMorse(input.value);
        copyButton.disabled = false;
        copyVerticalButton.disabled = false;
        copySpacesButton.disabled = false;
        showResult(toMorseButton, 'success');
    } else {
        result.value = '';
        copyButton.disabled = true;
        copyVerticalButton.disabled = true;
        copySpacesButton.disabled = true;
        showResult(toMorseButton, 'error');
        showAlert('Input cannot be converted into morse code!', 'error');
    }
}

/**
 * Converts Morse code to a human-readable string.
 * @param morseCode The Morse code to convert.
 */
function decodeMorse(morseCode: string) {
    return morseCode
        .split(/ {2,}| *[/|] */)
        .map((word) =>
            word
                .split(' ')
                .map(
                    (letter) =>
                        Object.keys(morseConversion)
                            .find((key) => morseConversion[key] === letter)
                            ?.toUpperCase() ?? letter,
                )
                .join(''),
        )
        .join(' ');
}

/**
 * Converts the provided string from Morse code and displays the result.
 */
function fromMorse() {
    const inputValue = input.value.trim().replaceAll('_', '-').replaceAll('•', '.');
    if (inputValue.length <= 0) {
        result.value = '';
        copyButton.disabled = true;
        copyVerticalButton.disabled = true;
        copySpacesButton.disabled = true;
        showResult(fromMorseButton, 'warning');
        showAlert('Empty input!', 'warning');
    } else if (/^[.-]{1,7}( [.-]{1,7})*(( {2,}| *[/|] *)[.-]{1,7}( [.-]{1,7})*)*$/g.test(inputValue)) {
        result.value = decodeMorse(inputValue);
        copyButton.disabled = false;
        copyVerticalButton.disabled = true;
        copySpacesButton.disabled = true;
        showResult(fromMorseButton, 'success');
    } else {
        result.value = '';
        copyButton.disabled = true;
        copyVerticalButton.disabled = true;
        copySpacesButton.disabled = true;
        showResult(fromMorseButton, 'error');
        showAlert('Invalid morse code!', 'error');
    }
}
