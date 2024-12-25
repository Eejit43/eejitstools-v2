import type { ChromaStatic, Color } from 'chroma-js';
import { copyValue, showAlert } from '../../functions.js';

declare global {
    interface Window {
        chroma: ChromaStatic;
    }
}

const generateRandomButton = document.querySelector<HTMLButtonElement>('#generate-random')!;
const colorDisplay = document.querySelector<HTMLDivElement>('#color-display')!;
const colorPicker = document.querySelector<HTMLInputElement>('#color-picker')!;
const darkenButton = document.querySelector<HTMLButtonElement>('#darken')!;
const brightenButton = document.querySelector<HTMLButtonElement>('#brighten')!;
const saturateButton = document.querySelector<HTMLButtonElement>('#saturate')!;
const desaturateButton = document.querySelector<HTMLButtonElement>('#desaturate')!;
const increaseLuminanceButton = document.querySelector<HTMLButtonElement>('#increase-luminance')!;
const decreaseLuminanceButton = document.querySelector<HTMLButtonElement>('#decrease-luminance')!;
const nameInput = document.querySelector<HTMLInputElement>('#name-input')!;
const hexInput = document.querySelector<HTMLInputElement>('#hex-input')!;
const decimalInput = document.querySelector<HTMLInputElement>('#decimal-input')!;
const rgbInput = document.querySelector<HTMLInputElement>('#rgb-input')!;
const hslInput = document.querySelector<HTMLInputElement>('#hsl-input')!;
const alphaInput = document.querySelector<HTMLInputElement>('#alpha-input')!;
const copyNameButton = document.querySelector<HTMLButtonElement>('#copy-name')!;
const copyHexButton = document.querySelector<HTMLButtonElement>('#copy-hex')!;
const copyDecimalButton = document.querySelector<HTMLButtonElement>('#copy-decimal')!;
const copyRgbButton = document.querySelector<HTMLButtonElement>('#copy-rgb')!;
const copyHslButton = document.querySelector<HTMLButtonElement>('#copy-hsl')!;
const copyAlphaButton = document.querySelector<HTMLButtonElement>('#copy-alpha')!;
const luminanceOutput = document.querySelector<HTMLInputElement>('#luminance-output')!;
const temperatureOutput = document.querySelector<HTMLInputElement>('#temperature-output')!;
const colorHistory = document.querySelector<HTMLUListElement>('#color-history')!;
const fullColor = document.querySelector<HTMLDivElement>('#full-color')!;

generateRandomButton.addEventListener('click', generateRandomColor);

document.addEventListener('keydown', (event) => {
    if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
    if (event.altKey && event.code === 'KeyR') generateRandomColor();
    if (event.altKey && event.code === 'KeyL') {
        void navigator.clipboard.writeText(colorPicker.value);
        showAlert('Copied current color!', 'success');
    }
});

colorDisplay.addEventListener('click', () => (fullColor.style.display = 'block'));

colorPicker.addEventListener('input', () => {
    if (window.chroma.valid(colorPicker.value)) {
        resetBorder(colorPicker);
        updateResults(window.chroma(colorPicker.value));
    } else setRedBorder(colorPicker);
});

darkenButton.addEventListener('click', () => {
    updateResults(window.chroma(hexInput.value).darken(0.5));
});

brightenButton.addEventListener('click', () => {
    updateResults(window.chroma(hexInput.value).brighten(0.5));
});

saturateButton.addEventListener('click', () => {
    updateResults(window.chroma(hexInput.value).saturate(0.5));
});

desaturateButton.addEventListener('click', () => {
    updateResults(window.chroma(hexInput.value).desaturate(0.5));
});

increaseLuminanceButton.addEventListener('click', () => {
    updateResults(window.chroma(hexInput.value).luminance(window.chroma(hexInput.value).luminance() * 1.5));
});

decreaseLuminanceButton.addEventListener('click', () => {
    updateResults(window.chroma(hexInput.value).luminance(window.chroma(hexInput.value).luminance() * 0.5));
});

nameInput.addEventListener('blur', () => {
    if (window.chroma.valid(nameInput.value)) {
        resetBorder(nameInput);
        updateResults(window.chroma(nameInput.value));
    } else setRedBorder(nameInput);
});

hexInput.addEventListener('blur', () => {
    if (window.chroma.valid(hexInput.value)) {
        resetBorder(hexInput);
        updateResults(window.chroma(hexInput.value));
    } else setRedBorder(hexInput);
});

decimalInput.addEventListener('blur', () => {
    if (window.chroma.valid('#' + Number.parseInt(decimalInput.value).toString(16).padStart(6, '0'))) {
        resetBorder(decimalInput);
        updateResults(window.chroma('#' + Number.parseInt(decimalInput.value).toString(16).padStart(6, '0')));
    } else setRedBorder(decimalInput);
});

rgbInput.addEventListener('blur', () => {
    if (window.chroma.valid(rgbInput.value)) {
        resetBorder(rgbInput);
        updateResults(window.chroma(rgbInput.value));
    } else setRedBorder(rgbInput);
});

hslInput.addEventListener('blur', () => {
    if (window.chroma.valid(hslInput.value)) {
        resetBorder(hslInput);
        updateResults(window.chroma(hslInput.value));
    } else setRedBorder(hslInput);
});

alphaInput.addEventListener('blur', () => {
    if (alphaInput.value.length > 0 && Number(alphaInput.value) >= 0 && Number(alphaInput.value) <= 1) {
        resetBorder(alphaInput);
        updateResults(window.chroma(hexInput.value).alpha(Number(alphaInput.value)));
    } else setRedBorder(alphaInput);
});

copyNameButton.addEventListener('click', () => {
    copyValue(copyNameButton, nameInput);
});

copyHexButton.addEventListener('click', () => {
    copyValue(copyHexButton, hexInput);
});

copyDecimalButton.addEventListener('click', () => {
    copyValue(copyDecimalButton, decimalInput);
});

copyRgbButton.addEventListener('click', () => {
    copyValue(copyRgbButton, rgbInput);
});

copyHslButton.addEventListener('click', () => {
    copyValue(copyHslButton, hslInput);
});

copyAlphaButton.addEventListener('click', () => {
    copyValue(copyAlphaButton, alphaInput);
});

fullColor.addEventListener('click', () => (fullColor.style.display = 'none'));

document.addEventListener('keydown', (event) => {
    if (fullColor.style.display === 'block' && event.code === 'Escape') fullColor.style.display = 'none';
});

/**
 * Updates a color to all values.
 * @param color The color to update results for.
 */
function updateResults(color: Color) {
    for (const element of [colorPicker, nameInput, hexInput, decimalInput, rgbInput, hslInput, alphaInput]) resetBorder(element);

    colorDisplay.style.color = color.hex();
    colorPicker.value = color.alpha(1).hex();
    nameInput.value = color.name().startsWith('#') ? '' : color.name();
    hexInput.value = color.hex();
    decimalInput.value = Number.parseInt(color.hex().replace(/^#/, ''), 16).toString(10);
    rgbInput.value = color.css();
    hslInput.value = color.css('hsl');
    alphaInput.value = color.alpha().toString();
    luminanceOutput.value = color.luminance().toLocaleString();
    temperatureOutput.value = color.temperature().toString();

    const colorHistoryElement = document.createElement('li');
    colorHistoryElement.style.color = color.hex();
    colorHistoryElement.textContent = color.hex();

    const appendedElement = colorHistory.appendChild(colorHistoryElement); // eslint-disable-line unicorn/prefer-dom-node-append

    appendedElement.addEventListener('click', () => {
        updateResults(color);
    });

    fullColor.style.backgroundColor = colorDisplay.style.color;
}

/**
 * Generates a random color and updates the results.
 */
function generateRandomColor() {
    const letters = '0123456789abcdef';
    let randomColor = '#';
    for (let index = 0; index < 6; index++) randomColor += letters[Math.floor(Math.random() * 16)];

    updateResults(window.chroma(randomColor));
}

generateRandomColor();

/**
 * Adds a red border to an element.
 * @param element The element to update.
 */
function setRedBorder(element: HTMLInputElement) {
    if (element.value.length > 0) element.style.border = '1px solid var(--error-color-300)';
}

/**
 * Resets an element's border.
 * @param element The element to update.
 */
function resetBorder(element: HTMLInputElement) {
    element.style.border = '';
}
