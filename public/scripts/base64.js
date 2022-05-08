const input = document.getElementById('input');
const encodeButton = document.getElementById('encode');
const decodeButton = document.getElementById('decode');
const clear = document.getElementById('clear');
const result = document.getElementById('result');
let copyResult = document.getElementById('copy-result');

/* Add event listeners */
encodeButton.addEventListener('click', encode);
decodeButton.addEventListener('click', decode);
clear.addEventListener('click', clearAll);
copyResult.addEventListener('click', () => {
    copyValue('result', 'copy-result');
});

let clearMessageTimeout;
function clearAll() {
    copyResult = document.getElementById('copy-result');
    input.value = '';
    result.value = '';
    copyResult.disabled = true;
    showAlert('Cleared!', 'success');
    clear.innerHTML = 'Cleared!';
    clearTimeout(clearMessageTimeout);
    clearMessageTimeout = setTimeout(function () {
        clear.innerHTML = 'Clear';
    }, 2000);
    resetResult('e');
    resetResult('d');
}

function encode() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('e', 'error');
    } else {
        try {
            result.value = btoa(input.value);
            showResult('e', 'success');
            copyResult.disabled = false;
        } catch (err) {
            showAlert('Malformed input!', 'error');
            showResult('e', 'error');
        }
    }
}

function decode() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('d', 'error');
    } else {
        try {
            result.value = atob(input.value);
            showResult('d', 'success');
            copyResult.disabled = false;
        } catch (err) {
            showAlert('Malformed input!', 'error');
            showResult('d', 'error');
        }
    }
}
