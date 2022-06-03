/* global heic2any */

import { escapeHTML, showAlert } from '/scripts/functions.js';

const fileUploadButton = document.getElementById('file-upload');
const fileUploadMessage = document.getElementById('file-message');
const clearButton = document.getElementById('clear');
const outputTypePicker = document.getElementById('output-type');
const convertButton = document.getElementById('convert');
const convertingMessage = document.getElementById('converting-message');
const imageOutput = document.getElementById('image-output');
const openConvertedResultLink = document.getElementById('open-converted-link');
const openConvertedResult = document.getElementById('open-converted-result');
const downloadConvertedResultLink = document.getElementById('download-converted-link');
const downloadConvertedResult = document.getElementById('download-converted-result');

/* Add event listeners */
fileUploadButton.addEventListener('change', () => {
    const file = fileUploadButton.files[0];

    if (file) {
        if (file.type !== 'image/heic') return showAlert('File is not in HEIC format!', 'error');
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
    imageOutput.src = '';
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
    const result = await heic2any({ blob, type: `image/${outputTypePicker.value}`, quality: 1 }).catch(() => {
        convertingMessage.textContent = '';
        convertButton.disabled = false;
        return showAlert('Failed to convert image!', 'error');
    });

    const url = URL.createObjectURL(result);

    imageOutput.src = url;
    openConvertedResultLink.href = downloadConvertedResultLink.href = url;
    openConvertedResult.disabled = downloadConvertedResult.disabled = false;
    downloadConvertedResultLink.download = `${blob.name.replace(/\.HEIC$/i, `.${outputTypePicker.value === 'jpeg' ? 'jpg' : outputTypePicker.value}`)}`;

    convertingMessage.textContent = '';
    convertButton.disabled = false;
}
