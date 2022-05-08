const clearClipboardButton = document.getElementById('clear-clipboard');
const copyZws = document.getElementById('copy-zws');
const copyNbsp = document.getElementById('copy-nbsp');
const copyEms = document.getElementById('copy-ems');
const copyEns = document.getElementById('copy-ens');
const copyTs = document.getElementById('copy-ts');
const clipboardWarning = document.getElementById('clipboard-warning');
const copiedText = document.getElementById('copied-text');
const selectClipboard = document.getElementById('select-clipboard');

/* Add event listeners */
clearClipboardButton.addEventListener('click', clearClipboard);
copyZws.addEventListener('click', () => {
    copyText('copy-zws', '\u200b');
    clipboardDisplay();
});
copyNbsp.addEventListener('click', () => {
    copyText('copy-nbsp', '\u00a0');
    clipboardDisplay();
});
copyEms.addEventListener('click', () => {
    copyText('copy-ems', '\u2003');
    clipboardDisplay();
});
copyEns.addEventListener('click', () => {
    copyText('copy-ens', '\u2002');
    clipboardDisplay();
});
copyTs.addEventListener('click', () => {
    copyText('copy-ts', '\u2009');
    clipboardDisplay();
});
selectClipboard.addEventListener('click', () => {
    copiedText.select();
});
window.addEventListener('focus', () => {
    if (clipboardReadAllowed) clipboardDisplay();
});
window.addEventListener('blur', () => {
    if (clipboardReadAllowed) showWarning('<i class="fa-solid fa-exclamation-triangle"></i> Tab not focused, unable to read clipboard!<br />');
});

let clipboardReadAllowed = false;

function showWarning(message) {
    if (clipboardWarning.innerHTML.replace(/<br>/g, '<br />') !== message) clipboardWarning.innerHTML = message;
}

let clipboardTimeout, url;
function clearClipboard() {
    clearTimeout(clipboardTimeout);
    clearClipboardButton.innerHTML = 'Cleared!';
    clipboardTimeout = setTimeout(() => {
        clearClipboardButton.innerHTML = 'Clear Clipboard';
    }, 2000);
    navigator.clipboard.writeText('');
    url = undefined;
    showAlert('Cleared!', 'success');
    clipboardDisplay();
}

function requestPermission() {
    try {
        navigator.permissions.query({ name: 'clipboard-read' }).then((result) => {
            handlePermission(result.state);
            result.addEventListener('change', () => {
                console.log(`Clipboard permission changed to "${result.state}", running handlePermission`);
                handlePermission(result.state);
            });
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

let storedData;
async function clipboardDisplay() {
    try {
        const data = await navigator.clipboard.read();

        for (let i = 0; i < data.length; i++) {
            if (data[i].types.includes('text/plain')) {
                const blob = await data[i].getType('text/plain');

                const reader = new FileReader();
                reader.readAsText(blob);

                reader.addEventListener('load', () => {
                    const text = reader.result.toString();
                    if (text.length === 0) {
                        copiedText.value = '';
                        selectClipboard.disabled = true;
                        showWarning('<span style="color:#009c3f"><i class="far fa-clipboard"></i> Your clipboard is empty!<br /></span>');
                    } else {
                        copiedText.value = text;
                        selectClipboard.disabled = false;
                        showWarning('');
                    }
                });
            } else if (data[i].types.includes('image/png')) {
                const blob = await data[i].getType('image/png');

                const url = URL.createObjectURL(blob);
                copiedText.value = '';
                selectClipboard.disabled = true;

                if (storedData !== blob.size || (storedData === blob.size && !/Clipboard has image!/.test(clipboardWarning.innerHTML))) showWarning(`<span style="color:#4b5663"><i class="far fa-image"></i> Clipboard has image! (<a href='${url}' target="_blank">view</a>)<br /></span>`);
                if (storedData !== blob.size) storedData = blob.size;
            }
        }
    } catch (error) {
        if (error.toString().match(/focused/g)) return showWarning('<i class="fa-solid fa-exclamation-triangle"></i> Tab not focused, unable to read clipboard!<br />');

        const text = await navigator.clipboard.readText();

        if (text.length === 0) {
            copiedText.value = '';
            selectClipboard.disabled = true;
            showWarning('<span style="color:#009c3f"><i class="far fa-clipboard"></i> Your clipboard is empty!<br /></span>');
        } else {
            copiedText.value = text;
            selectClipboard.disabled = false;
            showWarning('');
        }
    }
}

clipboardDisplay();
