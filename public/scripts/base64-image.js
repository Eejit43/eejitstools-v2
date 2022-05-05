let fileUploadButton = document.getElementById('file-upload');
let fileUploadMessage = document.getElementById('file-message');
let encodeButton = document.getElementById('encode');
let clearButton = document.getElementById('clear');
let b64Result = document.getElementById('b64-result');
let b64CopyResult = document.getElementById('b64-copy-result');
let b64OpenResult = document.getElementById('b64-open-result');
let input = document.getElementById('string-input');
let decodeButton = document.getElementById('decode');
let clearButton2 = document.getElementById('clear2');
let imageOutput = document.getElementById('image-output');

/* Add event listeners */
fileUploadButton.addEventListener('change', fileUpload);
encodeButton.addEventListener('click', encode);
decodeButton.addEventListener('click', decode);
clearButton.addEventListener('click', clear1);
clearButton2.addEventListener('click', clear2);
b64CopyResult.addEventListener('click', function () {
    copyValue('b64-result', 'b64-copy-result');
});

let clearMessageTimeout, clearMessageTimeout2;

function clear1() {
    b64CopyResult = document.getElementById('b64-copy-result');
    validFile = 1;
    fileUploadButton.value = '';
    fileUploadMessage.innerHTML = '';
    b64Result.value = '';
    b64CopyResult.disabled = true;
    b64OpenResult.disabled = true;
    showAlert('Cleared!', 'success');
    clearButton.innerHTML = 'Cleared!';
    clearTimeout(clearMessageTimeout);
    clearMessageTimeout = setTimeout(function () {
        clearButton.innerHTML = 'Clear';
    }, 2000);
    resetResult('e');
}

function clear2() {
    input.value = '';
    imageOutput.src = '';
    showAlert('Cleared!', 'success');
    clearButton2.innerHTML = 'Cleared!';
    clearTimeout(clearMessageTimeout2);
    clearMessageTimeout = setTimeout(function () {
        clearButton2.innerHTML = 'Clear';
    }, 2000);
    resetResult('d');
}

function fileUpload() {
    let file = fileUploadButton;
    let fileMsg = fileUploadMessage;
    let fileName = file.value.split('\\').pop();
    fileMsg.innerHTML = 'Uploaded: ' + escapeHtml(fileName);
}

// https://newbedev.com/base64-image-open-in-new-tab-window-is-not-allowed-to-navigate-top-frame-navigations-to-data-urls
function openBase64InNewTab(data, mimeType) {
    let byteCharacters = atob(data);
    let byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    let file = new Blob([byteArray], {
        type: mimeType + ';base64',
    });
    let fileURL = URL.createObjectURL(file);
    window.open(fileURL);
}

function encode() {
    let oldElement = document.getElementById('b64-open-result');
    let newElement = oldElement.cloneNode(true);
    oldElement.parentNode.replaceChild(newElement, oldElement);
    b64OpenResult = document.getElementById('b64-open-result');

    let image = fileUploadButton;
    let output = b64Result;
    if (image.value) {
        let reader = new FileReader();
        reader.onloadend = function () {
            let imageType = reader.result.replace(/^data:image\/(.*?);base64,.*$/g, '$1');

            if (imageType === 'png' || imageType === 'jpg' || imageType === 'jpeg' || imageType === 'webp' || imageType === 'bmp' || imageType === 'gif') {
                base64 = reader.result;
                output.value = reader.result;
                b64OpenResult.addEventListener('click', function () {
                    openBase64InNewTab(reader.result.replace(/data:image\/.*?;base64,/g, ''), 'image/' + imageType);
                });
                b64CopyResult.disabled = false;
                b64OpenResult.disabled = false;
                showResult('e', 'success');
            } else {
                showAlert('Invalid file type! (must be .png, .jpg, .jpeg, .webp, .bmp, or .gif)', 'error');
                showResult('e', 'error');
            }
        };
        reader.readAsDataURL(image.files[0]);
    } else {
        showAlert('No input!', 'error');
        showResult('e', 'error');
    }
}

async function isBase64Image(string) {
    let image = new Image();
    image.src = escapeHtml(string);
    return await new Promise((resolve) => {
        image.onload = function () {
            if (image.height === 0 || image.width === 0) {
                resolve(false);
                return;
            }
            resolve(true);
        };
        image.onerror = () => {
            resolve(false);
        };
    });
}

async function displayImage(string) {
    let image = imageOutput;
    const valid = await isBase64Image(string);
    if (valid === true) {
        image.src = escapeHtml(string);
    } else if (valid === false) {
        imageOutput.src = '';
        showAlert('Malformed input!', 'error');
        showResult('d', 'error');
    }
}

function decode() {
    let string = input.value;

    if (/data:image\/.*?;base64,/.test(string) === false) {
        string = 'data:image/png;base64,' + string;
    }
    if (string.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('d', 'error');
    } else {
        displayImage(string);
    }
}
