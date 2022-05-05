let clearClipboardButton = document.getElementById('clear-clipboard');
let copyZws = document.getElementById('copy-zws');
let copyNbsp = document.getElementById('copy-nbsp');
let copyEms = document.getElementById('copy-ems');
let copyEns = document.getElementById('copy-ens');
let copyTs = document.getElementById('copy-ts');
let clipboardWarning = document.getElementById('clipboard-warning');
let copiedText = document.getElementById('copied-text');
let selectClipboard = document.getElementById('select-clipboard');

/* Add event listeners */
clearClipboardButton.addEventListener('click', clearClipboard);
copyZws.addEventListener('click', function () {
    copyText('copy-zws', '\u200b');
    clipboardDisplay();
});
copyNbsp.addEventListener('click', function () {
    copyText('copy-nbsp', '\u00a0');
    clipboardDisplay();
});
copyEms.addEventListener('click', function () {
    copyText('copy-ems', '\u2003');
    clipboardDisplay();
});
copyEns.addEventListener('click', function () {
    copyText('copy-ens', '\u2002');
    clipboardDisplay();
});
copyTs.addEventListener('click', function () {
    copyText('copy-ts', '\u2009');
    clipboardDisplay();
});
selectClipboard.addEventListener('click', function () {
    copiedText.select();
});
window.onfocus = onFocus;
window.onblur = onBlur;

let clipboardReadAllowed = false; // defaults to false, changed if needed on first request

function showWarning(message) {
    if (clipboardWarning.innerHTML !== message) {
        clipboardWarning.innerHTML = message;
    }
}

function onFocus() {
    if (clipboardReadAllowed) {
        clipboardDisplay();
    }
}

function onBlur() {
    if (clipboardReadAllowed) {
        showWarning('<i class="fa-solid fa-exclamation-triangle"></i> Tab not focused, unable to read clipboard!<br />');
    }
}

let clipboardTimeout, url;

function clearClipboard() {
    clearTimeout(clipboardTimeout);
    clearClipboardButton.innerHTML = 'Cleared!';
    clipboardTimeout = setTimeout(function () {
        clearClipboardButton.innerHTML = 'Clear Clipboard';
    }, 2000);
    navigator.clipboard.writeText('');
    url = undefined;
    showAlert('Cleared!', 'success');
    clipboardDisplay();
}

function requestPermission() {
    try {
        navigator.permissions.query({ name: 'clipboard-read' }).then(function (result) {
            handlePermission(result.state);
            result.onchange = function () {
                console.log(`Clipboard permission changed to "${result.state}", running handlePermission`);
                handlePermission(result.state);
            };
        });
    } catch (error) {
        showWarning('<i class="fa-solid fa-exclamation-triangle"></i> Your browser does not support the <code>clipboard-read</code> <a href="https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API#browser_compatibility" target="_blank">permission</a><br />');
    }
}

requestPermission();

let interval;
function handlePermission(state) {
    if (state === 'granted' || state === 'prompt') {
        clearInterval(interval);
        clipboardDisplay();
        if (clipboardReadAllowed === false) interval = setInterval(clipboardDisplay, 500);
        clipboardReadAllowed = true;
    } else if (state === 'denied') {
        clearInterval(interval);
        clipboardReadAllowed = false;
        showWarning('<i class="fa-solid fa-exclamation-triangle"></i> Permission to read clipboard denied!<br />');
    }
}

clipboardDisplay();

async function clipboardDisplay() {
    navigator.clipboard
        .read()
        .then((data) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].types.includes('text/plain')) {
                    data[i].getType('text/plain').then((blob) => {
                        const reader = new FileReader();
                        reader.onload = function () {
                            let text = reader.result;
                            if (text.length === 0) {
                                copiedText.value = '';
                                selectClipboard.disabled = true;
                            } else {
                                copiedText.value = text;
                                showWarning('');
                                selectClipboard.disabled = false;
                            }
                        };
                        reader.readAsText(blob);
                    });
                } else if (data[i].types.includes('image/png')) {
                    data[i].getType('image/png').then((blob) => {
                        url = URL.createObjectURL(blob);
                        copiedText.value = '';
                        selectClipboard.disabled = true;
                        showWarning(`<span style="color:#4b5663"><i class="far fa-image"></i> Clipboard has image! (<a href='${url}' target="_blank">view</a>)<br /></span>`);
                    });
                } else {
                    console.log('Clipboard does not contain valid data (determined via if/else)');
                }
            }
        })
        .catch((err) => {
            if (err.toString().match(/focused/g)) showWarning('<i class="fa-solid fa-exclamation-triangle"></i> Tab not focused, unable to read clipboard!<br />');
            navigator.clipboard
                .readText()
                .then((text) => {
                    if (text.length === 0) {
                        copiedText.value = '';
                        selectClipboard.disabled = true;
                        showWarning('<span style="color:#009c3f"><i class="far fa-clipboard"></i> Your clipboard is empty!<br /></span>');
                    } else {
                        copiedText.value = text;
                        showWarning('');
                        selectClipboard.disabled = false;
                    }
                })
                .catch((err) => {
                    if (err.toString().match(/focused/g)) showWarning('<i class="fa-solid fa-exclamation-triangle"></i> Tab not focused, unable to read clipboard!<br />');
                });
        });
}
