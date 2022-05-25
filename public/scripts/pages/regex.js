import { copyValue, resetResult, showAlert, showResult } from '/scripts/functions.js';

const dlrRegexInput = document.getElementById('dlr-regexInput');
const runDlr = document.getElementById('run-dlr');
const dlrResult = document.getElementById('dlr-result');
const dlrClearButton = document.getElementById('dlr-clear');
const dlrCopyResult = document.getElementById('dlr-copy-result');
const wrRegexInput = document.getElementById('wr-regexInput');
const runWr = document.getElementById('run-wr');
const wrResult = document.getElementById('wr-result');
const wrResult2 = document.getElementById('wr-result-2');
const wrResult3 = document.getElementById('wr-result-3');
const wrClearButton = document.getElementById('wr-clear');
const wrCopyResult = document.getElementById('wr-copy-result');
const wrCopyResult2 = document.getElementById('wr-copy-result-2');
const wrCopyResult3 = document.getElementById('wr-copy-result-3');
const rmRegexInput = document.getElementById('rm-regexInput');
const rmRegex = document.getElementById('rm-regex');
const rmFlags = document.getElementById('rm-flags');
const rmReplace = document.getElementById('rm-replace');
const runRm = document.getElementById('run-rm');
const rmResult = document.getElementById('rm-result');
const rmClear = document.getElementById('rm-clear');
const rmClear2 = document.getElementById('rm-clear-2');
const rmSwitchButton = document.getElementById('rm-switch');
const rmCopyResult = document.getElementById('rm-copy-result');

/* Add event listeners */
runDlr.addEventListener('click', runDlrRegex);
dlrClearButton.addEventListener('click', () => {
    dlrRegexInput.value = '';
    dlrResult.value = '';
    dlrCopyResult.disabled = true;

    dlrClearButton.disabled = true;
    dlrClearButton.innerHTML = 'Cleared!';
    showAlert('Cleared!', 'success');
    resetResult('dlr');

    setTimeout(() => {
        dlrCopyResult.disabled = true;

        dlrClearButton.disabled = false;
        dlrClearButton.innerHTML = 'Clear';
    }, 2000);
});
dlrCopyResult.addEventListener('click', () => {
    copyValue(dlrCopyResult, dlrResult);
});
runWr.addEventListener('click', runWrRegex);
wrClearButton.addEventListener('click', () => {
    wrRegexInput.value = '';
    wrResult.value = '';
    wrCopyResult.disabled = true;
    wrResult2.value = '';
    wrCopyResult2.disabled = true;
    wrResult3.value = '';
    wrCopyResult3.disabled = true;

    wrClearButton.disabled = true;
    wrClearButton.innerHTML = 'Cleared!';
    showAlert('Cleared!', 'success');
    resetResult('wr');

    setTimeout(() => {
        wrCopyResult.disabled = true;
        wrCopyResult2.disabled = true;
        wrCopyResult3.disabled = true;

        wrClearButton.disabled = false;
        wrClearButton.innerHTML = 'Clear';
    }, 2000);
});
wrCopyResult.addEventListener('click', () => {
    copyValue(wrCopyResult, wrResult);
});
wrCopyResult2.addEventListener('click', () => {
    copyValue(wrCopyResult2, wrResult2);
});
wrCopyResult3.addEventListener('click', () => {
    copyValue(wrCopyResult3, wrResult3);
});
runRm.addEventListener('click', runRmRegex);
rmClear.addEventListener('click', () => {
    rmRegexInput.value = '';
    rmResult.value = '';
    rmCopyResult.disabled = true;

    rmClear.disabled = true;
    rmClear.innerHTML = 'Cleared!';
    showAlert('Cleared!', 'success');
    resetResult('rm');

    setTimeout(() => {
        rmCopyResult.disabled = true;

        rmClear.disabled = false;
        rmClear.innerHTML = 'Clear Input';
    }, 2000);
});
rmClear2.addEventListener('click', () => {
    rmRegexInput.value = '';
    rmResult.value = '';
    rmCopyResult.disabled = true;
    rmRegex.value = '';
    rmFlags.value = 'g';
    rmReplace.value = '';

    rmClear2.disabled = true;
    rmClear2.innerHTML = 'Cleared!';
    showAlert('Cleared!', 'success');
    resetResult('rm');

    setTimeout(() => {
        rmCopyResult.disabled = true;

        rmClear2.disabled = false;
        rmClear2.innerHTML = 'Clear All';
    }, 2000);
});
rmSwitchButton.addEventListener('click', () => {
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
});
rmCopyResult.addEventListener('click', () => {
    copyValue(rmCopyResult, rmResult);
});
rmRegex.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const newPosition = event.target.selectionStart + 2;
        rmRegex.value = [rmRegex.value.slice(0, event.target.selectionStart), '\\n', rmRegex.value.slice(event.target.selectionStart)].join('');
        rmRegex.setSelectionRange(newPosition, newPosition);
    }
});
rmRegex.addEventListener('paste', (event) => {
    event.preventDefault();
    rmRegex.value += event.clipboardData.getData('text').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
});
rmReplace.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const newPosition = event.target.selectionStart + 2;
        rmReplace.value = [rmReplace.value.slice(0, event.target.selectionStart), '\\n', rmReplace.value.slice(event.target.selectionStart)].join('');
        rmReplace.setSelectionRange(newPosition, newPosition);
    }
});
rmReplace.addEventListener('paste', (event) => {
    event.preventDefault();
    rmReplace.value += event.clipboardData.getData('text').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
});

/**
 * Runs the duplicate line remover regex
 */
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

/**
 * Runs the whitespace remover regex
 */
function runWrRegex() {
    if (wrRegexInput.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('wr', 'error');
    } else {
        showResult('wr', 'success');
        wrResult.value = wrRegexInput.value.replace(/^[ \t]+|[ \t]+$/gm, '');
        wrCopyResult.disabled = false;
        wrResult2.value = wrRegexInput.value.replace(/^[ \t\r\n]+|[ \t]+$/gm, '');
        wrCopyResult2.disabled = false;
        wrResult3.value = wrRegexInput.value.replace(/^[ \t\r\n]+|[ \t\r\n]+$/gm, '');
        wrCopyResult3.disabled = false;
    }
}

/**
 * Runs the regex maker (regex tester) regex
 */
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
