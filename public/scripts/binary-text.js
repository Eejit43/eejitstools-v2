let input = document.getElementById('input');
let toBinaryBtn = document.getElementById('to-binary');
let fromBinaryBtn = document.getElementById('from-binary');
let clearBtn = document.getElementById('clear');
let result = document.getElementById('result');
let resultCopy = document.getElementById('copy-result');

/* Add event listeners */
toBinaryBtn.addEventListener('click', toBinary);
fromBinaryBtn.addEventListener('click', fromBinary);
clearBtn.addEventListener('click', clear);
resultCopy.addEventListener('click', function () {
    copyValue('result', 'copy-result');
});

function clear() {
    resultCopy = document.getElementById('copy-result');
    input.value = '';
    result.value = '';
    resetResult('e');
    resetResult('d');
    resultCopy.innerHTML = 'Copy';
    resultCopy.disabled = true;
    showAlert('Cleared!', 'success');
}

function textToBinary(string) {
    return string
        .split('')
        .map(function (char) {
            return char.charCodeAt(0).toString(2);
        })
        .join(' ');
}

function toBinary() {
    resultCopy = document.getElementById('copy-result');
    if (input.value.trim().length <= 0) {
        result.value = '';
        resultCopy.disabled = true;
        showResult('e', 'error');
        showAlert('Empty input!', 'error');
    } else {
        result.value = textToBinary(input.value.trim());
        resultCopy.disabled = false;
        showResult('e', 'success');
    }
}

function binaryToText(binary) {
    binary = binary.split(' ');
    return binary.map((elem) => String.fromCharCode(parseInt(elem, 2))).join('');
}

function fromBinary() {
    resultCopy = document.getElementById('copy-result');
    if (input.value.trim().length <= 0) {
        result.value = '';
        resultCopy.disabled = true;
        showResult('d', 'error');
        showAlert('Empty input!', 'error');
    } else if (/^[ 01]+$/gm.test(input.value.trim())) {
        result.value = binaryToText(input.value.trim());
        resultCopy.disabled = false;
        showResult('d', 'success');
    } else {
        result.value = '';
        resultCopy.disabled = true;
        showResult('d', 'error');
        showAlert('Invalid binary!', 'error');
    }
}
