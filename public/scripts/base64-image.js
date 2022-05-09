const fileUploadButton = document.getElementById('file-upload');
const fileUploadMessage = document.getElementById('file-message');
const encodeButton = document.getElementById('encode');
const clearButton = document.getElementById('clear');
const b64Result = document.getElementById('b64-result');
const b64CopyResult = document.getElementById('b64-copy-result');
let b64OpenResult = document.getElementById('b64-open-result');
const input = document.getElementById('string-input');
const decodeButton = document.getElementById('decode');
const clearButton2 = document.getElementById('clear2');
const imageOutput = document.getElementById('image-output');

/* Add event listeners */
fileUploadButton.addEventListener('change', () => {
    const file = fileUploadButton;
    const fileMsg = fileUploadMessage;
    const fileName = file.value.split('\\').pop();
    fileMsg.innerHTML = 'Uploaded: ' + escapeHTML(fileName);
});
encodeButton.addEventListener('click', encode);
decodeButton.addEventListener('click', () => {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('d', 'error');
    } else {
        const string = !/data:image\/.*?;base64,/.test(input.value) ? 'data:image/png;base64,' + input.value : input.value;
        displayImage(string);
    }
});
clearButton.addEventListener('click', () => {
    fileUploadButton.value = '';
    fileUploadMessage.innerHTML = '';
    b64Result.value = '';
    b64CopyResult.disabled = true;
    b64OpenResult.disabled = true;

    clearButton.disabled = true;
    clearButton.innerHTML = 'Cleared!';
    showAlert('Cleared!', 'success');
    resetResult('e');

    setTimeout(() => {
        clearButton.disabled = false;
        clearButton.innerHTML = 'Clear';
    }, 2000);
});
clearButton2.addEventListener('click', () => {
    input.value = '';
    imageOutput.src = '';

    clearButton2.disabled = true;
    clearButton2.innerHTML = 'Cleared!';
    showAlert('Cleared!', 'success');
    resetResult('d');

    setTimeout(() => {
        clearButton2.disabled = false;
        clearButton2.innerHTML = 'Clear';
    }, 2000);
});
b64CopyResult.addEventListener('click', () => {
    copyValue(b64CopyResult, b64Result);
});

function encode() {
    const oldElement = document.getElementById('b64-open-result');
    const newElement = oldElement.cloneNode(true);
    oldElement.parentNode.replaceChild(newElement, oldElement);
    b64OpenResult = document.getElementById('b64-open-result');

    if (fileUploadButton.value) {
        const reader = new FileReader();
        reader.readAsDataURL(fileUploadButton.files[0]);
        reader.addEventListener('loadend', () => {
            const imageType = reader.result.replace(/^data:image\/(.*?);base64,.*$/g, '$1');

            if (imageType === 'png' || imageType === 'jpg' || imageType === 'jpeg' || imageType === 'webp' || imageType === 'bmp' || imageType === 'gif') {
                base64 = reader.result;
                b64Result.value = reader.result;
                b64OpenResult.addEventListener('click', () => {
                    openBase64InNewTab(reader.result.replace(/data:image\/.*?;base64,/g, ''), 'image/' + imageType);
                });
                b64CopyResult.disabled = false;
                b64OpenResult.disabled = false;
                showResult('e', 'success');
            } else {
                showAlert('Invalid file type! (must be .png, .jpg, .jpeg, .webp, .bmp, or .gif)', 'error');
                showResult('e', 'error');
            }
        });
    } else {
        showAlert('No input!', 'error');
        showResult('e', 'error');
    }
}

/**
 * Determines if the specified string is a valid base64 encoded image
 * @param {string} base64 The base64 to check
 * @returns {Promise<boolean>} Whether or not the base64 is a valid image
 */
async function isBase64Image(base64) {
    const image = new Image();
    image.src = escapeHTML(base64);
    return await new Promise((resolve) => {
        image.addEventListener('load', () => {
            if (image.height === 0 || image.width === 0) {
                resolve(false);
                return;
            }
            resolve(true);
        });
        image.addEventListener('error', () => {
            resolve(false);
        });
    });
}

/**
 * Determines validity and displays a base64 encoded image
 * @param {string} string The base64 of the image to display
 */
async function displayImage(string) {
    const valid = await isBase64Image(string);
    if (valid) {
        imageOutput.src = escapeHTML(string);
    } else {
        imageOutput.src = '';
        showAlert('Malformed input!', 'error');
        showResult('d', 'error');
    }
}

/**
 * Opens a valid base64 file in a new tab
 * @param {string} data The base64 to open
 * @param {string} mimeType The mimeType of the given base64
 * @see https://newbedev.com/base64-image-open-in-new-tab-window-is-not-allowed-to-navigate-top-frame-navigations-to-data-urls
 */
function openBase64InNewTab(data, mimeType) {
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const file = new Blob([byteArray], {
        type: mimeType + ';base64',
    });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
}
