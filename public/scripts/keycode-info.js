let ready = document.getElementById('ready');
let key = document.getElementById('key');
let keyCell = document.getElementById('key-cell');
let keyRepeating = document.getElementById('key-repeating');
let keyRepeatingCell = document.getElementById('key-repeating-cell');
let keyLocation = document.getElementById('key-location');
let keyLocationCell = document.getElementById('key-location-cell');
let keyCode = document.getElementById('key-code');
let keyCodeCell = document.getElementById('key-code-cell');
let keyAscii = document.getElementById('key-ascii');
let keyAsciiCell = document.getElementById('key-ascii-cell');
let keyUnicode = document.getElementById('key-unicode');
let keyUnicodeCell = document.getElementById('key-unicode-cell');

let keyVal, keyRepeatingVal, keyLocationVal, KeyCodeVal, KeyAsciiVal, KeyUnicodeVal;

let valExist = 0; // 0 = no, 1 = yes

/* Add event listeners */
document.addEventListener('keydown', keyInfo);
keyCell.addEventListener('click', function () {
    copyKeycodeInfo(keyVal);
});
keyRepeatingCell.addEventListener('click', function () {
    copyKeycodeInfo(keyRepeatingVal);
});
keyLocationCell.addEventListener('click', function () {
    copyKeycodeInfo(keyLocationVal);
});
keyCodeCell.addEventListener('click', function () {
    copyKeycodeInfo(keyCodeVal);
});
keyAsciiCell.addEventListener('click', function () {
    copyKeycodeInfo(keyAsciiVal);
});
keyUnicodeCell.addEventListener('click', function () {
    copyKeycodeInfo(keyUnicodeVal);
});
window.onfocus = onFocus;
window.onblur = onBlur;

function copyKeycodeInfo(variable) {
    if (valExist === 1) {
        navigator.clipboard.writeText(variable);
        showAlert('Copied!', 'success');
    }
}

function onBlur() {
    ready.innerHTML = '<span style="color:#FF5555"><i class="fa-solid fa-exclamation-triangle"></i> Focus the tab in order for keys to be identified!</span>';
}

function onFocus() {
    ready.innerHTML = '<span style="color:#009c3f"><i class="fa-solid fa-check"></i> Ready to get key information!</span>';
}

function keyInfo(event) {
    valExist = 1;
    document.getElementById('key-results').className = 'keycodes-td-ready';
    key.innerHTML = event.key;
    keyVal = event.key;
    if (String(event.key) === ' ') {
        key.innerHTML = 'Space ( )';
    }
    if (String(event.key) === '\u00a0') {
        key.innerHTML = '<span class="tooltip-bottom" data-tooltip="Non breaking space">NBSP</span> (\u00a0)';
    }
    keyRepeating.innerHTML = event.repeat;
    keyRepeatingVal = event.repeat;
    keyLocation.innerHTML = event.location;
    keyLocationVal = event.location;
    if (String(event.location) === '0') {
        keyLocation.innerHTML = '0<br />(general)';
    }
    if (String(event.location) === '1') {
        keyLocation.innerHTML = '1<br />(left)';
    }
    if (String(event.location) === '2') {
        keyLocation.innerHTML = '2<br />(right)';
    }
    if (String(event.location) === '3') {
        keyLocation.innerHTML = '3<br />(numpad)';
    }
    keyCode.innerHTML = event.code;
    keyCodeVal = event.code;
    keyAscii.innerHTML = event.which;
    keyAsciiVal = event.which;
    keyUnicode.innerHTML = String(event.key).charCodeAt(0);
    keyUnicodeVal = String(event.key).charCodeAt(0);
}
