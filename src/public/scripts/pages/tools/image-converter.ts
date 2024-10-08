import { createBase64ObjectUrl, escapeHtml, showAlert } from '../../functions.js';

const fileUploadLabel = document.querySelector('#file-upload-label') as HTMLLabelElement;
const fileUpload = document.querySelector('#file-upload') as HTMLInputElement;
const fileUploadMessage = document.querySelector('#file-message') as HTMLDivElement;
const loadButton = document.querySelector('#load') as HTMLButtonElement;
const clearButton = document.querySelector('#clear') as HTMLButtonElement;
const imagePreview = document.querySelector('#image-preview') as HTMLCanvasElement;
const outputTypePicker = document.querySelector('#output-type') as HTMLSelectElement;
const convertButton = document.querySelector('#convert') as HTMLButtonElement;
const imageOutput = document.querySelector('#image-output') as HTMLImageElement;
const openConvertedResultLink = document.querySelector('#open-converted-link') as HTMLAnchorElement;
const openConvertedResultButton = document.querySelector('#open-converted-result') as HTMLButtonElement;
const downloadConvertedResultLink = document.querySelector('#download-converted-link') as HTMLAnchorElement;
const downloadConvertedResultButton = document.querySelector('#download-converted-result') as HTMLButtonElement;

let uploadedImage: File | null = null;

/* Add event listeners */
fileUpload.addEventListener('change', () => {
    const file = fileUpload.files?.[0];

    if (file) {
        if (!file.type.startsWith('image/')) return showAlert('File must be an image!', 'error');
        if (file.type === 'image/heic') return showAlert('HEIC images are not supported by this tool!', 'error');
        uploadedImage = file;
        fileUploadMessage.innerHTML = `Uploaded: <code>${escapeHtml(file.name)}</code>`;

        loadButton.disabled = false;
    } else {
        fileUploadMessage.textContent = '';
        loadButton.disabled = true;
    }
});
fileUploadLabel.addEventListener('drop', (event) => {
    event.preventDefault();

    if (event.dataTransfer?.items) {
        const firstItem = event.dataTransfer.items[0];

        if (firstItem.kind === 'file') {
            const file = firstItem.getAsFile()!;
            if (!file.type.startsWith('image/')) return showAlert('File must be an image!', 'error');
            if (file.type === 'image/heic') return showAlert('HEIC images are not supported by this tool!', 'error');
            uploadedImage = file;
            fileUploadMessage.innerHTML = `Uploaded: <code>${escapeHtml(file.name)}</code>`;

            loadButton.disabled = false;
        }
    } else {
        const firstFile = event.dataTransfer?.files?.[0];

        if (firstFile) {
            if (!firstFile.type.startsWith('image/')) return showAlert('File must be an image!', 'error');
            if (firstFile.type === 'image/heic') return showAlert('HEIC images are not supported by this tool!', 'error');
            uploadedImage = firstFile;
            fileUploadMessage.innerHTML = `Uploaded: <code>${escapeHtml(firstFile.name)}</code>`;

            loadButton.disabled = false;
        }
    }
});
fileUploadLabel.addEventListener('dragover', (event) => {
    event.preventDefault();
});
loadButton.addEventListener('click', loadImage);
clearButton.addEventListener('click', () => {
    fileUpload.value = '';
    fileUploadMessage.textContent = '';
    loadButton.disabled = true;
    imagePreview.getContext('2d')!.clearRect(0, 0, imagePreview.width, imagePreview.height);
    imagePreview.width = imagePreview.height = 0;
    outputTypePicker.disabled = true;
    outputTypePicker.value = 'png';
    convertButton.disabled = true;
    imageOutput.src = '';
    openConvertedResultLink.removeAttribute('href');
    openConvertedResultButton.disabled = true;
    downloadConvertedResultLink.removeAttribute('href');
    downloadConvertedResultLink.removeAttribute('download');
    downloadConvertedResultButton.disabled = true;

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
 * Encodes the base64 image and displays the result.
 */
function loadImage() {
    const context = imagePreview.getContext('2d')!;
    context.clearRect(0, 0, imagePreview.width, imagePreview.height);
    const image = new Image();
    image.src = URL.createObjectURL(uploadedImage!);

    image.addEventListener('load', () => {
        imagePreview.width = image.width;
        imagePreview.height = image.height;
        context.drawImage(image, 0, 0);
    });

    outputTypePicker.disabled = false;
    convertButton.disabled = false;
}

/**
 * Converts and displays the image.
 */
function convert() {
    const url = imagePreview.toDataURL(`image/${outputTypePicker.value}`);
    imageOutput.src = url;
    const blobUrl = createBase64ObjectUrl(url.replaceAll(/data:image\/.*?;base64,/g, ''), `image/${outputTypePicker.value}`);
    openConvertedResultLink.href = downloadConvertedResultLink.href = blobUrl;
    openConvertedResultButton.disabled = downloadConvertedResultButton.disabled = false;
    downloadConvertedResultLink.setAttribute(
        'download',
        `${uploadedImage!.name.replace(/\.[^./]+$/, '') || 'download'}.${outputTypePicker.value === 'jpeg' ? 'jpg' : outputTypePicker.value}`,
    );
}
