/* global PermissionState */

import { copyText, showAlert } from '/scripts/functions.js';

const clearClipboardButton = document.getElementById('clear-clipboard');
const copyZWS = document.getElementById('copy-zws');
const copyNBSP = document.getElementById('copy-nbsp');
const copyEMS = document.getElementById('copy-ems');
const copyENS = document.getElementById('copy-ens');
const copyTS = document.getElementById('copy-ts');
const clipboardWarning = document.getElementById('clipboard-warning');
const copiedText = document.getElementById('copied-text');
const selectClipboard = document.getElementById('select-clipboard');

/* Add event listeners */
clearClipboardButton.addEventListener('click', clearClipboard);
copyZWS.addEventListener('click', () => {
    copyText(copyZWS, '\u200b');
    clipboardDisplay();
});
copyNBSP.addEventListener('click', () => {
    copyText(copyNBSP, '\u00a0');
    clipboardDisplay();
});
copyEMS.addEventListener('click', () => {
    copyText(copyEMS, '\u2003');
    clipboardDisplay();
});
copyENS.addEventListener('click', () => {
    copyText(copyENS, '\u2002');
    clipboardDisplay();
});
copyTS.addEventListener('click', () => {
    copyText(copyTS, '\u2009');
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

/**
 * Displays the given message if that wasn't already displayed
 * @param {string} message the message to display
 */
function showWarning(message) {
    if (clipboardWarning.innerHTML.replace(/<br>/g, '<br />') !== message) clipboardWarning.innerHTML = message;
}

/**
 * Clears the clipboard
 */
function clearClipboard() {
    navigator.clipboard.writeText('');

    clearClipboardButton.disabled = true;
    clearClipboardButton.innerHTML = 'Cleared!';
    showAlert('Cleared!', 'success');
    clipboardDisplay();

    setTimeout(() => {
        clearClipboardButton.disabled = false;
        clearClipboardButton.innerHTML = 'Clear Clipboard';
    }, 2000);
}

/**
 * Requests permission to read the clipboard (`clipboard-read`)
 */
async function requestPermission() {
    try {
        const result = await navigator.permissions.query({ name: 'clipboard-read' });

        handlePermission(result.state);

        result.addEventListener('change', () => {
            handlePermission(result.state);
        });
    } catch (error) {
        showWarning('<i class="fa-solid fa-exclamation-triangle"></i> Your browser does not support the <code>clipboard-read</code> <a href="https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API#browser_compatibility" target="_blank">permission</a><br />');
    }
}

requestPermission();

let interval;

/**
 * Handles the state of the `clipboard-read` permission request
 * @param {PermissionState} state the state to handle
 */
function handlePermission(state) {
    if (state === 'granted' || state === 'prompt') {
        clearInterval(interval);
        clipboardDisplay();
        if (clipboardReadAllowed === false) interval = setInterval(clipboardDisplay, 500);
        clipboardReadAllowed = true;
    } else {
        clearInterval(interval);
        clipboardReadAllowed = false;
        showWarning('<i class="fa-solid fa-exclamation-triangle"></i> Permission to read clipboard denied!<br />');
    }
}

let storedData;

/**
 * Displays the current clipboard
 * @returns {Promise<void>}
 */
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
