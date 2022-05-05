let dlrRegexInput = document.getElementById('dlr-regexInput');
let runDlr = document.getElementById('run-dlr');
let dlrResult = document.getElementById('dlr-result');
let dlrResult2 = document.getElementById('dlr-result-2');
let dlrClearButton = document.getElementById('dlr-clear');
let dlrCopyResult = document.getElementById('dlr-copy-result');
let wrRegexInput = document.getElementById('wr-regexInput');
let runWr = document.getElementById('run-wr');
let wrResult = document.getElementById('wr-result');
let wrResult2 = document.getElementById('wr-result-2');
let wrResult3 = document.getElementById('wr-result-3');
let wrClearButton = document.getElementById('wr-clear');
let wrCopyResult = document.getElementById('wr-copy-result');
let wrCopyResult2 = document.getElementById('wr-copy-result-2');
let wrCopyResult3 = document.getElementById('wr-copy-result-3');
let rmRegexInput = document.getElementById('rm-regexInput');
let rmRegex = document.getElementById('rm-regex');
let rmFlags = document.getElementById('rm-flags');
let rmReplace = document.getElementById('rm-replace');
let runRm = document.getElementById('run-rm');
let rmResult = document.getElementById('rm-result');
let rmClear = document.getElementById('rm-clear');
let rmClear2 = document.getElementById('rm-clear-2');
let rmSwitchButton = document.getElementById('rm-switch');
let rmCopyResult = document.getElementById('rm-copy-result');

/* Add event listeners */
runDlr.addEventListener('click', runDlrRegex);
dlrClearButton.addEventListener('click', dlrClear);
dlrCopyResult.addEventListener('click', function () {
    copyValue('dlr-result', 'dlr-copy-result');
});
runWr.addEventListener('click', runWrRegex);
wrClearButton.addEventListener('click', wrClear);
wrCopyResult.addEventListener('click', function () {
    copyValue('wr-result', 'wr-copy-result');
});
wrCopyResult2.addEventListener('click', function () {
    copyValue('wr-result-2', 'wr-copy-result-2');
});
wrCopyResult3.addEventListener('click', function () {
    copyValue('wr-result-3', 'wr-copy-result-3');
});
runRm.addEventListener('click', runRmRegex);
rmClear.addEventListener('click', rmClearInput);
rmClear2.addEventListener('click', rmClearAll);
rmSwitchButton.addEventListener('click', rmSwitch);
rmCopyResult.addEventListener('click', function () {
    copyValue('rm-result', 'rm-copy-result');
});
rmRegex.addEventListener('keyup', function (event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        rmRegex.value += '\\n';
    }
});
rmRegex.addEventListener('paste', function (event) {
    event.preventDefault();
    let content = event.clipboardData.getData('text');
    content = content.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
    rmRegex.value += content;
});
rmReplace.addEventListener('keyup', function (event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        rmReplace.value += '\\n';
    }
});
rmReplace.addEventListener('paste', function (event) {
    event.preventDefault();
    let content = event.clipboardData.getData('text');
    content = content.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
    rmReplace.value += content;
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
        let output = dlrRegexInput.value.replace(/^(.+)$(?=[\s\S]*^(\1)$[\s\S]*)/gm, '');
        showResult('dlr', 'success');
        dlrResult.value = output;
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
    setTimeout(function () {
        wrClearButton.innerHTML = 'Clear';
    }, 2000);
}

function runWrRegex() {
    let input = wrRegexInput.value;
    if (input.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('wr', 'error');
    } else {
        let output = input.replace(/^[ \t]+|[ \t]+$/gm, '');
        let output2 = input.replace(/^[ \t\r\n]+|[ \t]+$/gm, '');
        let output3 = input.replace(/^[ \t\r\n]+|[ \t\r\n]+$/gm, '');
        showResult('wr', 'success');
        wrResult.value = output;
        wrCopyResult.disabled = false;
        wrResult2.value = output2;
        wrCopyResult2.disabled = false;
        wrResult3.value = output3;
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
    setTimeout(function () {
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
    setTimeout(function () {
        rmClear2.innerHTML = 'Clear All';
    }, 2000);
}

function rmSwitch() {
    let output = rmResult.value;
    if (output.length === 0) {
        showAlert('Nothing to move!', 'error');
        showResult('switch', 'error');
    } else {
        rmRegexInput.value = output;
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
    } catch (e) {
        isValid = false;
    }
    if (rmRegexInput.value.length === 0 || rmRegex.value.length === 0) {
        showAlert('Empty values(s)!', 'error');
        showResult('rm', 'error');
    } else if (isValid) {
        let finalregex = new RegExp(rmRegex.value, rmFlags.value);
        let replace = rmReplace.value
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
        let output = rmRegexInput.value.replace(finalregex, replace);
        showResult('rm', 'success');
        rmResult.value = output;
        rmCopyResult.disabled = false;
    } else if (isValid === false) {
        showAlert('Invalid regex!', 'error');
        showResult('rm', 'error');
    }
}
