import type math from 'mathjs';
import { copyText, showAlert, updateArrow } from '../../functions.js';

declare global {
    interface Window {
        math: typeof math;
    }
}
const decimalInput = document.getElementById('decimal-input') as HTMLInputElement;
const decimalConvertButton = document.getElementById('decimal-convert') as HTMLButtonElement;
const decimalResetButton = document.getElementById('decimal-reset') as HTMLButtonElement;
const decimalArrow = document.getElementById('decimal-arrow')!;
const scientificOutput = document.getElementById('scientific-output') as HTMLInputElement;
const scientificOutputCopyButton = document.getElementById('scientific-output-copy') as HTMLButtonElement;
const scientificOutputCopy2Button = document.getElementById('scientific-output-copy-2') as HTMLButtonElement;
const scientificInput = document.getElementById('scientific-input') as HTMLInputElement;
const scientificConvertButton = document.getElementById('scientific-convert') as HTMLButtonElement;
const scientificResetButton = document.getElementById('scientific-reset') as HTMLButtonElement;
const scientificArrow = document.getElementById('scientific-arrow')!;
const decimalOutput = document.getElementById('decimal-output') as HTMLInputElement;
const decimalOutputCopyButton = document.getElementById('decimal-output-copy') as HTMLButtonElement;

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
    if (decimalInput.value.length > 0) decimalConvertButton.disabled = false;
    else decimalConvertButton.disabled = true;

    if (decimalInput.value.length > 0 || scientificOutput.value.length > 0 || decimalArrow.style.color !== 'dimgray') decimalResetButton.disabled = false;
    else decimalResetButton.disabled = true;
});
decimalConvertButton.addEventListener('click', convertDecimal);
decimalResetButton.addEventListener('click', () => {
    scientificOutputVal = '';
    scientificOutputVal2 = '';
    decimalInput.value = '';
    decimalConvertButton.disabled = true;
    decimalResetButton.disabled = true;
    scientificOutput.value = '';
    scientificOutputCopyButton.disabled = true;
    scientificOutputCopy2Button.disabled = true;

    showAlert('Reset!', 'success');
    updateArrow(decimalArrow, 'reset');
});
scientificOutputCopyButton.addEventListener('click', () => copyText(scientificOutputCopyButton, scientificOutputVal));
scientificOutputCopy2Button.addEventListener('click', () => copyText(scientificOutputCopy2Button, scientificOutputVal2));
scientificInput.addEventListener('input', () => {
    if (scientificInput.value.length > 0) scientificConvertButton.disabled = false;
    else scientificConvertButton.disabled = true;

    if (scientificInput.value.length > 0 || decimalOutput.value !== '' || scientificArrow.style.color !== 'dimgray') scientificResetButton.disabled = false;
    else scientificResetButton.disabled = true;
});
scientificConvertButton.addEventListener('click', convertScientific);
scientificResetButton.addEventListener('click', () => {
    scientificInput.value = '';
    scientificConvertButton.disabled = true;
    scientificResetButton.disabled = true;
    decimalOutput.value = '';
    decimalOutputCopyButton.disabled = true;

    showAlert('Reset!', 'success');
    updateArrow(scientificArrow, 'reset');
});
decimalOutputCopyButton.addEventListener('click', () => copyText(decimalOutputCopyButton, decimalOutputVal));

/**
 * Converts a decimal to scientific notation and displays the result.
 */
function convertDecimal() {
    if (/^[+-]?([0-9]\d*)(\.\d*|,\d*)*$/g.test(decimalInput.value.trim()) || /^-?\d*\.\d+$/g.test(decimalInput.value.trim())) {
        scientificOutput.value = window.math.bignumber(decimalInput.value).toExponential();
        scientificOutputVal = window.math.bignumber(decimalInput.value).toExponential();
        scientificOutputVal2 = window.math.bignumber(decimalInput.value).toExponential().toString().replace('e+', ' x 10^').replace('e-', ' x 10^-');
        scientificOutputCopyButton.disabled = false;
        scientificOutputCopy2Button.disabled = false;
        updateArrow(decimalArrow, 'success');
    } else {
        scientificOutput.value = '';
        scientificOutputCopyButton.disabled = true;
        scientificOutputCopy2Button.disabled = true;
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
        decimalOutputCopyButton.disabled = false;
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
        decimalOutputCopyButton.disabled = false;
        updateArrow(scientificArrow, 'success');
    } else {
        decimalOutput.value = '';
        decimalOutputCopyButton.disabled = true;
        updateArrow(scientificArrow, 'error');
        showAlert('Invalid scientific notation!', 'error');
    }
}
