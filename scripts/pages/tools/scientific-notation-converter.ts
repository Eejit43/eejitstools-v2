import type math from 'mathjs';
import { copyText, showAlert, updateArrow } from '../../functions.js';

declare global {
    interface Window {
        math: typeof math;
    }
}
const decimalInput = document.getElementById('decimal-input') as HTMLInputElement;
const decimalConvert = document.getElementById('decimal-convert') as HTMLButtonElement;
const decimalReset = document.getElementById('decimal-reset') as HTMLButtonElement;
const decimalArrow = document.getElementById('decimal-arrow') as HTMLElement;
const scientificOutput = document.getElementById('scientific-output') as HTMLInputElement;
const scientificOutputCopy = document.getElementById('scientific-output-copy') as HTMLButtonElement;
const scientificOutputCopy2 = document.getElementById('scientific-output-copy-2') as HTMLButtonElement;
const scientificInput = document.getElementById('scientific-input') as HTMLInputElement;
const scientificConvert = document.getElementById('scientific-convert') as HTMLButtonElement;
const scientificReset = document.getElementById('scientific-reset') as HTMLButtonElement;
const scientificArrow = document.getElementById('scientific-arrow') as HTMLElement;
const decimalOutput = document.getElementById('decimal-output') as HTMLInputElement;
const decimalOutputCopy = document.getElementById('decimal-output-copy') as HTMLButtonElement;

let decimalOutputVal: string, scientificOutputVal: string, scientificOutputVal2: string;

/* Add event listeners */
decimalInput.addEventListener('input', () => {
    decimalInput.value = decimalInput.value
        .replace(/[^0-9.\-+]/g, '')
        .replace(/(\..*?)\./g, '$1')
        .replace(/(-.*?)-/g, '$1')
        .replace(/(\+.*?)\+/g, '$1');
});
decimalInput.addEventListener('input', () => {
    if (decimalInput.value.length > 0) decimalConvert.disabled = false;
    else decimalConvert.disabled = true;

    if (decimalInput.value.length > 0 || scientificOutput.value.length > 0 || decimalArrow.style.color !== 'dimgray') decimalReset.disabled = false;
    else decimalReset.disabled = true;
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
scientificOutputCopy.addEventListener('click', () => copyText(scientificOutputCopy, scientificOutputVal));
scientificOutputCopy2.addEventListener('click', () => copyText(scientificOutputCopy2, scientificOutputVal2));
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
decimalOutputCopy.addEventListener('click', () => copyText(decimalOutputCopy, decimalOutputVal));

/**
 * Converts a decimal to scientific notation and displays the result.
 */
function convertDecimal() {
    if (/^[+-]?([0-9]\d*)(\.\d*|,\d*)*$/g.test(decimalInput.value.trim()) || /^-?\d*\.\d+$/g.test(decimalInput.value.trim())) {
        scientificOutput.value = window.math.bignumber(decimalInput.value).toExponential();
        scientificOutputVal = window.math.bignumber(decimalInput.value).toExponential();
        scientificOutputVal2 = window.math.bignumber(decimalInput.value).toExponential().toString().replace('e+', ' x 10^').replace('e-', ' x 10^-');
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

/**
 * Converts a number in scientific notation to a decimal and displays the result.
 */
function convertScientific() {
    if (/^[+-]?\d(\.\d+)?[Ee][+-]?\d+$/g.test(scientificInput.value.trim())) {
        decimalOutput.value = window.math.format(window.math.bignumber(scientificInput.value), { notation: 'fixed' });
        decimalOutputVal = Number(scientificInput.value).toLocaleString('fullwide', { useGrouping: false, maximumFractionDigits: 20 });
        decimalOutputCopy.disabled = false;
        updateArrow(scientificArrow, 'success', 'right');
    } else if (/^[+-]?\d(\.\d+)? ?[xX*] ?10\^[+-]?\d+$/g.test(scientificInput.value.trim())) {
        decimalOutput.value = window.math.format(
            window.math.bignumber(
                scientificInput.value
                    .replace(/ ?[xX*] ?10\^(\d)/g, 'e+$1')
                    .replace(/ ?[xX*] ?10\^-/g, 'e-')
                    .replace(/ ?[xX*] ?10\^\+/g, 'e')
            ),
            { notation: 'fixed' }
        );
        decimalOutputVal = window.math.format(
            window.math.bignumber(
                scientificInput.value
                    .replace(/ ?[xX*] ?10\^(\d)/g, 'e+$1')
                    .replace(/ ?[xX*] ?10\^-/g, 'e-')
                    .replace(/ ?[xX*] ?10\^\+/g, 'e')
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
