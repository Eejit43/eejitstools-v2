let integerInput = document.getElementById('integer-input');
let integerConvert = document.getElementById('integer-convert');
let integerReset = document.getElementById('integer-reset');
let integerArrow = document.getElementById('integer-arrow');
let romanOutput = document.getElementById('roman-output');
let romanOutputCopy = document.getElementById('roman-output-copy');
let romanOutputCopy2 = document.getElementById('roman-output-copy-2');
let romanInput = document.getElementById('roman-input');
let romanConvert = document.getElementById('roman-convert');
let romanReset = document.getElementById('roman-reset');
let romanArrow = document.getElementById('roman-arrow');
let integerOutput = document.getElementById('integer-output');
let integerOutputCopy = document.getElementById('integer-output-copy');

let romanOutputVal, romanOutputVal2, integerOutputVal;

/* Add event listeners */
integerInput.addEventListener('input', function () {
    if (parseInt(integerInput.value) === 0) {
        integerInput.value = '';
    }
});
integerInput.addEventListener('input', function () {
    integerInput.value = integerInput.value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1');
});
integerInput.addEventListener('input', function () {
    if (integerInput.value.length > 0) {
        integerConvert.disabled = false;
    } else {
        integerConvert.disabled = true;
    }
    if (integerInput.value.length > 0 || romanOutput.innerHTML !== '​' || integerArrow.style.color !== 'dimgray') {
        integerReset.disabled = false;
    } else {
        integerReset.disabled = true;
    }
});
integerConvert.addEventListener('click', convertInteger);
integerReset.addEventListener('click', resetInteger);
romanInput.addEventListener('input', function () {
    romanInput.value = romanInput.value.toUpperCase();
});
romanInput.addEventListener('input', function () {
    romanInput.value = romanInput.value.replace(/((?![IVXLCDM_]).)/gi, '');
});
romanInput.addEventListener('input', function () {
    if (romanInput.value.length > 0) {
        romanConvert.disabled = false;
    } else {
        romanConvert.disabled = true;
    }
    if (romanInput.value.length > 0 || integerOutput.value !== '' || romanArrow.style.color !== 'dimgray') {
        romanReset.disabled = false;
    } else {
        romanReset.disabled = true;
    }
});
romanConvert.addEventListener('click', convertRoman);
romanReset.addEventListener('click', resetRoman);
romanOutputCopy.addEventListener('click', function () {
    copyVar('romanOutputVal', 'roman-output-copy', 'Copy w/ macrons');
});
romanOutputCopy2.addEventListener('click', function () {
    copyVar('romanOutputVal2', 'roman-output-copy-2', 'Copy w/ underscores');
});
integerOutputCopy.addEventListener('click', function () {
    copyVar('integerOutputVal', 'integer-output-copy', 'Copy');
});

function convertInteger() {
    romanOutputCopy = document.getElementById('roman-output-copy');
    romanOutputCopy2 = document.getElementById('roman-output-copy-2');
    if (parseInt(integerInput.value) > 0) {
        romanOutput.innerHTML = romanize(integerInput.value);
        romanOutputCopy.disabled = false;
        romanOutputCopy2.disabled = false;
        updateArrow('integer', 'success');
    } else {
        showAlert('Value must be greater than 0!', 'error');
        romanOutput.innerHTML = '​';
        romanOutputCopy.disabled = true;
        romanOutputCopy2.disabled = true;
        updateArrow('integer', 'error');
    }
}

function resetInteger() {
    romanOutputCopy = document.getElementById('roman-output-copy');
    romanOutputCopy2 = document.getElementById('roman-output-copy-2');
    showAlert('Reset!', 'success');
    integerInput.value = '';
    integerConvert.disabled = true;
    integerReset.disabled = true;
    updateArrow('integer', 'reset');
    romanOutput.textContent = '​';
    romanOutputCopy.disabled = true;
    romanOutputCopy2.disabled = true;
    romanOutputCopy = undefined;
    romanOutputCopy2 = undefined;
}

function convertRoman() {
    integerOutputCopy = document.getElementById('integer-output-copy');
    romanInput.value = romanInput.value.toUpperCase();
    let input = romanInput.value
        .replace(/\_(\w)/g, function (match) {
            return match.toLowerCase();
        })
        .replace(/_/g, '');
    if (/^(?:m*)(?:d?c{0,3}|c[md])(?:l?x{0,3}|x[cl])(?:(?:vi?){0,3}|i[xv])(?:M{0,3})(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/.test(input) === true) {
        integerOutputVal = deromanize(input);
        integerOutput.value = deromanize(input);
        integerOutputCopy.disabled = false;
        updateArrow('roman', 'success');
    } else {
        showAlert('Invalid roman numeral!', 'error');
        integerOutput.value = '';
        integerOutputCopy.disabled = true;
        updateArrow('roman', 'error');
    }
}

function resetRoman() {
    integerOutputCopy = document.getElementById('integer-output-copy');
    showAlert('Reset!', 'success');
    romanInput.value = '';
    romanConvert.disabled = true;
    romanReset.disabled = true;
    updateArrow('roman', 'reset');
    integerOutput.value = '';
    integerOutputCopy.disabled = true;
}

//Some portions modified from https://blog.stevenlevithan.com/archives/javascript-roman-numeral-converter and https://iandevlin.com/files/blog/romanNumerals.html
//HHHUUUUGEEE thanks to EmNudge#5549 from The Coding Den for their help in remaking this function!!!

const roman = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
const decimal = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];

function romanize(value) {
    let num = value;

    let barredNumerals = '';
    while (num > 3999) {
        for (let i = 0; i < decimal.length - 1; i++) {
            const currentNumber = decimal[i] * 1000;
            if (num < currentNumber) continue;

            num -= currentNumber;
            barredNumerals += roman[i];
            break;
        }
    }

    let regularNumerals = '';
    while (num > 0) {
        for (let i = 0; i < decimal.length; i++) {
            const currentNumber = decimal[i];
            if (num < currentNumber) continue;

            num -= currentNumber;
            regularNumerals += roman[i];
            break;
        }
    }
    romanOutputVal = barredNumerals.replace(/I/g, 'Ī').replace(/V/g, 'V̄').replace(/X/g, 'X̄').replace(/L/g, 'L̄').replace(/C/g, 'C̄').replace(/D/g, 'D̄').replace(/M/g, 'M̄') + regularNumerals;
    romanOutputVal2 = barredNumerals.replace(/([A-Z])/g, '_$1') + regularNumerals;
    return `<span style="border-top:1px solid">${barredNumerals}</span>` + regularNumerals;
}

function deromanize(str) {
    let token = /[mdlv]|c[md]?|x[cl]?|i[xv]|[MDLV]|C[MD]?|X[CL]?|I[XV]?/g;
    let key = {
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
        I: 1,
    };
    let output = 0;
    let i;
    while (i = token.exec(str)) output += key[i[0]]; // prettier-ignore
    return output;
}
