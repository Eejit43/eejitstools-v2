import { copyText, showAlert, updateArrow } from '/scripts/functions.js';

const integerInput = document.getElementById('integer-input');
const integerConvert = document.getElementById('integer-convert');
const integerReset = document.getElementById('integer-reset');
const integerArrow = document.getElementById('integer-arrow');
const romanOutput = document.getElementById('roman-output');
const romanOutputCopy = document.getElementById('roman-output-copy');
const romanOutputCopy2 = document.getElementById('roman-output-copy-2');
const romanInput = document.getElementById('roman-input');
const romanConvert = document.getElementById('roman-convert');
const romanReset = document.getElementById('roman-reset');
const romanArrow = document.getElementById('roman-arrow');
const integerOutput = document.getElementById('integer-output');
const integerOutputCopy = document.getElementById('integer-output-copy');

let romanOutputVal, romanOutputVal2, integerOutputVal;

/* Add event listeners */
integerInput.addEventListener('input', () => {
    if (parseInt(integerInput.value) === 0) integerInput.value = '';
});
integerInput.addEventListener('input', () => {
    integerInput.value = integerInput.value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1');
});
integerInput.addEventListener('input', () => {
    if (integerInput.value.length > 0) integerConvert.disabled = false;
    else integerConvert.disabled = true;

    if (integerInput.value.length > 0 || romanOutput.innerHTML !== '​' || integerArrow.style.color !== 'dimgray') integerReset.disabled = false;
    else integerReset.disabled = true;
});
integerConvert.addEventListener('click', convertInteger);
integerReset.addEventListener('click', () => {
    integerInput.value = '';
    integerConvert.disabled = true;
    integerReset.disabled = true;
    romanOutput.textContent = '​';
    romanOutputCopy.disabled = true;
    romanOutputCopy2.disabled = true;

    showAlert('Reset!', 'success');
    updateArrow(integerArrow, 'reset');
});
romanInput.addEventListener('input', () => {
    romanInput.value = romanInput.value.toUpperCase();
});
romanInput.addEventListener('input', () => {
    romanInput.value = romanInput.value.replace(/((?![IVXLCDM_]).)/gi, '');
});
romanInput.addEventListener('input', () => {
    if (romanInput.value.length > 0) romanConvert.disabled = false;
    else romanConvert.disabled = true;

    if (romanInput.value.length > 0 || integerOutput.value !== '' || romanArrow.style.color !== 'dimgray') romanReset.disabled = false;
    else romanReset.disabled = true;
});
romanConvert.addEventListener('click', convertRoman);
romanReset.addEventListener('click', () => {
    romanInput.value = '';
    romanConvert.disabled = true;
    romanReset.disabled = true;
    integerOutput.value = '';
    integerOutputCopy.disabled = true;

    showAlert('Reset!', 'success');
    updateArrow(romanArrow, 'reset');
});
romanOutputCopy.addEventListener('click', () => copyText(romanOutputCopy, romanOutputVal));
romanOutputCopy2.addEventListener('click', () => copyText(romanOutputCopy2, romanOutputVal2));
integerOutputCopy.addEventListener('click', () => copyText(integerOutputCopy, integerOutputVal));

/**
 * Converts the provided integer to roman numerals and displays the result
 */
function convertInteger() {
    if (parseInt(integerInput.value) > 0) {
        romanOutput.innerHTML = romanize(integerInput.value);
        romanOutputCopy.disabled = false;
        romanOutputCopy2.disabled = false;
        updateArrow(integerArrow, 'success');
    } else {
        showAlert('Value must be greater than 0!', 'error');
        romanOutput.innerHTML = '​';
        romanOutputCopy.disabled = true;
        romanOutputCopy2.disabled = true;
        updateArrow(integerArrow, 'error');
    }
}

/**
 * Converts the provided roman numerals to a number and displays the result
 */
function convertRoman() {
    romanInput.value = romanInput.value.toUpperCase();
    const input = romanInput.value
        .replace(/_(\w)/g, (match) => {
            return match.toLowerCase();
        })
        .replace(/_/g, '');
    if (/^(?:m*)(?:d?c{0,3}|c[md])(?:l?x{0,3}|x[cl])(?:(?:vi?){0,3}|i[xv])(?:M{0,3})(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/.test(input) === true) {
        integerOutputVal = deromanize(input);
        integerOutput.value = deromanize(input);
        integerOutputCopy.disabled = false;
        updateArrow(romanArrow, 'success');
    } else {
        showAlert('Invalid roman numeral!', 'error');
        integerOutput.value = '';
        integerOutputCopy.disabled = true;
        updateArrow(romanArrow, 'error');
    }
}

const roman = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
const decimal = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];

/**
 * Converts a number to roman numerals
 * @param {string|number} number Number to convert to roman numerals
 * @returns {string} Number in roman numerals
 * @see https://iandevlin.com/files/blog/romanNumerals.html
 */
function romanize(number) {
    let barredNumerals = '';
    while (number > 3999) {
        for (let i = 0; i < decimal.length - 1; i++) {
            const currentNumber = decimal[i] * 1000;
            if (number < currentNumber) continue;

            number -= currentNumber;
            barredNumerals += roman[i];
            break;
        }
    }

    let regularNumerals = '';
    while (number > 0) {
        for (let i = 0; i < decimal.length; i++) {
            const currentNumber = decimal[i];
            if (number < currentNumber) continue;

            number -= currentNumber;
            regularNumerals += roman[i];
            break;
        }
    }
    romanOutputVal = barredNumerals.replace(/I/g, 'Ī').replace(/V/g, 'V̄').replace(/X/g, 'X̄').replace(/L/g, 'L̄').replace(/C/g, 'C̄').replace(/D/g, 'D̄').replace(/M/g, 'M̄') + regularNumerals;
    romanOutputVal2 = barredNumerals.replace(/([A-Z])/g, '_$1') + regularNumerals;
    return `<span style="border-top:1px solid">${barredNumerals}</span>` + regularNumerals;
}

/**
 * Converts a roman numerals to a number
 * @param {string} string Roman numeral to convert to number
 * @returns {string} Number
 * @author EmNudge#5549 from The Coding Den
 */
function deromanize(string) {
    const token = /[mdlv]|c[md]?|x[cl]?|i[xv]|[MDLV]|C[MD]?|X[CL]?|I[XV]?/g;
    const key = {
        m: 1000000,
        cm: 900000,
        d: 500000,
        cd: 400000,
        c: 100000,
        xc: 90000,
        l: 50000,
        xl: 40000,
        x: 10000,
        ix: 9000,
        v: 5000,
        iv: 4000,
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1
    };
    let output = 0;
    let i;
    while ((i = token.exec(string))) output += key[i[0]];
    return output;
}
