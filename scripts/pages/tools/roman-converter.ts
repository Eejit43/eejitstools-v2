import { copyText, showAlert, updateArrow } from '../../functions.js';

const integerInput = document.querySelector('#integer-input') as HTMLInputElement;
const integerConvertButton = document.querySelector('#integer-convert') as HTMLButtonElement;
const integerResetButton = document.querySelector('#integer-reset') as HTMLButtonElement;
const integerArrow = document.querySelector('#integer-arrow') as HTMLElement;
const romanOutput = document.querySelector('#roman-output') as HTMLButtonElement; // This *is* actually a button, it functions as a fake input as HTML is needed to add top borders to characters
const romanOutputCopyButton = document.querySelector('#roman-output-copy') as HTMLButtonElement;
const romanOutputCopy2Button = document.querySelector('#roman-output-copy-2') as HTMLButtonElement;
const romanInput = document.querySelector('#roman-input') as HTMLInputElement;
const romanConvertButton = document.querySelector('#roman-convert') as HTMLButtonElement;
const romanResetButton = document.querySelector('#roman-reset') as HTMLButtonElement;
const romanArrow = document.querySelector('#roman-arrow') as HTMLElement;
const integerOutput = document.querySelector('#integer-output') as HTMLInputElement;
const integerOutputCopyButton = document.querySelector('#integer-output-copy') as HTMLButtonElement;

let romanOutputValue: string, romanOutputValue2: string, integerOutputValue: string;

/* Add event listeners */
integerInput.addEventListener('input', () => {
    if (Number.parseInt(integerInput.value) === 0) integerInput.value = '';
});
integerInput.addEventListener('input', () => {
    integerInput.value = integerInput.value.replaceAll(/\D/g, '').replaceAll(/(\..*)\./g, '$1');
});
integerInput.addEventListener('input', () => {
    integerConvertButton.disabled = integerInput.value.length === 0;

    integerResetButton.disabled = !(integerInput.value.length > 0 || romanOutput.innerHTML !== '​' || integerArrow.style.color !== 'dimgray');
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
    romanInput.value = romanInput.value.replaceAll(/((?![_cdilmvx]).)/gi, '');
});
romanInput.addEventListener('input', () => {
    romanConvertButton.disabled = romanInput.value.length === 0;

    romanResetButton.disabled = !(romanInput.value.length > 0 || integerOutput.value !== '' || romanArrow.style.color !== 'dimgray');
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
romanOutputCopyButton.addEventListener('click', () => copyText(romanOutputCopyButton, romanOutputValue));
romanOutputCopy2Button.addEventListener('click', () => copyText(romanOutputCopy2Button, romanOutputValue2));
integerOutputCopyButton.addEventListener('click', () => copyText(integerOutputCopyButton, integerOutputValue));

/**
 * Converts the provided integer to roman numerals and displays the result.
 */
function convertInteger() {
    if (Number.parseInt(integerInput.value) > 0) {
        romanOutput.innerHTML = romanize(Number.parseInt(integerInput.value));
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
    const input = romanInput.value.replaceAll(/_(\w)/g, (match) => match.toLowerCase()).replaceAll('_', '');
    if (/^m*(?:d?c{0,3}|c[dm])(?:l?x{0,3}|x[cl])(?:(?:vi?){0,3}|i[vx])M{0,3}(?:D?C{0,3}|C[DM])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[VX])$/.test(input) === true) {
        integerOutputValue = deromanize(input).toString();
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
        for (let index = 0; index < decimal.length - 1; index++) {
            const currentNumber = decimal[index] * 1000;
            if (number < currentNumber) continue;

            number -= currentNumber;
            barredNumerals += roman[index];
            break;
        }

    let regularNumerals = '';
    while (number > 0)
        for (const [index, currentNumber] of decimal.entries()) {
            if (number < currentNumber) continue;

            number -= currentNumber;
            regularNumerals += roman[index];
            break;
        }

    romanOutputValue = barredNumerals.replaceAll('I', 'Ī').replaceAll('V', 'V̄').replaceAll('X', 'X̄').replaceAll('L', 'L̄').replaceAll('C', 'C̄').replaceAll('D', 'D̄').replaceAll('M', 'M̄') + regularNumerals;
    romanOutputValue2 = barredNumerals.replaceAll(/([A-Z])/g, '_$1') + regularNumerals;
    return barredNumerals.length > 0 ? `<span style="border-top: 1px solid">${barredNumerals}</span>${regularNumerals}` : regularNumerals;
}

/**
 * Converts a roman numerals to a number.
 * @param string Roman numeral to convert to number.
 * @author emnudge
 */
function deromanize(string: string) {
    const token = /[dlmv]|c[dm]?|x[cl]?|i[vx]|[DLMV]|C[DM]?|X[CL]?|I[VX]?/g;
    const key: Record<string, number> = {
        m: 1_000_000,
        cm: 900_000,
        d: 500_000,
        cd: 400_000,
        c: 100_000,
        xc: 90_000,
        l: 50_000,
        xl: 40_000,
        x: 10_000,
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
    let index;
    while ((index = token.exec(string))) output += key[index[0]];
    return output;
}
