/* global chroma */

import 'https://cdnjs.cloudflare.com/ajax/libs/chroma-js/2.4.2/chroma.min.js';
import { copyValue } from '/scripts/functions.js';

const generateRandom = document.getElementById('generate-random');
const colorDisplay = document.getElementById('color-display');
const colorPicker = document.getElementById('color-picker');
const darken = document.getElementById('darken');
const brighten = document.getElementById('brighten');
const saturate = document.getElementById('saturate');
const desaturate = document.getElementById('desaturate');
const increaseLuminance = document.getElementById('increase-luminance');
const decreaseLuminance = document.getElementById('decrease-luminance');
const nameValue = document.getElementById('name');
const hexValue = document.getElementById('hex');
const decimalValue = document.getElementById('decimal');
const rgbValue = document.getElementById('rgb');
const hslValue = document.getElementById('hsl');
const cmykValue = document.getElementById('cmyk');
const alphaValue = document.getElementById('alpha');
const copyName = document.getElementById('copy-name');
const copyHex = document.getElementById('copy-hex');
const copyDecimal = document.getElementById('copy-decimal');
const copyRgb = document.getElementById('copy-rgb');
const copyHsl = document.getElementById('copy-hsl');
const copyCmyk = document.getElementById('copy-cmyk');
const copyAlpha = document.getElementById('copy-alpha');
const luminance = document.getElementById('luminance');
const temperature = document.getElementById('temperature');

generateRandom.addEventListener('click', generateRandomColor);

colorPicker.addEventListener('input', () => {
    if (chroma.valid(colorPicker.value)) {
        resetBorder(colorPicker);
        updateResults(chroma(colorPicker.value));
    } else setRedBorder(colorPicker);
});

darken.addEventListener('click', () => {
    updateResults(chroma(hexValue.value).darken(0.5));
});

brighten.addEventListener('click', () => {
    updateResults(chroma(hexValue.value).brighten(0.5));
});

saturate.addEventListener('click', () => {
    updateResults(chroma(hexValue.value).saturate(0.5));
});

desaturate.addEventListener('click', () => {
    updateResults(chroma(hexValue.value).desaturate(0.5));
});

increaseLuminance.addEventListener('click', () => {
    updateResults(chroma(hexValue.value).luminance(chroma(hexValue.value).luminance() * 1.5));
});

decreaseLuminance.addEventListener('click', () => {
    updateResults(chroma(hexValue.value).luminance(chroma(hexValue.value).luminance() * 0.5));
});

nameValue.addEventListener('blur', () => {
    if (chroma.valid(nameValue.value)) {
        resetBorder(nameValue);
        updateResults(chroma(nameValue.value));
    } else setRedBorder(nameValue);
});

hexValue.addEventListener('blur', () => {
    if (chroma.valid(hexValue.value)) {
        resetBorder(hexValue);
        updateResults(chroma(hexValue.value));
    } else setRedBorder(hexValue);
});

decimalValue.addEventListener('blur', () => {
    if (chroma.valid('#' + parseInt(decimalValue.value).toString(16).padStart(6, '0'))) {
        resetBorder(decimalValue);
        updateResults(chroma('#' + parseInt(decimalValue.value).toString(16).padStart(6, '0')));
    } else setRedBorder(decimalValue);
});

rgbValue.addEventListener('blur', () => {
    if (chroma.valid(rgbValue.value)) {
        resetBorder(rgbValue);
        updateResults(chroma(rgbValue.value));
    } else setRedBorder(rgbValue);
});

hslValue.addEventListener('blur', () => {
    if (chroma.valid(hslValue.value)) {
        resetBorder(hslValue);
        updateResults(chroma(hslValue.value));
    } else setRedBorder(hslValue);
});

cmykValue.addEventListener('blur', () => {
    const cmyk = /^cmyk\(/.test(cmykValue.value) ? cmykValue.value.replace(/cmyk\(| |%|\)/gi, '').split(',') : '';
    const cmyka = /^cmyka\(/.test(cmykValue.value) ? cmykValue.value.replace(/cmyka\(| |%|\)/gi, '').split(',') : '';
    if (cmyk.length === 4 && chroma.valid(cmyk[0], cmyk[1], cmyk[2], cmyk[3], 'cmyk')) {
        resetBorder(cmykValue);
        updateResults(chroma(cmyk[0], cmyk[1], cmyk[2], cmyk[3], 'cmyk'));
    } else if (cmyka.length === 5 && chroma.valid(cmyka[0], cmyka[1], cmyka[2], cmyka[3], cmyka[4], 'cmyk')) {
        resetBorder(cmykValue);
        updateResults(chroma(cmyka[0], cmyka[1], cmyka[2], cmyka[3], cmyka[4], 'cmyk'));
    } else setRedBorder(cmykValue);
});

alphaValue.addEventListener('blur', () => {
    if (alphaValue.value.length > 0 && alphaValue.value >= 0 && alphaValue.value <= 1) {
        resetBorder(alphaValue);
        updateResults(chroma(hexValue.value).alpha(Number(alphaValue.value)));
    } else setRedBorder(alphaValue);
});

copyName.addEventListener('click', () => {
    copyValue(copyName, nameValue);
});

copyHex.addEventListener('click', () => {
    copyValue(copyHex, hexValue);
});

copyDecimal.addEventListener('click', () => {
    copyValue(copyDecimal, decimalValue);
});

copyRgb.addEventListener('click', () => {
    copyValue(copyRgb, rgbValue);
});

copyHsl.addEventListener('click', () => {
    copyValue(copyHsl, hslValue);
});

copyCmyk.addEventListener('click', () => {
    copyValue(copyCmyk, cmykValue);
});

copyAlpha.addEventListener('click', () => {
    copyValue(copyAlpha, alphaValue);
});

/**
 * Updates a color to all values
 * @param {Color} color
 */
function updateResults(color) {
    resetBorder(colorPicker);
    resetBorder(nameValue);
    resetBorder(hexValue);
    resetBorder(decimalValue);
    resetBorder(rgbValue);
    resetBorder(hslValue);
    resetBorder(cmykValue);
    resetBorder(alphaValue);

    colorDisplay.style.color = color.hex();
    colorPicker.value = color.alpha(1).hex();
    nameValue.value = !/^#/.test(color.name()) ? color.name() : '';
    hexValue.value = color.hex();
    decimalValue.value = parseInt(color.hex().replace(/^#/, ''), 16).toString(10);
    rgbValue.value = color.css();
    hslValue.value = color.css('hsl');
    cmykValue.value = `cmyk${color.alpha() < 1 ? 'a' : ''}(${Math.round(color.get('cmyk.c') * 100) / 100}%,${Math.round(color.get('cmyk.m') * 100) / 100}%,${Math.round(color.get('cmyk.y') * 100) / 100}%,${Math.round(color.get('cmyk.k') * 100) / 100}%${color.alpha() < 1 ? `,${color.alpha()}` : ''})`;
    alphaValue.value = color.alpha();
    luminance.value = color.luminance().toLocaleString();
    temperature.value = color.temperature();
}

/**
 * Generates a random color and updates the results
 */
function generateRandomColor() {
    const letters = '0123456789abcdef';
    let randomColor = '#';
    for (let i = 0; i < 6; i++) {
        randomColor += letters[Math.floor(Math.random() * 16)];
    }
    updateResults(chroma(randomColor));
}

generateRandomColor();

/**
 * Adds a red border to an element
 * @param {HTMLElement} element The element to update
 */
function setRedBorder(element) {
    if (element.value?.length > 0) element.style.border = '1px solid #ff5555';
}

/**
 * Resets an element's border
 * @param {HTMLElement} element The element to update
 */
function resetBorder(element) {
    element.style.border = '';
}
