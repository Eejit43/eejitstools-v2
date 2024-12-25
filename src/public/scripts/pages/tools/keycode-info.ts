import { showAlert } from '../../functions.js';

const ready = document.querySelector<HTMLDivElement>('#ready')!;
const keyResults = document.querySelector<HTMLTableRowElement>('#key-results')!;
const key = document.querySelector<HTMLDivElement>('#key')!;
const keyCell = document.querySelector<HTMLTableCellElement>('#key-cell')!;
const keyRepeating = document.querySelector<HTMLDivElement>('#key-repeating')!;
const keyRepeatingCell = document.querySelector<HTMLTableCellElement>('#key-repeating-cell')!;
const keyLocation = document.querySelector<HTMLDivElement>('#key-location')!;
const keyLocationCell = document.querySelector<HTMLTableCellElement>('#key-location-cell')!;
const keyCode = document.querySelector<HTMLDivElement>('#key-code')!;
const keyCodeCell = document.querySelector<HTMLTableCellElement>('#key-code-cell')!;
const keyAscii = document.querySelector<HTMLDivElement>('#key-ascii')!;
const keyAsciiCell = document.querySelector<HTMLTableCellElement>('#key-ascii-cell')!;
const keyUnicode = document.querySelector<HTMLDivElement>('#key-unicode')!;
const keyUnicodeCell = document.querySelector<HTMLTableCellElement>('#key-unicode-cell')!;

let keyValue: string,
    keyRepeatingValue: string,
    keyLocationValue: string,
    keyCodeValue: string,
    keyAsciiValue: string,
    keyUnicodeValue: string;

let valuesExist = false;

/* Add event listeners */
document.addEventListener('keydown', keyInfo);
keyCell.addEventListener('click', () => {
    copyKeycodeInfo(keyValue);
});
keyRepeatingCell.addEventListener('click', () => {
    copyKeycodeInfo(keyRepeatingValue);
});
keyLocationCell.addEventListener('click', () => {
    copyKeycodeInfo(keyLocationValue);
});
keyCodeCell.addEventListener('click', () => {
    copyKeycodeInfo(keyCodeValue);
});
keyAsciiCell.addEventListener('click', () => {
    copyKeycodeInfo(keyAsciiValue);
});
keyUnicodeCell.addEventListener('click', () => {
    copyKeycodeInfo(keyUnicodeValue);
});
window.addEventListener('focus', () => {
    ready.innerHTML = '<span class="success"><i class="fa-solid fa-check"></i> Ready to get key information!</span>';
});
window.addEventListener('blur', () => {
    ready.innerHTML =
        '<span class="error"><i class="fa-solid fa-exclamation-triangle"></i> Focus the tab in order for keys to be identified!</span>';
});

/**
 * If a key has been pressed, copies the provided string.
 * @param string The text to copy.
 */
function copyKeycodeInfo(string: string) {
    if (valuesExist) {
        void navigator.clipboard.writeText(string);
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
    else if (event.key === '\u00A0') key.innerHTML = '<span data-tooltip="Non breaking space">NBSP</span> (\u00A0)';
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
    keyAscii.textContent = event.which.toString(); // eslint-disable-line @typescript-eslint/no-deprecated
    keyAsciiValue = event.which.toString(); // eslint-disable-line @typescript-eslint/no-deprecated
    keyUnicode.textContent = String(event.key).codePointAt(0)!.toString();
    keyUnicodeValue = String(event.key).codePointAt(0)!.toString();
}
