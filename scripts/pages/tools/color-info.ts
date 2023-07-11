import type chroma from 'chroma-js';
import type { Color } from 'chroma-js';
import { copyValue, showAlert } from '../../functions.js';

declare global {
    interface Window {
        chroma: typeof chroma;
    }
}

const generateRandom = document.getElementById('generate-random') as HTMLButtonElement;
const colorDisplay = document.getElementById('color-display') as HTMLDivElement;
const colorPicker = document.getElementById('color-picker') as HTMLInputElement;
const darken = document.getElementById('darken') as HTMLButtonElement;
const brighten = document.getElementById('brighten') as HTMLButtonElement;
const saturate = document.getElementById('saturate') as HTMLButtonElement;
const desaturate = document.getElementById('desaturate') as HTMLButtonElement;
const increaseLuminance = document.getElementById('increase-luminance') as HTMLButtonElement;
const decreaseLuminance = document.getElementById('decrease-luminance') as HTMLButtonElement;
const nameValue = document.getElementById('name') as HTMLInputElement;
const hexValue = document.getElementById('hex') as HTMLInputElement;
const decimalValue = document.getElementById('decimal') as HTMLInputElement;
const rgbValue = document.getElementById('rgb') as HTMLInputElement;
const hslValue = document.getElementById('hsl') as HTMLInputElement;
const cmykValue = document.getElementById('cmyk') as HTMLInputElement;
const alphaValue = document.getElementById('alpha') as HTMLInputElement;
const copyName = document.getElementById('copy-name') as HTMLButtonElement;
const copyHex = document.getElementById('copy-hex') as HTMLButtonElement;
const copyDecimal = document.getElementById('copy-decimal') as HTMLButtonElement;
const copyRgb = document.getElementById('copy-rgb') as HTMLButtonElement;
const copyHsl = document.getElementById('copy-hsl') as HTMLButtonElement;
const copyCmyk = document.getElementById('copy-cmyk') as HTMLButtonElement;
const copyAlpha = document.getElementById('copy-alpha') as HTMLButtonElement;
const luminance = document.getElementById('luminance') as HTMLInputElement;
const temperature = document.getElementById('temperature') as HTMLInputElement;
const colorHistory = document.getElementById('color-history') as HTMLUListElement;
const fullColor = document.getElementById('full-color') as HTMLDivElement;

generateRandom.addEventListener('click', generateRandomColor);

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

darken.addEventListener('click', () => updateResults(window.chroma(hexValue.value).darken(0.5)));

brighten.addEventListener('click', () => updateResults(window.chroma(hexValue.value).brighten(0.5)));

saturate.addEventListener('click', () => updateResults(window.chroma(hexValue.value).saturate(0.5)));

desaturate.addEventListener('click', () => updateResults(window.chroma(hexValue.value).desaturate(0.5)));

increaseLuminance.addEventListener('click', () => updateResults(window.chroma(hexValue.value).luminance(window.chroma(hexValue.value).luminance() * 1.5)));

decreaseLuminance.addEventListener('click', () => updateResults(window.chroma(hexValue.value).luminance(window.chroma(hexValue.value).luminance() * 0.5)));

nameValue.addEventListener('blur', () => {
    if (window.chroma.valid(nameValue.value)) {
        resetBorder(nameValue);
        updateResults(window.chroma(nameValue.value));
    } else setRedBorder(nameValue);
});

hexValue.addEventListener('blur', () => {
    if (window.chroma.valid(hexValue.value)) {
        resetBorder(hexValue);
        updateResults(window.chroma(hexValue.value));
    } else setRedBorder(hexValue);
});

decimalValue.addEventListener('blur', () => {
    if (window.chroma.valid('#' + parseInt(decimalValue.value).toString(16).padStart(6, '0'))) {
        resetBorder(decimalValue);
        updateResults(window.chroma('#' + parseInt(decimalValue.value).toString(16).padStart(6, '0')));
    } else setRedBorder(decimalValue);
});

rgbValue.addEventListener('blur', () => {
    if (window.chroma.valid(rgbValue.value)) {
        resetBorder(rgbValue);
        updateResults(window.chroma(rgbValue.value));
    } else setRedBorder(rgbValue);
});

hslValue.addEventListener('blur', () => {
    if (window.chroma.valid(hslValue.value)) {
        resetBorder(hslValue);
        updateResults(window.chroma(hslValue.value));
    } else setRedBorder(hslValue);
});

cmykValue.addEventListener('blur', () => {
    const cmyk = /^cmyk\(/.test(cmykValue.value) ? cmykValue.value.replace(/cmyk\(| |%|\)/gi, '').split(',') : '';
    const cmyka = /^cmyka\(/.test(cmykValue.value) ? cmykValue.value.replace(/cmyka\(| |%|\)/gi, '').split(',') : '';
    if (cmyk.length === 4 && window.chroma.valid(cmyk[0], cmyk[1], cmyk[2], cmyk[3], 'cmyk')) {
        resetBorder(cmykValue);
        updateResults(window.chroma(cmyk[0], cmyk[1], cmyk[2], cmyk[3], 'cmyk'));
    } else if (cmyka.length === 5 && window.chroma.valid(cmyka[0], cmyka[1], cmyka[2], cmyka[3], cmyka[4], 'cmyk')) {
        resetBorder(cmykValue);
        updateResults(window.chroma(cmyka[0], cmyka[1], cmyka[2], cmyka[3], cmyka[4], 'cmyk'));
    } else setRedBorder(cmykValue);
});

alphaValue.addEventListener('blur', () => {
    if (alphaValue.value.length > 0 && Number(alphaValue.value) >= 0 && Number(alphaValue.value) <= 1) {
        resetBorder(alphaValue);
        updateResults(window.chroma(hexValue.value).alpha(Number(alphaValue.value)));
    } else setRedBorder(alphaValue);
});

copyName.addEventListener('click', () => copyValue(copyName, nameValue));

copyHex.addEventListener('click', () => copyValue(copyHex, hexValue));

copyDecimal.addEventListener('click', () => copyValue(copyDecimal, decimalValue));

copyRgb.addEventListener('click', () => copyValue(copyRgb, rgbValue));

copyHsl.addEventListener('click', () => copyValue(copyHsl, hslValue));

copyCmyk.addEventListener('click', () => copyValue(copyCmyk, cmykValue));

copyAlpha.addEventListener('click', () => copyValue(copyAlpha, alphaValue));

fullColor.addEventListener('click', () => (fullColor.style.display = 'none'));

document.addEventListener('keydown', (event) => {
    if (fullColor.style.display === 'block' && event.code === 'Escape') fullColor.style.display = 'none';
});

/**
 * Updates a color to all values
 * @param {Color} color the color to update results for
 */
function updateResults(color: Color) {
    [colorPicker, nameValue, hexValue, decimalValue, rgbValue, hslValue, cmykValue, alphaValue].forEach((element) => resetBorder(element));

    colorDisplay.style.color = color.hex();
    colorPicker.value = color.alpha(1).hex();
    nameValue.value = !/^#/.test(color.name()) ? color.name() : '';
    hexValue.value = color.hex();
    decimalValue.value = parseInt(color.hex().replace(/^#/, ''), 16).toString(10);
    rgbValue.value = color.css();
    hslValue.value = color.css('hsl');
    cmykValue.value = `cmyk${color.alpha() < 1 ? 'a' : ''}(${Math.round(color.get('cmyk.c') * 100) / 100}%,${Math.round(color.get('cmyk.m') * 100) / 100}%,${Math.round(color.get('cmyk.y') * 100) / 100}%,${Math.round(color.get('cmyk.k') * 100) / 100}%${color.alpha() < 1 ? `,${color.alpha()}` : ''})`;
    alphaValue.value = color.alpha().toString();
    luminance.value = color.luminance().toLocaleString();
    temperature.value = color.temperature().toString();

    const colorHistoryElement = document.createElement('li');
    colorHistoryElement.style.color = color.hex();
    colorHistoryElement.textContent = color.hex();

    const appendedElement = colorHistory.appendChild(colorHistoryElement);

    appendedElement.addEventListener('click', () => updateResults(color));

    fullColor.style.backgroundColor = colorDisplay.style.color;
}

/**
 * Generates a random color and updates the results
 */
function generateRandomColor() {
    const letters = '0123456789abcdef';
    let randomColor = '#';
    for (let i = 0; i < 6; i++) randomColor += letters[Math.floor(Math.random() * 16)];

    updateResults(window.chroma(randomColor));
}

generateRandomColor();

/**
 * Adds a red border to an element
 * @param {HTMLInputElement} element The element to update
 */
function setRedBorder(element: HTMLInputElement) {
    if (element.value?.length > 0) element.style.border = '1px solid #ff5555';
}

/**
 * Resets an element's border
 * @param {HTMLInputElement} element The element to update
 */
function resetBorder(element: HTMLInputElement) {
    element.style.border = '';
}
