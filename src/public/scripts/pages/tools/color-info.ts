import type chroma from 'chroma-js';
import type { Color } from 'chroma-js';
import { copyValue, showAlert } from '../../functions.js';

declare global {
    interface Window {
        chroma: typeof chroma;
    }
}

const generateRandomButton = document.querySelector('#generate-random') as HTMLButtonElement;
const colorDisplay = document.querySelector('#color-display') as HTMLDivElement;
const colorPicker = document.querySelector('#color-picker') as HTMLInputElement;
const darkenButton = document.querySelector('#darken') as HTMLButtonElement;
const brightenButton = document.querySelector('#brighten') as HTMLButtonElement;
const saturateButton = document.querySelector('#saturate') as HTMLButtonElement;
const desaturateButton = document.querySelector('#desaturate') as HTMLButtonElement;
const increaseLuminanceButton = document.querySelector('#increase-luminance') as HTMLButtonElement;
const decreaseLuminanceButton = document.querySelector('#decrease-luminance') as HTMLButtonElement;
const nameInput = document.querySelector('#name-input') as HTMLInputElement;
const hexInput = document.querySelector('#hex-input') as HTMLInputElement;
const decimalInput = document.querySelector('#decimal-input') as HTMLInputElement;
const rgbInput = document.querySelector('#rgb-input') as HTMLInputElement;
const hslInput = document.querySelector('#hsl-input') as HTMLInputElement;
const alphaInput = document.querySelector('#alpha-input') as HTMLInputElement;
const copyNameButton = document.querySelector('#copy-name') as HTMLButtonElement;
const copyHexButton = document.querySelector('#copy-hex') as HTMLButtonElement;
const copyDecimalButton = document.querySelector('#copy-decimal') as HTMLButtonElement;
const copyRgbButton = document.querySelector('#copy-rgb') as HTMLButtonElement;
const copyHslButton = document.querySelector('#copy-hsl') as HTMLButtonElement;
const copyAlphaButton = document.querySelector('#copy-alpha') as HTMLButtonElement;
const luminanceOutput = document.querySelector('#luminance-output') as HTMLInputElement;
const temperatureOutput = document.querySelector('#temperature-output') as HTMLInputElement;
const colorHistory = document.querySelector('#color-history') as HTMLUListElement;
const fullColor = document.querySelector('#full-color') as HTMLDivElement;

generateRandomButton.addEventListener('click', generateRandomColor);

document.addEventListener('keydown', (event) => {
    if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
    if (event.altKey && event.code === 'KeyR') generateRandomColor();
    if (event.altKey && event.code === 'KeyL') {
        navigator.clipboard.writeText(colorPicker.value);
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

darkenButton.addEventListener('click', () => updateResults(window.chroma(hexInput.value).darken(0.5)));

brightenButton.addEventListener('click', () => updateResults(window.chroma(hexInput.value).brighten(0.5)));

saturateButton.addEventListener('click', () => updateResults(window.chroma(hexInput.value).saturate(0.5)));

desaturateButton.addEventListener('click', () => updateResults(window.chroma(hexInput.value).desaturate(0.5)));

increaseLuminanceButton.addEventListener('click', () => updateResults(window.chroma(hexInput.value).luminance(window.chroma(hexInput.value).luminance() * 1.5)));

decreaseLuminanceButton.addEventListener('click', () => updateResults(window.chroma(hexInput.value).luminance(window.chroma(hexInput.value).luminance() * 0.5)));

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

copyNameButton.addEventListener('click', () => copyValue(copyNameButton, nameInput));

copyHexButton.addEventListener('click', () => copyValue(copyHexButton, hexInput));

copyDecimalButton.addEventListener('click', () => copyValue(copyDecimalButton, decimalInput));

copyRgbButton.addEventListener('click', () => copyValue(copyRgbButton, rgbInput));

copyHslButton.addEventListener('click', () => copyValue(copyHslButton, hslInput));

copyAlphaButton.addEventListener('click', () => copyValue(copyAlphaButton, alphaInput));

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

    appendedElement.addEventListener('click', () => updateResults(color));

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
    if (element.value?.length > 0) element.style.border = '1px solid var(--error-color-300)';
}

/**
 * Resets an element's border.
 * @param element The element to update.
 */
function resetBorder(element: HTMLInputElement) {
    element.style.border = '';
}
