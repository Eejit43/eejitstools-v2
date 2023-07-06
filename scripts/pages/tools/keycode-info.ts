import { showAlert } from '../../functions.js';

const ready = document.getElementById('ready');
const key = document.getElementById('key');
const keyCell = document.getElementById('key-cell');
const keyRepeating = document.getElementById('key-repeating');
const keyRepeatingCell = document.getElementById('key-repeating-cell');
const keyLocation = document.getElementById('key-location');
const keyLocationCell = document.getElementById('key-location-cell');
const keyCode = document.getElementById('key-code');
const keyCodeCell = document.getElementById('key-code-cell');
const keyAscii = document.getElementById('key-ascii');
const keyAsciiCell = document.getElementById('key-ascii-cell');
const keyUnicode = document.getElementById('key-unicode');
const keyUnicodeCell = document.getElementById('key-unicode-cell');

let keyVal, keyRepeatingVal, keyLocationVal, keyCodeVal, keyAsciiVal, keyUnicodeVal;

let valExist = false;

/* Add event listeners */
document.addEventListener('keydown', keyInfo);
keyCell.addEventListener('click', () => copyKeycodeInfo(keyVal));
keyRepeatingCell.addEventListener('click', () => copyKeycodeInfo(keyRepeatingVal));
keyLocationCell.addEventListener('click', () => copyKeycodeInfo(keyLocationVal));
keyCodeCell.addEventListener('click', () => copyKeycodeInfo(keyCodeVal));
keyAsciiCell.addEventListener('click', () => copyKeycodeInfo(keyAsciiVal));
keyUnicodeCell.addEventListener('click', () => copyKeycodeInfo(keyUnicodeVal));
window.addEventListener('focus', () => {
    ready.innerHTML = '<span style="color:#009c3f"><i class="fa-solid fa-check"></i> Ready to get key information!</span>';
});
window.addEventListener('blur', () => {
    ready.innerHTML = '<span style="color:#FF5555"><i class="fa-solid fa-exclamation-triangle"></i> Focus the tab in order for keys to be identified!</span>';
});

/**
 * If a key has been pressed, copies the provided string
 * @param {string} string the text to copy
 */
function copyKeycodeInfo(string) {
    if (valExist) {
        navigator.clipboard.writeText(string);
        showAlert('Copied!', 'success');
    }
}

/**
 * Updates information for the key that is pressed
 * @param {KeyboardEvent} event the event
 */
function keyInfo(event) {
    valExist = true;
    document.getElementById('key-results').className = 'keycodes-td-ready';
    key.textContent = event.key;
    keyVal = event.key;
    if (event.key === ' ') key.textContent = 'Space ( )';
    else if (event.key === '\u00a0') key.innerHTML = '<span class="tooltip-bottom" data-tooltip="Non breaking space">NBSP</span> (\u00a0)';
    keyRepeating.textContent = event.repeat;
    keyRepeatingVal = event.repeat;
    keyLocation.textContent = event.location;
    keyLocationVal = event.location;
    if (event.location === 0) keyLocation.innerHTML = '0<br />(general)';
    else if (event.location === 1) keyLocation.innerHTML = '1<br />(left)';
    else if (event.location === 2) keyLocation.innerHTML = '2<br />(right)';
    else if (event.location === 3) keyLocation.innerHTML = '3<br />(numpad)';
    keyCode.textContent = event.code;
    keyCodeVal = event.code;
    keyAscii.textContent = event.which;
    keyAsciiVal = event.which;
    keyUnicode.textContent = String(event.key).charCodeAt(0);
    keyUnicodeVal = String(event.key).charCodeAt(0);
}
