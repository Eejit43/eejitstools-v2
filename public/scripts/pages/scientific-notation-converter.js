import { showAlert, updateArrow, copyText } from '/scripts/functions.js';

const decimalInput = document.getElementById('decimal-input');
const decimalConvert = document.getElementById('decimal-convert');
const decimalReset = document.getElementById('decimal-reset');
const decimalArrow = document.getElementById('decimal-arrow');
const scientificOutput = document.getElementById('scientific-output');
const scientificOutputCopy = document.getElementById('scientific-output-copy');
const scientificOutputCopy2 = document.getElementById('scientific-output-copy-2');
const scientificInput = document.getElementById('scientific-input');
const scientificConvert = document.getElementById('scientific-convert');
const scientificReset = document.getElementById('scientific-reset');
const scientificArrow = document.getElementById('scientific-arrow');
const decimalOutput = document.getElementById('decimal-output');
const decimalOutputCopy = document.getElementById('decimal-output-copy');

let scientificOutputVal, scientificOutputVal2;

/* Add event listeners */
decimalInput.addEventListener('input', () => {
    decimalInput.value = decimalInput.value
        .replace(/[^0-9\.\-\+]/g, '')
        .replace(/(\..*?)\./g, '$1')
        .replace(/(-.*?)-/g, '$1')
        .replace(/(\+.*?)\+/g, '$1');
});
decimalInput.addEventListener('input', () => {
    if (decimalInput.value.length > 0) {
        decimalConvert.disabled = false;
    } else {
        decimalConvert.disabled = true;
    }
    if (decimalInput.value.length > 0 || scientificOutput.value.length > 0 || decimalArrow.style.color !== 'dimgray') {
        decimalReset.disabled = false;
    } else {
        decimalReset.disabled = true;
    }
});
decimalConvert.addEventListener('click', convertDecimal);
decimalReset.addEventListener('click', () => {
    scientificOutputVal = '';
    scientificOutputVal2 = '';
    decimalInput.value = '';
    decimalConvert.disabled = true;
    decimalReset.disabled = true;
    scientificOutput.value = '';
    scientificOutputCopy.disabled = true;
    scientificOutputCopy2.disabled = true;

    showAlert('Reset!', 'success');
    updateArrow(decimalArrow, 'reset');
});
scientificOutputCopy.addEventListener('click', () => {
    copyText(scientificOutputCopy, scientificOutputVal);
});
scientificOutputCopy2.addEventListener('click', () => {
    copyText(scientificOutputCopy2, scientificOutputVal2);
});
scientificInput.addEventListener('input', () => {
    if (scientificInput.value.length > 0) scientificConvert.disabled = false;
    else scientificConvert.disabled = true;

    if (scientificInput.value.length > 0 || decimalOutput.value !== '' || scientificArrow.style.color !== 'dimgray') scientificReset.disabled = false;
    else scientificReset.disabled = true;
});
scientificConvert.addEventListener('click', convertScientific);
scientificReset.addEventListener('click', () => {
    scientificInput.value = '';
    scientificConvert.disabled = true;
    scientificReset.disabled = true;
    decimalOutput.value = '';
    decimalOutputCopy.disabled = true;

    showAlert('Reset!', 'success');
    updateArrow(scientificArrow, 'reset');
});
decimalOutputCopy.addEventListener('click', () => {
    copyText(decimalOutputCopy, decimalOutputVal);
});

function convertDecimal() {
    if (/^[+-]?([0-9]\d*)(\.\d*|,\d*)*$/g.test(decimalInput.value.trim()) || /^-?\d*\.\d+$/g.test(decimalInput.value.trim())) {
        scientificOutput.value = math.bignumber(decimalInput.value).toExponential();
        scientificOutputVal = math.bignumber(decimalInput.value).toExponential();
        scientificOutputVal2 = math.bignumber(decimalInput.value).toExponential().toString().replace('e+', ' x 10^').replace('e-', ' x 10^-');
        scientificOutputCopy.disabled = false;
        scientificOutputCopy2.disabled = false;
        updateArrow(decimalArrow, 'success');
    } else {
        scientificOutput.value = '';
        scientificOutputCopy.disabled = true;
        scientificOutputCopy2.disabled = true;
        updateArrow(decimalArrow, 'error');
        showAlert('Invalid number!', 'error');
    }
}

function convertScientific() {
    if (/^[+-]?\d(\.\d+)?[Ee][+-]?\d+$/g.test(scientificInput.value.trim())) {
        decimalOutput.value = math.format(math.bignumber(scientificInput.value), { notation: 'fixed' });
        decimalOutputVal = Number(scientificInput.value).toLocaleString('fullwide', { useGrouping: false, maximumFractionDigits: 20 });
        decimalOutputCopy.disabled = false;
        updateArrow(scientificArrow, 'success', 'right');
    } else if (/^[+-]?\d(\.\d+)? ?[xX\*] ?10\^[+-]?\d+$/g.test(scientificInput.value.trim())) {
        decimalOutput.value = math.format(
            math.bignumber(
                scientificInput.value
                    .replace(/ ?[xX\*] ?10\^(\d)/g, 'e+$1')
                    .replace(/ ?[xX\*] ?10\^-/g, 'e-')
                    .replace(/ ?[xX\*] ?10\^\+/g, 'e')
            ),
            { notation: 'fixed' }
        );
        decimalOutputVal = math.format(
            math.bignumber(
                scientificInput.value
                    .replace(/ ?[xX\*] ?10\^(\d)/g, 'e+$1')
                    .replace(/ ?[xX\*] ?10\^-/g, 'e-')
                    .replace(/ ?[xX\*] ?10\^\+/g, 'e')
            ),
            { notation: 'fixed' }
        );
        decimalOutputCopy.disabled = false;
        updateArrow(scientificArrow, 'success');
    } else {
        decimalOutput.value = '';
        decimalOutputCopy.disabled = true;
        updateArrow(scientificArrow, 'error');
        showAlert('Invalid scientific notation!', 'error');
    }
}
