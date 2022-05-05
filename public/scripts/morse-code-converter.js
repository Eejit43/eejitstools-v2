// some stuff modified from https://stackoverflow.com/questions/43726344/js-decoding-morse-code, https://www.tutorialspoint.com/converting-string-to-morse-code-in-javascript

let input = document.getElementById('input');
let toMorseBtn = document.getElementById('to-morse');
let fromMorseBtn = document.getElementById('from-morse');
let clearBtn = document.getElementById('clear');
let result = document.getElementById('result');
let resultCopy = document.getElementById('copy-result');
let resultCopy2 = document.getElementById('copy-result-2');
let resultCopy3 = document.getElementById('copy-result-3');

let resultVar1, resultVar2, resultVar3;

/* Add event listeners */
toMorseBtn.addEventListener('click', toMorse);
fromMorseBtn.addEventListener('click', fromMorse);
clearBtn.addEventListener('click', clear);
resultCopy.addEventListener('click', function () {
    copyVar('resultVar1', 'copy-result', 'Copy');
});
resultCopy2.addEventListener('click', function () {
    copyVar('resultVar2', 'copy-result-2', 'Copy with vertical slash space');
});
resultCopy3.addEventListener('click', function () {
    copyVar('resultVar3', 'copy-result-3', 'Copy with three space space');
});

function clear() {
    resultCopy = document.getElementById('copy-result');
    resultCopy2 = document.getElementById('copy-result-2');
    resultCopy3 = document.getElementById('copy-result-3');
    input.value = '';
    result.value = '';
    resetResult('e');
    resetResult('d');
    resultCopy.innerHTML = 'Copy';
    resultCopy2.innerHTML = 'Copy with vertical slash space';
    resultCopy3.innerHTML = 'Copy with three space space';
    resultCopy.disabled = true;
    resultCopy2.disabled = true;
    resultCopy3.disabled = true;
    showAlert('Cleared!', 'success');
}

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

const convertToMorse = (str) => {
    return str
        .toLowerCase()
        .split('')
        .map((el) => {
            return toMorseRef[el] ? toMorseRef[el] : el;
        })
        .join(' ')
        .replace(/   /g, ' / ');
};

function toMorse() {
    resultCopy = document.getElementById('copy-result');
    resultCopy2 = document.getElementById('copy-result-2');
    resultCopy3 = document.getElementById('copy-result-3');
    if (input.value.trim().length <= 0) {
        result.value = '';
        resultCopy.disabled = true;
        resultCopy2.disabled = true;
        resultCopy3.disabled = true;
        showResult('e', 'error');
        showAlert('Empty input!', 'error');
    } else if (/^[ a-zA-Z0-9\.,\?\'!\/\(\)&:;=+\-_"\$@]*$/.test(input.value.trim())) {
        result.value = convertToMorse(input.value);
        resultVar1 = convertToMorse(input.value);
        resultVar2 = convertToMorse(input.value).replace(/ \/ /g, ' | ');
        resultVar3 = convertToMorse(input.value).replace(/ \/ /g, '   ');
        resultCopy.disabled = false;
        resultCopy2.disabled = false;
        resultCopy3.disabled = false;
        showResult('e', 'success');
    } else {
        result.value = '';
        resultCopy.disabled = true;
        resultCopy2.disabled = true;
        resultCopy3.disabled = true;
        showResult('e', 'error');
        showAlert('Input cannot be converted into morse code!', 'error');
    }
}

function decodeMorse(morseCode) {
    return morseCode
        .split(/ {2,}| *[\|\/] */)
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
    resultCopy = document.getElementById('copy-result');
    resultCopy2 = document.getElementById('copy-result-2');
    resultCopy3 = document.getElementById('copy-result-3');
    if (inputVal.length <= 0) {
        result.value = '';
        resultCopy.disabled = true;
        resultCopy2.disabled = true;
        resultCopy3.disabled = true;
        showResult('d', 'error');
        showAlert('Empty input!', 'error');
    } else if (/^[.-]{1,7}( [.-]{1,7})*(( {2,}| *[\|\/] *)[.-]{1,7}( [.-]{1,7})*)*$/g.test(inputVal)) {
        result.value = decodeMorse(inputVal);
        resultVar1 = decodeMorse(inputVal);
        resultCopy.disabled = false;
        resultCopy2.disabled = true;
        resultCopy3.disabled = true;
        showResult('d', 'success');
    } else {
        result.value = '';
        resultCopy.disabled = true;
        resultCopy2.disabled = true;
        resultCopy3.disabled = true;
        showResult('d', 'error');
        showAlert('Invalid morse code!', 'error');
    }
}
