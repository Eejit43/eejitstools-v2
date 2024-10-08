import { copyValue, createBase64ObjectUrl, escapeHtml, showAlert, showResult } from '../../functions.js';

const fileUploadLabel = document.querySelector('#file-upload-label') as HTMLLabelElement;
const fileUpload = document.querySelector('#file-upload') as HTMLInputElement;
const fileUploadMessage = document.querySelector('#file-message') as HTMLDivElement;
const encodeButton = document.querySelector('#encode') as HTMLButtonElement;
const clearUploadButton = document.querySelector('#clear-upload') as HTMLButtonElement;
const encodedResult = document.querySelector('#encoded-result') as HTMLTextAreaElement;
const encodedCopyResultButton = document.querySelector('#encoded-copy-result') as HTMLButtonElement;
const encodedOpenResultLink = document.querySelector('#encoded-open-result-link') as HTMLAnchorElement;
const encodedOpenResultButton = document.querySelector('#encoded-open-result') as HTMLButtonElement;
const input = document.querySelector('#string-input') as HTMLTextAreaElement;
const decodeButton = document.querySelector('#decode') as HTMLButtonElement;
const clearStringButton = document.querySelector('#clear-string') as HTMLButtonElement;
const imageResult = document.querySelector('#image-result') as HTMLImageElement;

let uploadedFile: File | null = null;

/* Add event listeners */
fileUpload.addEventListener('change', () => {
    if (fileUpload.files?.[0]) {
        uploadedFile = fileUpload.files[0];
        fileUploadMessage.innerHTML = `Uploaded: <code>${escapeHtml(uploadedFile.name)}</code>`;
    } else {
        uploadedFile = null;
        fileUploadMessage.textContent = '';
    }
});
fileUploadLabel.addEventListener('drop', (event) => {
    event.preventDefault();

    if (event.dataTransfer?.items) {
        const firstItem = event.dataTransfer.items[0];

        if (firstItem.kind === 'file') {
            uploadedFile = firstItem.getAsFile();
            fileUploadMessage.innerHTML = `Uploaded: <code>${escapeHtml(uploadedFile!.name)}</code>`;
        }
    } else {
        const firstFile = event.dataTransfer?.files[0];

        if (firstFile) {
            uploadedFile = firstFile;
            fileUploadMessage.innerHTML = `Uploaded: <code>${escapeHtml(uploadedFile.name)}</code>`;
        }
    }
});
fileUploadLabel.addEventListener('dragover', (event) => {
    event.preventDefault();
});
encodeButton.addEventListener('click', encode);
decodeButton.addEventListener('click', () => {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'warning');
        showResult(decodeButton, 'warning');
    } else {
        const string = /data:image\/.*?;base64,/.test(input.value) ? input.value : 'data:image/png;base64,' + input.value;
        displayImage(string);
    }
});
clearUploadButton.addEventListener('click', () => {
    fileUpload.value = '';
    fileUploadMessage.textContent = '';
    encodedResult.value = '';
    encodedCopyResultButton.disabled = true;
    encodedOpenResultButton.disabled = true;
    encodedOpenResultLink.removeAttribute('href');

    uploadedFile = null;

    clearUploadButton.disabled = true;
    clearUploadButton.textContent = 'Cleared!';
    showAlert('Cleared!', 'success');

    setTimeout(() => {
        clearUploadButton.disabled = false;
        clearUploadButton.textContent = 'Clear';
    }, 2000);
});
clearStringButton.addEventListener('click', () => {
    input.value = '';
    imageResult.src = '';

    uploadedFile = null;

    clearStringButton.disabled = true;
    clearStringButton.textContent = 'Cleared!';
    showAlert('Cleared!', 'success');

    setTimeout(() => {
        clearStringButton.disabled = false;
        clearStringButton.textContent = 'Clear';
    }, 2000);
});
encodedCopyResultButton.addEventListener('click', () => {
    copyValue(encodedCopyResultButton, encodedResult);
});

const validImageTypes = new Set(['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif']);

/**
 * Encodes the base64 image and displays the result.
 */
function encode() {
    if (uploadedFile) {
        const reader = new FileReader();
        reader.readAsDataURL(uploadedFile);
        reader.addEventListener('loadend', () => {
            const imageType = (reader.result as string).replaceAll(/^data:image\/(.*?);base64,.*$/g, '$1');
            if (validImageTypes.has(imageType)) {
                encodedResult.value = reader.result as string;
                encodedCopyResultButton.disabled = false;
                encodedOpenResultButton.disabled = false;
                encodedOpenResultLink.href = createBase64ObjectUrl(
                    (reader.result as string).replaceAll(/data:image\/.*?;base64,/g, ''),
                    'image/' + imageType,
                );
                showResult(encodeButton, 'success');
            } else {
                showAlert('Unsupported file type!', 'error');
                showResult(encodeButton, 'error');
            }
        });
    } else {
        showAlert('No input!', 'warning');
        showResult(encodeButton, 'warning');
    }
}

/**
 * Checks if the specified string is a valid base64 encoded image.
 * @param base64 The base64 to check.
 */
function isBase64Image(base64: string): Promise<boolean> {
    const image = new Image();
    image.src = escapeHtml(base64);
    return new Promise((resolve) => {
        image.addEventListener('load', () => resolve(!(image.height === 0 || image.width === 0)));
        image.addEventListener('error', () => resolve(false));
    });
}

/**
 * Determines validity and displays a base64 encoded image.
 * @param string The base64 of the image to display.
 */
async function displayImage(string: string) {
    const valid = await isBase64Image(string);
    if (valid) imageResult.src = escapeHtml(string);
    else {
        imageResult.src = '';
        showAlert('Malformed input!', 'error');
        showResult(decodeButton, 'error');
    }
}
