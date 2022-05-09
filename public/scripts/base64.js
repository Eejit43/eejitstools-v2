const input = document.getElementById('input');
const encodeButton = document.getElementById('encode');
const decodeButton = document.getElementById('decode');
const clearButton = document.getElementById('clear');
const result = document.getElementById('result');
const copyResult = document.getElementById('copy-result');

/* Add event listeners */
encodeButton.addEventListener('click', encode);
decodeButton.addEventListener('click', decode);
clearButton.addEventListener('click', () => {
    input.value = '';
    result.value = '';
    copyResult.disabled = true;

    clearButton.disabled = true;
    clearButton.innerHTML = 'Cleared!';
    showAlert('Cleared!', 'success');
    resetResult('encode');
    resetResult('decode');

    setTimeout(() => {
        copyResult.disabled = true;

        clearButton.disabled = false;
        clearButton.innerHTML = 'Clear';
    }, 2000);
});
copyResult.addEventListener('click', () => {
    copyValue(copyResult, result);
});

function encode() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('encode', 'error');
    } else {
        try {
            result.value = btoa(input.value);
            showResult('encode', 'success');
            copyResult.disabled = false;
        } catch (err) {
            showAlert('Malformed input!', 'error');
            showResult('encode', 'error');
        }
    }
}

function decode() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('decode', 'error');
    } else {
        try {
            result.value = atob(input.value);
            showResult('decode', 'success');
            copyResult.disabled = false;
        } catch (err) {
            showAlert('Malformed input!', 'error');
            showResult('decode', 'error');
        }
    }
}
