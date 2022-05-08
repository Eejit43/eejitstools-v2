const dlrRegexInput = document.getElementById('dlr-regexInput');
const runDlr = document.getElementById('run-dlr');
const dlrResult = document.getElementById('dlr-result');
const dlrResult2 = document.getElementById('dlr-result-2');
const dlrClearButton = document.getElementById('dlr-clear');
let dlrCopyResult = document.getElementById('dlr-copy-result');
const wrRegexInput = document.getElementById('wr-regexInput');
const runWr = document.getElementById('run-wr');
const wrResult = document.getElementById('wr-result');
const wrResult2 = document.getElementById('wr-result-2');
const wrResult3 = document.getElementById('wr-result-3');
const wrClearButton = document.getElementById('wr-clear');
let wrCopyResult = document.getElementById('wr-copy-result');
let wrCopyResult2 = document.getElementById('wr-copy-result-2');
let wrCopyResult3 = document.getElementById('wr-copy-result-3');
const rmRegexInput = document.getElementById('rm-regexInput');
const rmRegex = document.getElementById('rm-regex');
const rmFlags = document.getElementById('rm-flags');
const rmReplace = document.getElementById('rm-replace');
const runRm = document.getElementById('run-rm');
const rmResult = document.getElementById('rm-result');
const rmClear = document.getElementById('rm-clear');
const rmClear2 = document.getElementById('rm-clear-2');
const rmSwitchButton = document.getElementById('rm-switch');
let rmCopyResult = document.getElementById('rm-copy-result');

/* Add event listeners */
runDlr.addEventListener('click', runDlrRegex);
dlrClearButton.addEventListener('click', dlrClear);
dlrCopyResult.addEventListener('click', () => {
    copyValue('dlr-result', 'dlr-copy-result');
});
runWr.addEventListener('click', runWrRegex);
wrClearButton.addEventListener('click', wrClear);
wrCopyResult.addEventListener('click', () => {
    copyValue('wr-result', 'wr-copy-result');
});
wrCopyResult2.addEventListener('click', () => {
    copyValue('wr-result-2', 'wr-copy-result-2');
});
wrCopyResult3.addEventListener('click', () => {
    copyValue('wr-result-3', 'wr-copy-result-3');
});
runRm.addEventListener('click', runRmRegex);
rmClear.addEventListener('click', rmClearInput);
rmClear2.addEventListener('click', rmClearAll);
rmSwitchButton.addEventListener('click', rmSwitch);
rmCopyResult.addEventListener('click', () => {
    copyValue('rm-result', 'rm-copy-result');
});
rmRegex.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') rmRegex.value += '\\n';
});
rmRegex.addEventListener('paste', (event) => {
    event.preventDefault();
    rmRegex.value += event.clipboardData.getData('text').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
});
rmReplace.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') rmReplace.value += '\\n';
});
rmReplace.addEventListener('paste', (event) => {
    event.preventDefault();
    rmReplace.value += event.clipboardData.getData('text').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
});

// Duplicate Line Remover
function dlrClear() {
    dlrCopyResult = document.getElementById('dlr-copy-result');
    dlrRegexInput.value = '';
    dlrResult.value = '';
    dlrCopyResult.disabled = true;
    showAlert('Cleared!', 'success');
    resetResult('dlr');
    dlrClearButton.innerHTML = 'Cleared!';
    setTimeout(function () {
        dlrClearButton.innerHTML = 'Clear';
    }, 2000);
}

function runDlrRegex() {
    if (dlrRegexInput.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('dlr', 'error');
    } else {
        showResult('dlr', 'success');
        dlrResult.value = dlrRegexInput.value.replace(/^(.+)$(?=[\s\S]*^(\1)$[\s\S]*)/gm, '');
        dlrCopyResult.disabled = false;
    }
}

// Whitespace Remover
function wrClear() {
    wrCopyResult = document.getElementById('wr-copy-result');
    wrCopyResult2 = document.getElementById('wr-copy-result-2');
    wrCopyResult3 = document.getElementById('wr-copy-result-3');
    wrRegexInput.value = '';
    wrResult.value = '';
    wrCopyResult.disabled = true;
    wrResult2.value = '';
    wrCopyResult2.disabled = true;
    wrResult3.value = '';
    wrCopyResult3.disabled = true;
    showAlert('Cleared!', 'success');
    resetResult('wr');
    wrClearButton.innerHTML = 'Cleared!';
    setTimeout(() => {
        wrClearButton.innerHTML = 'Clear';
    }, 2000);
}

function runWrRegex() {
    let input = wrRegexInput.value;
    if (input.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('wr', 'error');
    } else {
        showResult('wr', 'success');
        wrResult.value = input.replace(/^[ \t]+|[ \t]+$/gm, '');
        wrCopyResult.disabled = false;
        wrResult2.value = input.replace(/^[ \t\r\n]+|[ \t]+$/gm, '');
        wrCopyResult2.disabled = false;
        wrResult3.value = input.replace(/^[ \t\r\n]+|[ \t\r\n]+$/gm, '');
        wrCopyResult3.disabled = false;
    }
}

// Regex Maker
function rmClearInput() {
    rmCopyResult = document.getElementById('rm-copy-result');
    rmRegexInput.value = '';
    rmResult.value = '';
    rmCopyResult.disabled = true;
    showAlert('Cleared!', 'success');
    resetResult('rm');
    rmClear.innerHTML = 'Cleared!';
    setTimeout(() => {
        rmClear.innerHTML = 'Clear Input';
    }, 2000);
}

function rmClearAll() {
    rmCopyResult = document.getElementById('rm-copy-result');
    rmRegexInput.value = '';
    rmResult.value = '';
    rmCopyResult.disabled = true;
    rmRegex.value = '';
    rmFlags.value = 'g';
    rmReplace.value = '';
    showAlert('Cleared!', 'success');
    resetResult('rm');
    rmClear2.innerHTML = 'Cleared!';
    setTimeout(() => {
        rmClear2.innerHTML = 'Clear All';
    }, 2000);
}

function rmSwitch() {
    if (rmResult.value.length === 0) {
        showAlert('Nothing to move!', 'error');
        showResult('switch', 'error');
    } else {
        rmRegexInput.value = rmResult.value;
        rmResult.value = '';
        rmCopyResult.disabled = true;
        showAlert('Moved to input!', '#1c62d4');
        showResult('switch', 'custom', '#1c62d4', 'arrows-alt-v');
    }
}

function runRmRegex() {
    let isValid = true;
    try {
        new RegExp(rmRegex.value, rmFlags.value);
    } catch (error) {
        isValid = false;
    }
    if (rmRegexInput.value.length === 0 || rmRegex.value.length === 0) {
        showAlert('Empty values(s)!', 'error');
        showResult('rm', 'error');
    } else if (!isValid) {
        showAlert('Invalid regex!', 'error');
        showResult('rm', 'error');
    } else {
        const finalRegex = new RegExp(rmRegex.value, rmFlags.value);
        const replace = rmReplace.value
            .replace(/\\a/g, 'a')
            .replace(/\\b/g, '\b')
            .replace(/\\c/g, 'c')
            .replace(/\\e/g, 'e')
            .replace(/\\f/g, '\f')
            .replace(/\\n/g, '\n')
            .replace(/\\o/g, 'o')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\$(\d)/g, '$$$1');
        showResult('rm', 'success');
        rmResult.value = rmRegexInput.value.replace(finalRegex, replace);
        rmCopyResult.disabled = false;
    }
}
