import type chroma from 'chroma-js';
import type { Color } from 'chroma-js';
import { copyValue, showAlert } from '../../functions.js';

declare global {
    interface Window {
        chroma: typeof chroma;
    }
}

const generateRandomButton = document.getElementById('generate-random') as HTMLButtonElement;
const colorDisplay = document.getElementById('color-display') as HTMLDivElement;
const colorPicker = document.getElementById('color-picker') as HTMLInputElement;
const darkenButton = document.getElementById('darken') as HTMLButtonElement;
const brightenButton = document.getElementById('brighten') as HTMLButtonElement;
const saturateButton = document.getElementById('saturate') as HTMLButtonElement;
const desaturateButton = document.getElementById('desaturate') as HTMLButtonElement;
const increaseLuminanceButton = document.getElementById('increase-luminance') as HTMLButtonElement;
const decreaseLuminanceButton = document.getElementById('decrease-luminance') as HTMLButtonElement;
const nameInput = document.getElementById('name') as HTMLInputElement;
const hexInput = document.getElementById('hex') as HTMLInputElement;
const decimalInput = document.getElementById('decimal') as HTMLInputElement;
const rgbInput = document.getElementById('rgb') as HTMLInputElement;
const hslInput = document.getElementById('hsl') as HTMLInputElement;
const cmykInput = document.getElementById('cmyk') as HTMLInputElement;
const alphaInput = document.getElementById('alpha') as HTMLInputElement;
const copyNameButton = document.getElementById('copy-name') as HTMLButtonElement;
const copyHexButton = document.getElementById('copy-hex') as HTMLButtonElement;
const copyDecimalButton = document.getElementById('copy-decimal') as HTMLButtonElement;
const copyRgbButton = document.getElementById('copy-rgb') as HTMLButtonElement;
const copyHslButton = document.getElementById('copy-hsl') as HTMLButtonElement;
const copyCmykButton = document.getElementById('copy-cmyk') as HTMLButtonElement;
const copyAlphaButton = document.getElementById('copy-alpha') as HTMLButtonElement;
const luminanceOutput = document.getElementById('luminance') as HTMLInputElement;
const temperatureOutput = document.getElementById('temperature') as HTMLInputElement;
const colorHistory = document.getElementById('color-history') as HTMLUListElement;
const fullColor = document.getElementById('full-color') as HTMLDivElement;

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
    if (window.chroma.valid('#' + parseInt(decimalInput.value).toString(16).padStart(6, '0'))) {
        resetBorder(decimalInput);
        updateResults(window.chroma('#' + parseInt(decimalInput.value).toString(16).padStart(6, '0')));
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

cmykInput.addEventListener('blur', () => {
    const cmyk = cmykInput.value.startsWith('cmyk(') ? cmykInput.value.replace(/cmyk\(| |%|\)/gi, '').split(',') : '';
    const cmyka = cmykInput.value.startsWith('cmyka(') ? cmykInput.value.replace(/cmyka\(| |%|\)/gi, '').split(',') : '';
    if (cmyk.length === 4 && window.chroma.valid(cmyk[0], cmyk[1], cmyk[2], cmyk[3], 'cmyk')) {
        resetBorder(cmykInput);
        updateResults(window.chroma(cmyk[0], cmyk[1], cmyk[2], cmyk[3], 'cmyk'));
    } else if (cmyka.length === 5 && window.chroma.valid(cmyka[0], cmyka[1], cmyka[2], cmyka[3], cmyka[4], 'cmyk')) {
        resetBorder(cmykInput);
        updateResults(window.chroma(cmyka[0], cmyka[1], cmyka[2], cmyka[3], cmyka[4], 'cmyk'));
    } else setRedBorder(cmykInput);
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

copyCmykButton.addEventListener('click', () => copyValue(copyCmykButton, cmykInput));

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
    [colorPicker, nameInput, hexInput, decimalInput, rgbInput, hslInput, cmykInput, alphaInput].forEach((element) => resetBorder(element));

    colorDisplay.style.color = color.hex();
    colorPicker.value = color.alpha(1).hex();
    nameInput.value = !color.name().startsWith('#') ? color.name() : '';
    hexInput.value = color.hex();
    decimalInput.value = parseInt(color.hex().replace(/^#/, ''), 16).toString(10);
    rgbInput.value = color.css();
    hslInput.value = color.css('hsl');
    cmykInput.value = `cmyk${color.alpha() < 1 ? 'a' : ''}(${Math.round(color.get('cmyk.c') * 100) / 100}%,${Math.round(color.get('cmyk.m') * 100) / 100}%,${Math.round(color.get('cmyk.y') * 100) / 100}%,${Math.round(color.get('cmyk.k') * 100) / 100}%${color.alpha() < 1 ? `,${color.alpha()}` : ''})`;
    alphaInput.value = color.alpha().toString();
    luminanceOutput.value = color.luminance().toLocaleString();
    temperatureOutput.value = color.temperature().toString();

    const colorHistoryElement = document.createElement('li');
    colorHistoryElement.style.color = color.hex();
    colorHistoryElement.textContent = color.hex();

    const appendedElement = colorHistory.appendChild(colorHistoryElement);

    appendedElement.addEventListener('click', () => updateResults(color));

    fullColor.style.backgroundColor = colorDisplay.style.color;
}

/**
 * Generates a random color and updates the results.
 */
function generateRandomColor() {
    const letters = '0123456789abcdef';
    let randomColor = '#';
    for (let i = 0; i < 6; i++) randomColor += letters[Math.floor(Math.random() * 16)];

    updateResults(window.chroma(randomColor));
}

generateRandomColor();

/**
 * Adds a red border to an element.
 * @param element The element to update.
 */
function setRedBorder(element: HTMLInputElement) {
    if (element.value?.length > 0) element.style.border = '1px solid #ff5555';
}

/**
 * Resets an element's border.
 * @param element The element to update.
 */
function resetBorder(element: HTMLInputElement) {
    element.style.border = '';
}
