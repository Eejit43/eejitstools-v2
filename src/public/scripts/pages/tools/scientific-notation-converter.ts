import type { MathJsInstance } from '../../../../../node_modules/mathjs/types/index';
import { copyText, showAlert, updateArrow } from '../../functions.js';

declare global {
    interface Window {
        math: MathJsInstance;
    }
}

const decimalInput = document.querySelector('#decimal-input') as HTMLInputElement;
const decimalConvertButton = document.querySelector('#decimal-convert') as HTMLButtonElement;
const decimalResetButton = document.querySelector('#decimal-reset') as HTMLButtonElement;
const decimalArrow = document.querySelector('#decimal-arrow') as HTMLElement;
const scientificOutput = document.querySelector('#scientific-output') as HTMLInputElement;
const scientificOutputCopyButton = document.querySelector('#scientific-output-copy') as HTMLButtonElement;
const scientificOutputCopy2Button = document.querySelector('#scientific-output-copy-2') as HTMLButtonElement;
const scientificInput = document.querySelector('#scientific-input') as HTMLInputElement;
const scientificConvertButton = document.querySelector('#scientific-convert') as HTMLButtonElement;
const scientificResetButton = document.querySelector('#scientific-reset') as HTMLButtonElement;
const scientificArrow = document.querySelector('#scientific-arrow') as HTMLElement;
const decimalOutput = document.querySelector('#decimal-output') as HTMLInputElement;
const decimalOutputCopyButton = document.querySelector('#decimal-output-copy') as HTMLButtonElement;

let decimalOutputValue: string, scientificOutputValue: string, scientificOutputValue2: string;

/* Add event listeners */
decimalInput.addEventListener('input', () => {
    decimalInput.value = decimalInput.value
        .replaceAll(/[^\d+.-]/g, '')
        .replaceAll(/(\..*?)\./g, '$1')
        .replaceAll(/(-.*?)-/g, '$1')
        .replaceAll(/(\+.*?)\+/g, '$1');
});
decimalInput.addEventListener('input', () => {
    decimalConvertButton.disabled = decimalInput.value.length === 0;

    decimalResetButton.disabled = !(
        decimalInput.value.length > 0 ||
        scientificOutput.value.length > 0 ||
        decimalArrow.style.color !== 'dimgray'
    );
});
decimalConvertButton.addEventListener('click', convertDecimal);
decimalResetButton.addEventListener('click', () => {
    scientificOutputValue = '';
    scientificOutputValue2 = '';
    decimalInput.value = '';
    decimalConvertButton.disabled = true;
    decimalResetButton.disabled = true;
    scientificOutput.value = '';
    scientificOutputCopyButton.disabled = true;
    scientificOutputCopy2Button.disabled = true;

    showAlert('Reset!', 'success');
    updateArrow(decimalArrow, 'reset');
});
scientificOutputCopyButton.addEventListener('click', () => copyText(scientificOutputCopyButton, scientificOutputValue));
scientificOutputCopy2Button.addEventListener('click', () => copyText(scientificOutputCopy2Button, scientificOutputValue2));
scientificInput.addEventListener('input', () => {
    scientificConvertButton.disabled = scientificInput.value.length === 0;

    scientificResetButton.disabled = !(
        scientificInput.value.length > 0 ||
        decimalOutput.value !== '' ||
        scientificArrow.style.color !== 'dimgray'
    );
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
decimalOutputCopyButton.addEventListener('click', () => copyText(decimalOutputCopyButton, decimalOutputValue));

/**
 * Converts a decimal to scientific notation and displays the result.
 */
function convertDecimal() {
    if (/^[+-]?(\d+)(\.\d*|,\d*)*$/g.test(decimalInput.value.trim()) || /^-?\d*\.\d+$/g.test(decimalInput.value.trim())) {
        scientificOutput.value = window.math.bignumber(decimalInput.value).toExponential();
        scientificOutputValue = window.math.bignumber(decimalInput.value).toExponential();
        scientificOutputValue2 = window.math
            .bignumber(decimalInput.value)
            .toExponential()
            .toString()
            .replace('e+', ' x 10^')
            .replace('e-', ' x 10^-');
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
        decimalOutputValue = Number(scientificInput.value).toLocaleString('fullwide', { useGrouping: false, maximumFractionDigits: 20 });
        decimalOutputCopyButton.disabled = false;
        updateArrow(scientificArrow, 'success', 'right');
    } else if (/^[+-]?\d(\.\d+)? ?[*Xx] ?10\^[+-]?\d+$/g.test(scientificInput.value.trim())) {
        decimalOutput.value = window.math.format(
            window.math.bignumber(
                scientificInput.value
                    .replaceAll(/ ?[*Xx] ?10\^(\d)/g, 'e+$1')
                    .replaceAll(/ ?[*Xx] ?10\^-/g, 'e-')
                    .replaceAll(/ ?[*Xx] ?10\^\+/g, 'e'),
            ),
            { notation: 'fixed' },
        );
        decimalOutputValue = window.math.format(
            window.math.bignumber(
                scientificInput.value
                    .replaceAll(/ ?[*Xx] ?10\^(\d)/g, 'e+$1')
                    .replaceAll(/ ?[*Xx] ?10\^-/g, 'e-')
                    .replaceAll(/ ?[*Xx] ?10\^\+/g, 'e'),
            ),
            { notation: 'fixed' },
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
