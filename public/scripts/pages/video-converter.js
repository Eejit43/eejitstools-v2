import { escapeHTML, showAlert } from '/scripts/functions.js';

const fileUploadButton = document.getElementById('file-upload');
const fileUploadMessage = document.getElementById('file-message');
const clearButton = document.getElementById('clear');
const outputTypePicker = document.getElementById('output-type');
const convertButton = document.getElementById('convert');
const convertingMessage = document.getElementById('converting-message');
const videoOutput = document.getElementById('video-output');
const openConvertedResultLink = document.getElementById('open-converted-link');
const openConvertedResult = document.getElementById('open-converted-result');
const downloadConvertedResultLink = document.getElementById('download-converted-link');
const downloadConvertedResult = document.getElementById('download-converted-result');

/* Add event listeners */
fileUploadButton.addEventListener('change', () => {
    const file = fileUploadButton.files[0];

    if (file) {
        if (!file.type.startsWith('video/')) return showAlert('File must be a video!', 'error');
        fileUploadMessage.innerHTML = `Uploaded: <code>${escapeHTML(file.name)}</code>`;

        outputTypePicker.disabled = false;
        convertButton.disabled = false;
    } else {
        fileUploadMessage.textContent = '';

        outputTypePicker.disabled = true;
        convertButton.disabled = true;
    }
});
clearButton.addEventListener('click', () => {
    fileUploadButton.value = '';
    fileUploadMessage.textContent = '';
    outputTypePicker.disable = true;
    outputTypePicker.value = 'png';
    convertButton.disabled = true;
    convertingMessage.textContent = '';
    videoOutput.src = '';
    openConvertedResultLink.removeAttribute('href');
    openConvertedResult.disabled = true;
    downloadConvertedResultLink.removeAttribute('href');
    downloadConvertedResultLink.removeAttribute('download');
    downloadConvertedResult.disabled = true;

    clearButton.disabled = true;
    clearButton.textContent = 'Cleared!';
    showAlert('Cleared!', 'success');

    setTimeout(() => {
        clearButton.disabled = false;
        clearButton.textContent = 'Clear';
    }, 2000);
});
convertButton.addEventListener('click', convert);

/**
 * Converts and displays the image
 */
async function convert() {
    convertingMessage.innerHTML = '<br />Converting... <i class="fa-solid fa-spinner fa-pulse"></i>';
    convertButton.disabled = true;

    const blob = fileUploadButton.files[0];
    const result = await convertAudio(blob, `audio/${outputTypePicker.value}`).catch(() => {
        convertingMessage.textContent = '';
        convertButton.disabled = false;
        return showAlert('Failed to convert video!', 'error');
    });

    videoOutput.src = result;
    openConvertedResultLink.href = downloadConvertedResultLink.href = result;
    openConvertedResult.disabled = downloadConvertedResult.disabled = false;
    downloadConvertedResultLink.download = `${fileUploadButton.files[0].name.replace(/\.[^/.]+$/, '') || 'download'}.${outputTypePicker.value}`;

    convertingMessage.textContent = '';
    convertButton.disabled = false;
}

/**
 * Converts audio to target format
 * @param {string} audioFileData audio file data
 * @param {string} targetFormat output target format
 * @returns {Promise<Blob>} output blob url
 * @see https://github.com/suvro404/convert-audio/blob/main/index.js
 */
function convertAudio(audioFileData, targetFormat) {
    const reader = new FileReader();
    reader.readAsDataURL(audioFileData);
    return new Promise((resolve) => {
        reader.addEventListener('load', (event) => {
            const data = event.target.result.split(',');
            const b64Data = data[1];
            const blob = getBlobFromBase64Data(b64Data, targetFormat);
            const blobUrl = URL.createObjectURL(blob);

            resolve(blobUrl);
        });
    });
}

/**
 * Gets a blob from base64 data
 * @param {string} b64Data base64 data
 * @param {string} contentType output content type
 * @param {number} [sliceSize=512] size of slice
 * @returns {Blob} blob
 */
function getBlobFromBase64Data(b64Data, contentType, sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}
