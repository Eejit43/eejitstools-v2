import { copyText, resetResult, showAlert, showResult } from '/scripts/functions.js';

const input = document.getElementById('input');
const toMorseBtn = document.getElementById('to-morse');
const fromMorseBtn = document.getElementById('from-morse');
const clearBtn = document.getElementById('clear');
const result = document.getElementById('result');
const resultCopy = document.getElementById('copy-result');
const resultCopy2 = document.getElementById('copy-result-2');
const resultCopy3 = document.getElementById('copy-result-3');

let resultVar1, resultVar2, resultVar3;

/* Add event listeners */
toMorseBtn.addEventListener('click', toMorse);
fromMorseBtn.addEventListener('click', fromMorse);
clearBtn.addEventListener('click', () => {
    input.value = '';
    result.value = '';
    resetResult('encode');
    resetResult('decode');
    resultCopy.innerHTML = 'Copy';
    resultCopy2.innerHTML = 'Copy with vertical slash space';
    resultCopy3.innerHTML = 'Copy with three space space';
    resultCopy.disabled = true;
    resultCopy2.disabled = true;
    resultCopy3.disabled = true;
    showAlert('Cleared!', 'success');
});
resultCopy.addEventListener('click', () => {
    copyText(resultCopy, resultVar1);
});
resultCopy2.addEventListener('click', () => {
    copyText(resultCopy2, resultVar2);
});
resultCopy3.addEventListener('click', () => {
    copyText(resultCopy3, resultVar3);
});

const toMorseRef = {
    a: '.-',
    b: '-...',
    c: '-.-.',
    d: '-..',
    e: '.',
    f: '..-.',
    g: '--.',
    h: '....',
    i: '..',
    j: '.---',
    k: '-.-',
    l: '.-..',
    m: '--',
    n: '-.',
    o: '---',
    p: '.--.',
    q: '--.-',
    r: '.-.',
    s: '...',
    t: '-',
    u: '..-',
    v: '...-',
    w: '.--',
    x: '-..-',
    y: '-.--',
    z: '--..',
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
    '.': '.-.-.-',
    ',': '--..--',
    '?': '..--..',
    "'": '.----.',
    '!': '-.-.--',
    '/': '-..-.',
    '(': '-.--.',
    ')': '-.--.-',
    '&': '.-...',
    ':': '---...',
    ';': '-.-.-.',
    '=': '-...-',
    '+': '.-.-.',
    '-': '-....-',
    _: '..--.-',
    '"': '.-..-.',
    $: '...-..-',
    '@': '.--.-.',
};

const fromMorseRef = {
    '.-': 'A',
    '-...': 'B',
    '-.-.': 'C',
    '-..': 'D',
    '.': 'E',
    '..-.': 'F',
    '--.': 'G',
    '....': 'H',
    '..': 'I',
    '.---': 'J',
    '-.-': 'K',
    '.-..': 'L',
    '--': 'M',
    '-.': 'N',
    '---': 'O',
    '.--.': 'P',
    '--.-': 'Q',
    '.-.': 'R',
    '...': 'S',
    '-': 'T',
    '..-': 'U',
    '...-': 'V',
    '.--': 'W',
    '-..-': 'X',
    '-.--': 'Y',
    '--..': 'Z',
    '.----': '1',
    '..---': '2',
    '...--': '3',
    '....-': '4',
    '.....': '5',
    '-....': '6',
    '--...': '7',
    '---..': '8',
    '----.': '9',
    '-----': '0',
    '.-.-.-': '.',
    '--..--': ',',
    '..--..': '?',
    '.----.': "'",
    '-.-.--': '!',
    '-..-.': '/',
    '-.--.': '(',
    '-.--.-': ')',
    '.-...': '&',
    '---...': ':',
    '-.-.-.': ';',
    '-...-': '=',
    '.-.-.': '+',
    '-....-': '-',
    '..--.-': '_',
    '.-..-.': '"',
    '...-..-': '$',
    '.--.-.': '@',
};

function convertToMorse(str) {
    return str
        .toLowerCase()
        .split('')
        .map((el) => (toMorseRef[el] ? toMorseRef[el] : el))
        .join(' ')
        .replace(/ {3}/g, ' / ');
}

function toMorse() {
    if (input.value.trim().length <= 0) {
        result.value = '';
        resultCopy.disabled = true;
        resultCopy2.disabled = true;
        resultCopy3.disabled = true;
        showResult('encode', 'error');
        showAlert('Empty input!', 'error');
    } else if (/^[ a-zA-Z0-9.,?'!/()&:;=+\-_"$@]*$/.test(input.value.trim())) {
        result.value = convertToMorse(input.value);
        resultVar1 = convertToMorse(input.value);
        resultVar2 = convertToMorse(input.value).replace(/ \/ /g, ' | ');
        resultVar3 = convertToMorse(input.value).replace(/ \/ /g, '   ');
        resultCopy.disabled = false;
        resultCopy2.disabled = false;
        resultCopy3.disabled = false;
        showResult('encode', 'success');
    } else {
        result.value = '';
        resultCopy.disabled = true;
        resultCopy2.disabled = true;
        resultCopy3.disabled = true;
        showResult('encode', 'error');
        showAlert('Input cannot be converted into morse code!', 'error');
    }
}

function decodeMorse(morseCode) {
    return morseCode
        .split(/ {2,}| *[|/] */)
        .map((a) =>
            a
                .split(' ')
                .map((b) => fromMorseRef[b])
                .join('')
        )
        .join(' ');
}

function fromMorse() {
    let inputVal = input.value.trim().replace(/_/g, '-').replace(/•/g, '.');
    if (inputVal.length <= 0) {
        result.value = '';
        resultCopy.disabled = true;
        resultCopy2.disabled = true;
        resultCopy3.disabled = true;
        showResult('decode', 'error');
        showAlert('Empty input!', 'error');
    } else if (/^[.-]{1,7}( [.-]{1,7})*(( {2,}| *[|/] *)[.-]{1,7}( [.-]{1,7})*)*$/g.test(inputVal)) {
        result.value = decodeMorse(inputVal);
        resultVar1 = decodeMorse(inputVal);
        resultCopy.disabled = false;
        resultCopy2.disabled = true;
        resultCopy3.disabled = true;
        showResult('decode', 'success');
    } else {
        result.value = '';
        resultCopy.disabled = true;
        resultCopy2.disabled = true;
        resultCopy3.disabled = true;
        showResult('decode', 'error');
        showAlert('Invalid morse code!', 'error');
    }
}
