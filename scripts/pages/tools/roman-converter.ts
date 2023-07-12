import { copyText, showAlert, updateArrow } from '../../functions.js';

const integerInput = document.getElementById('integer-input') as HTMLInputElement;
const integerConvertButton = document.getElementById('integer-convert') as HTMLButtonElement;
const integerResetButton = document.getElementById('integer-reset') as HTMLButtonElement;
const integerArrow = document.getElementById('integer-arrow')!;
const romanOutput = document.getElementById('roman-output') as HTMLButtonElement; // This *is* actually a button, it functions as a fake input as HTML is needed to add top borders to characters
const romanOutputCopyButton = document.getElementById('roman-output-copy') as HTMLButtonElement;
const romanOutputCopy2Button = document.getElementById('roman-output-copy-2') as HTMLButtonElement;
const romanInput = document.getElementById('roman-input') as HTMLInputElement;
const romanConvertButton = document.getElementById('roman-convert') as HTMLButtonElement;
const romanResetButton = document.getElementById('roman-reset') as HTMLButtonElement;
const romanArrow = document.getElementById('roman-arrow')!;
const integerOutput = document.getElementById('integer-output') as HTMLInputElement;
const integerOutputCopyButton = document.getElementById('integer-output-copy') as HTMLButtonElement;

let romanOutputVal: string, romanOutputVal2: string, integerOutputVal: string;

/* Add event listeners */
integerInput.addEventListener('input', () => {
    if (parseInt(integerInput.value) === 0) integerInput.value = '';
});
integerInput.addEventListener('input', () => {
    integerInput.value = integerInput.value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1');
});
integerInput.addEventListener('input', () => {
    if (integerInput.value.length > 0) integerConvertButton.disabled = false;
    else integerConvertButton.disabled = true;

    if (integerInput.value.length > 0 || romanOutput.innerHTML !== '​' || integerArrow.style.color !== 'dimgray') integerResetButton.disabled = false;
    else integerResetButton.disabled = true;
});
integerConvertButton.addEventListener('click', convertInteger);
integerResetButton.addEventListener('click', () => {
    integerInput.value = '';
    integerConvertButton.disabled = true;
    integerResetButton.disabled = true;
    romanOutput.textContent = '​';
    romanOutputCopyButton.disabled = true;
    romanOutputCopy2Button.disabled = true;

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
    if (romanInput.value.length > 0) romanConvertButton.disabled = false;
    else romanConvertButton.disabled = true;

    if (romanInput.value.length > 0 || integerOutput.value !== '' || romanArrow.style.color !== 'dimgray') romanResetButton.disabled = false;
    else romanResetButton.disabled = true;
});
romanConvertButton.addEventListener('click', convertRoman);
romanResetButton.addEventListener('click', () => {
    romanInput.value = '';
    romanConvertButton.disabled = true;
    romanResetButton.disabled = true;
    integerOutput.value = '';
    integerOutputCopyButton.disabled = true;

    showAlert('Reset!', 'success');
    updateArrow(romanArrow, 'reset');
});
romanOutputCopyButton.addEventListener('click', () => copyText(romanOutputCopyButton, romanOutputVal));
romanOutputCopy2Button.addEventListener('click', () => copyText(romanOutputCopy2Button, romanOutputVal2));
integerOutputCopyButton.addEventListener('click', () => copyText(integerOutputCopyButton, integerOutputVal));

/**
 * Converts the provided integer to roman numerals and displays the result.
 */
function convertInteger() {
    if (parseInt(integerInput.value) > 0) {
        romanOutput.innerHTML = romanize(parseInt(integerInput.value));
        romanOutputCopyButton.disabled = false;
        romanOutputCopy2Button.disabled = false;
        updateArrow(integerArrow, 'success');
    } else {
        showAlert('Value must be greater than 0!', 'error');
        romanOutput.textContent = '​';
        romanOutputCopyButton.disabled = true;
        romanOutputCopy2Button.disabled = true;
        updateArrow(integerArrow, 'error');
    }
}

/**
 * Converts the provided roman numerals to a number and displays the result.
 */
function convertRoman() {
    romanInput.value = romanInput.value.toUpperCase();
    const input = romanInput.value.replace(/_(\w)/g, (match) => match.toLowerCase()).replace(/_/g, '');
    if (/^(?:m*)(?:d?c{0,3}|c[md])(?:l?x{0,3}|x[cl])(?:(?:vi?){0,3}|i[xv])(?:M{0,3})(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/.test(input) === true) {
        integerOutputVal = deromanize(input).toString();
        integerOutput.value = deromanize(input).toString();
        integerOutputCopyButton.disabled = false;
        updateArrow(romanArrow, 'success');
    } else {
        showAlert('Invalid roman numeral!', 'error');
        integerOutput.value = '';
        integerOutputCopyButton.disabled = true;
        updateArrow(romanArrow, 'error');
    }
}

const roman = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
const decimal = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];

/**
 * Converts a number to roman numerals.
 * @param number Number to convert to roman numerals.
 * @see https://iandevlin.com/files/blog/romanNumerals.html
 */
function romanize(number: number) {
    let barredNumerals = '';
    while (number > 3999)
        for (let i = 0; i < decimal.length - 1; i++) {
            const currentNumber = decimal[i] * 1000;
            if (number < currentNumber) continue;

            number -= currentNumber;
            barredNumerals += roman[i];
            break;
        }

    let regularNumerals = '';
    while (number > 0)
        for (let i = 0; i < decimal.length; i++) {
            const currentNumber = decimal[i];
            if (number < currentNumber) continue;

            number -= currentNumber;
            regularNumerals += roman[i];
            break;
        }

    romanOutputVal = barredNumerals.replace(/I/g, 'Ī').replace(/V/g, 'V̄').replace(/X/g, 'X̄').replace(/L/g, 'L̄').replace(/C/g, 'C̄').replace(/D/g, 'D̄').replace(/M/g, 'M̄') + regularNumerals;
    romanOutputVal2 = barredNumerals.replace(/([A-Z])/g, '_$1') + regularNumerals;
    return barredNumerals.length > 0 ? `<span style="border-top: 1px solid">${barredNumerals}</span>${regularNumerals}` : regularNumerals;
}

/**
 * Converts a roman numerals to a number.
 * @param string Roman numeral to convert to number.
 * @author emnudge
 */
function deromanize(string: string) {
    const token = /[mdlv]|c[md]?|x[cl]?|i[xv]|[MDLV]|C[MD]?|X[CL]?|I[XV]?/g;
    const key: Record<string, number> = {
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
