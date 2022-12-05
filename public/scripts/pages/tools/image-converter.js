import { escapeHTML, showAlert } from '/scripts/functions.js';

const fileUploadButtonLabel = document.getElementById('file-upload-label');
const fileUploadButton = document.getElementById('file-upload');
const fileUploadMessage = document.getElementById('file-message');
const loadButton = document.getElementById('load');
const clearButton = document.getElementById('clear');
const imagePreview = document.getElementById('image-preview');
const outputTypePicker = document.getElementById('output-type');
const convertButton = document.getElementById('convert');
const imageOutput = document.getElementById('image-output');
const openConvertedResultLink = document.getElementById('open-converted-link');
const openConvertedResult = document.getElementById('open-converted-result');
const downloadConvertedResultLink = document.getElementById('download-converted-link');
const downloadConvertedResult = document.getElementById('download-converted-result');

let uploadedImage = null;

/* Add event listeners */
fileUploadButton.addEventListener('change', () => {
    const file = fileUploadButton.files[0];

    if (file) {
        if (!file.type.startsWith('image/')) return showAlert('File must be an image!', 'error');
        if (file.type === 'image/heic') return showAlert('HEIC images are not supported by this tool!', 'error');
        uploadedImage = file;
        fileUploadMessage.innerHTML = `Uploaded: <code>${escapeHTML(file.name)}</code>`;

        loadButton.disabled = false;
    } else {
        fileUploadMessage.textContent = '';
        loadButton.disabled = true;
    }
});
fileUploadButtonLabel.addEventListener('drop', (event) => {
    event.preventDefault();

    if (event.dataTransfer.items) {
        const firstItem = event.dataTransfer.items[0];

        if (firstItem.kind === 'file') {
            const file = firstItem.getAsFile();
            if (!file.type.startsWith('image/')) return showAlert('File must be an image!', 'error');
            if (file.type === 'image/heic') return showAlert('HEIC images are not supported by this tool!', 'error');
            uploadedImage = file;
            fileUploadMessage.innerHTML = `Uploaded: <code>${escapeHTML(file.name)}</code>`;

            loadButton.disabled = false;
        }
    } else {
        const firstFile = event.dataTransfer.files;

        if (!firstFile.type.startsWith('image/')) return showAlert('File must be an image!', 'error');
        if (firstFile.type === 'image/heic') return showAlert('HEIC images are not supported by this tool!', 'error');
        uploadedImage = firstFile;
        fileUploadMessage.innerHTML = `Uploaded: <code>${escapeHTML(firstFile.name)}</code>`;

        loadButton.disabled = false;
    }
});
fileUploadButtonLabel.addEventListener('dragover', (event) => {
    event.preventDefault();
});
loadButton.addEventListener('click', loadImage);
clearButton.addEventListener('click', () => {
    fileUploadButton.value = '';
    fileUploadMessage.textContent = '';
    loadButton.disabled = true;
    imagePreview.getContext('2d').clearRect(0, 0, imagePreview.width, imagePreview.height);
    imagePreview.width = imagePreview.height = 0;
    outputTypePicker.disable = true;
    outputTypePicker.value = 'png';
    convertButton.disabled = true;
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
 * Encodes the base64 image and displays the result
 */
function loadImage() {
    const ctx = imagePreview.getContext('2d');
    ctx.clearRect(0, 0, imagePreview.width, imagePreview.height);
    const image = new Image();
    image.src = URL.createObjectURL(uploadedImage);

    image.addEventListener('load', () => {
        imagePreview.width = image.width;
        imagePreview.height = image.height;
        ctx.drawImage(image, 0, 0);
    });

    outputTypePicker.disabled = false;
    convertButton.disabled = false;
}

/**
 * Converts and displays the image
 */
function convert() {
    const url = imagePreview.toDataURL(`image/${outputTypePicker.value}`);
    imageOutput.src = url;
    const blobUrl = createBase64ObjectURL(url.replace(/data:image\/.*?;base64,/g, ''), `image/${outputTypePicker.value}`);
    openConvertedResultLink.href = downloadConvertedResultLink.href = blobUrl;
    openConvertedResult.disabled = downloadConvertedResult.disabled = false;
    downloadConvertedResultLink.setAttribute('download', `${uploadedImage.name.replace(/\.[^/.]+$/, '') || 'download'}.${outputTypePicker.value === 'jpeg' ? 'jpg' : outputTypePicker.value}`);
}

/**
 * Creates base 64 object URL
 * @param {string} data The base64 to create an object URL for
 * @param {string} mimeType The mimeType of the given base64
 * @returns {string} image object URL
 * @see https://stackoverflow.com/a/52092093
 */
function createBase64ObjectURL(data, mimeType) {
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const file = new Blob([byteArray], {
        type: mimeType + ';base64'
    });
    return URL.createObjectURL(file);
}
