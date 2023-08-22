import { copyText, showAlert } from '../../functions.js';

const clearClipboardButton = document.querySelector('#clear-clipboard') as HTMLButtonElement;
const copyZwsButton = document.querySelector('#copy-zws') as HTMLButtonElement;
const copyNbspButton = document.querySelector('#copy-nbsp') as HTMLButtonElement;
const copyEmsButton = document.querySelector('#copy-ems') as HTMLButtonElement;
const copyEnsButton = document.querySelector('#copy-ens') as HTMLButtonElement;
const copyTsButton = document.querySelector('#copy-ts') as HTMLButtonElement;
const clipboardWarning = document.querySelector('#clipboard-warning') as HTMLDivElement;
const copiedText = document.querySelector('#copied-text') as HTMLTextAreaElement;
const selectClipboardButton = document.querySelector('#select-clipboard') as HTMLButtonElement;

/* Add event listeners */
clearClipboardButton.addEventListener('click', clearClipboard);
copyZwsButton.addEventListener('click', () => {
    copyText(copyZwsButton, '\u200B');
    clipboardDisplay();
});
copyNbspButton.addEventListener('click', () => {
    copyText(copyNbspButton, '\u00A0');
    clipboardDisplay();
});
copyEmsButton.addEventListener('click', () => {
    copyText(copyEmsButton, '\u2003');
    clipboardDisplay();
});
copyEnsButton.addEventListener('click', () => {
    copyText(copyEnsButton, '\u2002');
    clipboardDisplay();
});
copyTsButton.addEventListener('click', () => {
    copyText(copyTsButton, '\u2009');
    clipboardDisplay();
});
selectClipboardButton.addEventListener('click', () => {
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
 * Displays the given message if that wasn't already displayed.
 * @param message The message to display.
 */
function showWarning(message: string) {
    if (clipboardWarning.innerHTML.replaceAll('<br>', '<br />') !== message) clipboardWarning.innerHTML = message;
}

/**
 * Clears the clipboard.
 */
function clearClipboard() {
    navigator.clipboard.writeText('');

    clearClipboardButton.disabled = true;
    clearClipboardButton.textContent = 'Cleared!';
    showAlert('Cleared!', 'success');
    clipboardDisplay();

    setTimeout(() => {
        clearClipboardButton.disabled = false;
        clearClipboardButton.textContent = 'Clear Clipboard';
    }, 2000);
}

/**
 * Requests permission to read the clipboard (`clipboard-read`).
 */
async function requestPermission() {
    try {
        const result = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });

        handlePermission(result.state);

        result.addEventListener('change', () => {
            handlePermission(result.state);
        });
    } catch {
        showWarning(
            '<i class="fa-solid fa-exclamation-triangle"></i> Your browser does not support the <code>clipboard-read</code> <a href="https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API#browser_compatibility" target="_blank" class="external-link">permission</a><br />',
        );
    }
}

requestPermission(); // eslint-disable-line unicorn/prefer-top-level-await

let interval: number | null = null;

/**
 * Handles the state of the `clipboard-read` permission request.
 * @param state The state to handle.
 */
function handlePermission(state: PermissionState) {
    if (state === 'granted' || state === 'prompt') {
        if (interval) clearInterval(interval);
        clipboardDisplay();
        if (clipboardReadAllowed === false) interval = setInterval(clipboardDisplay, 500) as unknown as number;
        clipboardReadAllowed = true;
    } else {
        if (interval) clearInterval(interval);
        clipboardReadAllowed = false;
        showWarning('<i class="fa-solid fa-exclamation-triangle"></i> Permission to read clipboard denied!<br />');
    }
}

let storedData: number | null = null;

/**
 * Displays the current clipboard.
 */
async function clipboardDisplay() {
    try {
        const data = await navigator.clipboard.read();

        for (const datum of data)
            if (datum.types.includes('text/plain')) {
                const blob = await datum.getType('text/plain'); // eslint-disable-line no-await-in-loop
                const text = await blob.text(); // eslint-disable-line no-await-in-loop

                if (text.length === 0) {
                    copiedText.value = '';
                    selectClipboardButton.disabled = true;
                    showWarning('<span style="color:#009c3f"><i class="far fa-clipboard"></i> Your clipboard is empty!<br /></span>');
                } else {
                    copiedText.value = text;
                    selectClipboardButton.disabled = false;
                    showWarning('');
                }
            } else if (datum.types.includes('image/png')) {
                const blob = await datum.getType('image/png'); // eslint-disable-line no-await-in-loop

                const url = URL.createObjectURL(blob);
                copiedText.value = '';
                selectClipboardButton.disabled = true;

                if (storedData !== blob.size || (storedData === blob.size && !/Clipboard has image!/.test(clipboardWarning.innerHTML)))
                    showWarning(`<span style="color:#4b5663"><i class="far fa-image"></i> Clipboard has image! (<a href='${url}' target="_blank">view</a>)<br /></span>`);
                if (storedData !== blob.size) storedData = blob.size;
            }
    } catch (error) {
        if (/focused/.test((error as Error).message)) return showWarning('<i class="fa-solid fa-exclamation-triangle"></i> Tab not focused, unable to read clipboard!<br />');
        else if (/user gesture/.test((error as Error).message)) return showWarning('<i class="fa-solid fa-exclamation-triangle"></i> Interact with this tab to start detection!<br />');

        const text = await navigator.clipboard.readText();

        if (text.length === 0) {
            copiedText.value = '';
            selectClipboardButton.disabled = true;
            showWarning('<span style="color:#009c3f"><i class="far fa-clipboard"></i> Your clipboard is empty!<br /></span>');
        } else {
            copiedText.value = text;
            selectClipboardButton.disabled = false;
            showWarning('');
        }
    }
}
