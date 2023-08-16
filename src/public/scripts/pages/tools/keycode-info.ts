import { showAlert } from '../../functions.js';

const ready = document.querySelector('#ready') as HTMLDivElement;
const keyResults = document.querySelector('#key-results') as HTMLTableRowElement;
const key = document.querySelector('#key') as HTMLDivElement;
const keyCell = document.querySelector('#key-cell') as HTMLTableCellElement;
const keyRepeating = document.querySelector('#key-repeating') as HTMLDivElement;
const keyRepeatingCell = document.querySelector('#key-repeating-cell') as HTMLTableCellElement;
const keyLocation = document.querySelector('#key-location') as HTMLDivElement;
const keyLocationCell = document.querySelector('#key-location-cell') as HTMLTableCellElement;
const keyCode = document.querySelector('#key-code') as HTMLDivElement;
const keyCodeCell = document.querySelector('#key-code-cell') as HTMLTableCellElement;
const keyAscii = document.querySelector('#key-ascii') as HTMLDivElement;
const keyAsciiCell = document.querySelector('#key-ascii-cell') as HTMLTableCellElement;
const keyUnicode = document.querySelector('#key-unicode') as HTMLDivElement;
const keyUnicodeCell = document.querySelector('#key-unicode-cell') as HTMLTableCellElement;

let keyValue: string, keyRepeatingValue: string, keyLocationValue: string, keyCodeValue: string, keyAsciiValue: string, keyUnicodeValue: string;

let valuesExist = false;

/* Add event listeners */
document.addEventListener('keydown', keyInfo);
keyCell.addEventListener('click', () => copyKeycodeInfo(keyValue));
keyRepeatingCell.addEventListener('click', () => copyKeycodeInfo(keyRepeatingValue));
keyLocationCell.addEventListener('click', () => copyKeycodeInfo(keyLocationValue));
keyCodeCell.addEventListener('click', () => copyKeycodeInfo(keyCodeValue));
keyAsciiCell.addEventListener('click', () => copyKeycodeInfo(keyAsciiValue));
keyUnicodeCell.addEventListener('click', () => copyKeycodeInfo(keyUnicodeValue));
window.addEventListener('focus', () => {
    ready.innerHTML = '<span style="color:#009c3f"><i class="fa-solid fa-check"></i> Ready to get key information!</span>';
});
window.addEventListener('blur', () => {
    ready.innerHTML = '<span style="color:#FF5555"><i class="fa-solid fa-exclamation-triangle"></i> Focus the tab in order for keys to be identified!</span>';
});

/**
 * If a key has been pressed, copies the provided string.
 * @param string The text to copy.
 */
function copyKeycodeInfo(string: string) {
    if (valuesExist) {
        navigator.clipboard.writeText(string);
        showAlert('Copied!', 'success');
    }
}

/**
 * Updates information for the key that is pressed.
 * @param event The event.
 */
function keyInfo(event: KeyboardEvent) {
    valuesExist = true;
    keyResults.className = 'keycodes-td-ready';
    key.textContent = event.key;
    keyValue = event.key;
    if (event.key === ' ') key.textContent = 'Space ( )';
    else if (event.key === '\u00A0') key.innerHTML = '<span class="tooltip-bottom" data-tooltip="Non breaking space">NBSP</span> (\u00A0)';
    keyRepeating.textContent = event.repeat.toString();
    keyRepeatingValue = event.repeat.toString();
    keyLocation.textContent = event.location.toString();
    keyLocationValue = event.location.toString();
    switch (event.location) {
        case 0: {
            keyLocation.innerHTML = '0<br />(general)';
            break;
        }
        case 1: {
            keyLocation.innerHTML = '1<br />(left)';
            break;
        }
        case 2: {
            keyLocation.innerHTML = '2<br />(right)';
            break;
        }
        case 3: {
            keyLocation.innerHTML = '3<br />(numpad)';
        }
    }
    keyCode.textContent = event.code;
    keyCodeValue = event.code;
    keyAscii.textContent = event.which.toString();
    keyAsciiValue = event.which.toString();
    keyUnicode.textContent = String(event.key).codePointAt(0)!.toString();
    keyUnicodeValue = String(event.key).codePointAt(0)!.toString();
}
