import { copyValue, createBase64ObjectUrl, escapeHtml, resetResult, showAlert, showResult } from '../../functions.js';

const fileUploadLabel = document.getElementById('file-upload-label') as HTMLLabelElement;
const fileUpload = document.getElementById('file-upload') as HTMLInputElement;
const fileUploadMessage = document.getElementById('file-message') as HTMLSpanElement;
const encodeButton = document.getElementById('encode') as HTMLButtonElement;
const clearButton = document.getElementById('clear') as HTMLButtonElement;
const b64Result = document.getElementById('b64-result') as HTMLTextAreaElement;
const b64CopyResultButton = document.getElementById('b64-copy-result') as HTMLButtonElement;
const b64OpenResultLink = document.getElementById('b64-open-result-link') as HTMLAnchorElement;
const b64OpenResultButton = document.getElementById('b64-open-result') as HTMLButtonElement;
const input = document.getElementById('string-input') as HTMLTextAreaElement;
const decodeButton = document.getElementById('decode') as HTMLButtonElement;
const clearButton2 = document.getElementById('clear2') as HTMLButtonElement;
const imageOutput = document.getElementById('image-output') as HTMLImageElement;

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
            fileUploadMessage.innerHTML = `Uploaded: <code>${escapeHtml((uploadedFile as File).name)}</code>`;
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
        showAlert('Empty input!', 'error');
        showResult('decode', 'error');
    } else {
        const string = !/data:image\/.*?;base64,/.test(input.value) ? 'data:image/png;base64,' + input.value : input.value;
        displayImage(string);
    }
});
clearButton.addEventListener('click', () => {
    fileUpload.value = '';
    fileUploadMessage.textContent = '';
    b64Result.value = '';
    b64CopyResultButton.disabled = true;
    b64OpenResultButton.disabled = true;
    b64OpenResultLink.removeAttribute('href');

    uploadedFile = null;

    clearButton.disabled = true;
    clearButton.textContent = 'Cleared!';
    showAlert('Cleared!', 'success');
    resetResult('encode');

    setTimeout(() => {
        clearButton.disabled = false;
        clearButton.textContent = 'Clear';
    }, 2000);
});
clearButton2.addEventListener('click', () => {
    input.value = '';
    imageOutput.src = '';

    uploadedFile = null;

    clearButton2.disabled = true;
    clearButton2.textContent = 'Cleared!';
    showAlert('Cleared!', 'success');
    resetResult('decode');

    setTimeout(() => {
        clearButton2.disabled = false;
        clearButton2.textContent = 'Clear';
    }, 2000);
});
b64CopyResultButton.addEventListener('click', () => {
    copyValue(b64CopyResultButton, b64Result);
});

/**
 * Encodes the base64 image and displays the result.
 */
function encode() {
    if (uploadedFile) {
        const reader = new FileReader();
        reader.readAsDataURL(uploadedFile);
        reader.addEventListener('loadend', () => {
            const imageType = (reader.result as string).replace(/^data:image\/(.*?);base64,.*$/g, '$1');
            if (imageType === 'png' || imageType === 'jpg' || imageType === 'jpeg' || imageType === 'webp' || imageType === 'bmp' || imageType === 'gif') {
                b64Result.value = reader.result as string;
                b64CopyResultButton.disabled = false;
                b64OpenResultButton.disabled = false;
                b64OpenResultLink.href = createBase64ObjectUrl((reader.result as string).replace(/data:image\/.*?;base64,/g, ''), 'image/' + imageType);
                showResult('encode', 'success');
            } else {
                showAlert('Invalid file type! (must be .png, .jpg, .jpeg, .webp, .bmp, or .gif)', 'error');
                showResult('encode', 'error');
            }
        });
    } else {
        showAlert('No input!', 'error');
        showResult('encode', 'error');
    }
}

/**
 * Checks if the specified string is a valid base64 encoded image.
 * @param base64 The base64 to check.
 */
function isBase64Image(base64: string) {
    const image = new Image();
    image.src = escapeHtml(base64);
    return new Promise((resolve) => {
        image.addEventListener('load', () => {
            if (image.height === 0 || image.width === 0) return resolve(false);
            resolve(true);
        });
        image.addEventListener('error', () => {
            resolve(false);
        });
    });
}

/**
 * Determines validity and displays a base64 encoded image.
 * @param string The base64 of the image to display.
 */
async function displayImage(string: string) {
    const valid = await isBase64Image(string);
    if (valid) imageOutput.src = escapeHtml(string);
    else {
        imageOutput.src = '';
        showAlert('Malformed input!', 'error');
        showResult('decode', 'error');
    }
}
