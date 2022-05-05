let input = document.getElementById('input');
let separator = document.getElementById('separator');
let alphabetizeNormalButton = document.getElementById('alphabetize-normal');
let numerizeButton = document.getElementById('numerize');
let randomizeButton = document.getElementById('randomize');
let reverseButton = document.getElementById('reverse');
let clear = document.getElementById('clear');
let result = document.getElementById('result');
let copyResult = document.getElementById('copy-result');

/* Add event listeners */
alphabetizeNormalButton.addEventListener('click', alphabetizeNormal);
numerizeButton.addEventListener('click', numerize);
randomizeButton.addEventListener('click', randomize);
reverseButton.addEventListener('click', reverse);
clear.addEventListener('click', clearAll);
copyResult.addEventListener('click', function () {
    copyValue('result', 'copy-result');
});

let clearMessageTimeout;

function clearAll() {
    copyResult = document.getElementById('copy-result');
    input.value = '';
    result.value = '';
    separator.value = '\\n';
    copyResult.disabled = true;
    showAlert('Cleared!', 'success');
    clear.innerHTML = 'Cleared!';
    clearTimeout(clearMessageTimeout);
    clearMessageTimeout = setTimeout(function () {
        clear.innerHTML = 'Clear';
    }, 2000);
    resetResult('alphabetize');
    resetResult('numerize');
    resetResult('randomize');
    resetResult('reverse');
}

function alphabetizeNormal() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('alphabetize', 'error');
    } else {
        let output = input.value.split(separator.value.replace('\\n', '\n'));
        output = output.sort((a, b) => a.localeCompare(b)).join(separator.value.replace('\\n', '\n'));
        result.value = output;
        showResult('alphabetize', 'success');
        copyResult.disabled = false;
    }
}

function numerize() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('numerize', 'error');
    } else {
        let output = input.value.split(separator.value.replace('\\n', '\n'));
        output = output
            .map((x) => parseInt(x))
            .filter((x) => x === 0 || Boolean(x))
            .sort((a, b) => a - b)
            .join(separator.value.replace('\\n', '\n'));
        result.value = output;
        showResult('numerize', 'success');
        copyResult.disabled = false;
    }
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function randomize() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('randomize', 'error');
    } else {
        let output = input.value.split(separator.value.replace('\\n', '\n'));
        output = shuffleArray(output).join(separator.value.replace('\\n', '\n'));
        result.value = output;
        showResult('randomize', 'success');
        copyResult.disabled = false;
    }
}

function reverse() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('reverse', 'error');
    } else {
        let output = input.value.split(separator.value.replace('\\n', '\n'));
        output = output.reverse().join(separator.value.replace('\\n', '\n'));
        result.value = output;
        showResult('reverse', 'success');
        copyResult.disabled = false;
    }
}
