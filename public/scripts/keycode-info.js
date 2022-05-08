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
keyCell.addEventListener('click', () => {
    copyKeycodeInfo(keyVal);
});
keyRepeatingCell.addEventListener('click', () => {
    copyKeycodeInfo(keyRepeatingVal);
});
keyLocationCell.addEventListener('click', () => {
    copyKeycodeInfo(keyLocationVal);
});
keyCodeCell.addEventListener('click', () => {
    copyKeycodeInfo(keyCodeVal);
});
keyAsciiCell.addEventListener('click', () => {
    copyKeycodeInfo(keyAsciiVal);
});
keyUnicodeCell.addEventListener('click', () => {
    copyKeycodeInfo(keyUnicodeVal);
});
window.addEventListener('focus', () => {
    ready.innerHTML = '<span style="color:#009c3f"><i class="fa-solid fa-check"></i> Ready to get key information!</span>';
});
window.addEventListener('blur', () => {
    ready.innerHTML = '<span style="color:#FF5555"><i class="fa-solid fa-exclamation-triangle"></i> Focus the tab in order for keys to be identified!</span>';
});

function copyKeycodeInfo(variable) {
    if (valExist) {
        navigator.clipboard.writeText(variable);
        showAlert('Copied!', 'success');
    }
}

function keyInfo(event) {
    valExist = true;
    document.getElementById('key-results').className = 'keycodes-td-ready';
    key.innerHTML = event.key;
    keyVal = event.key;
    if (event.key === ' ') key.innerHTML = 'Space ( )';
    else if (event.key === '\u00a0') key.innerHTML = '<span class="tooltip-bottom" data-tooltip="Non breaking space">NBSP</span> (\u00a0)';
    keyRepeating.innerHTML = event.repeat;
    keyRepeatingVal = event.repeat;
    keyLocation.innerHTML = event.location;
    keyLocationVal = event.location;
    if (event.location === 0) keyLocation.innerHTML = '0<br />(general)';
    else if (event.location === 1) keyLocation.innerHTML = '1<br />(left)';
    else if (event.location === 2) keyLocation.innerHTML = '2<br />(right)';
    else if (event.location === 3) keyLocation.innerHTML = '3<br />(numpad)';
    keyCode.innerHTML = event.code;
    keyCodeVal = event.code;
    keyAscii.innerHTML = event.which;
    keyAsciiVal = event.which;
    keyUnicode.innerHTML = String(event.key).charCodeAt(0);
    keyUnicodeVal = String(event.key).charCodeAt(0);
}
