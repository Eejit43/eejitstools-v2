import { copyValue, resetResult, showAlert, showResult } from '/scripts/functions.js';

const regexInput = document.getElementById('regex-input');
const flagsInput = document.getElementById('flags-input');
const replaceInput = document.getElementById('replace-input');
const textInput = document.getElementById('text-input');
const runButton = document.getElementById('run-button');
const clearButton = document.getElementById('clear-button');
const clearAllInput = document.getElementById('clear-all-button');
const switchButton = document.getElementById('switch-button');
const outputText = document.getElementById('output-text');
const copyResultButton = document.getElementById('copy-result-button');

/* Add event listeners */
[regexInput, replaceInput].forEach((element) =>
    element.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            const newPosition = event.target.selectionStart + 2;
            element.value = [element.value.slice(0, event.target.selectionStart), '\\n', element.value.slice(event.target.selectionStart)].join('');
            element.setSelectionRange(newPosition, newPosition);
        }
    })
);
[regexInput, replaceInput].forEach((element) =>
    element.addEventListener('paste', (event) => {
        event.preventDefault();
        element.value += event.clipboardData.getData('text').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
    })
);
runButton.addEventListener('click', runRegexTester);
clearButton.addEventListener('click', () => {
    textInput.value = '';
    outputText.value = '';
    copyResultButton.disabled = true;

    clearButton.disabled = true;
    clearButton.innerHTML = 'Cleared!';
    showAlert('Cleared!', 'success');
    resetResult('regex');

    setTimeout(() => {
        copyResultButton.disabled = true;

        clearButton.disabled = false;
        clearButton.innerHTML = 'Clear Input';
    }, 2000);
});
clearAllInput.addEventListener('click', () => {
    textInput.value = '';
    outputText.value = '';
    copyResultButton.disabled = true;
    regexInput.value = '';
    flagsInput.value = 'g';
    replaceInput.value = '';

    clearAllInput.disabled = true;
    clearAllInput.innerHTML = 'Cleared!';
    showAlert('Cleared!', 'success');
    resetResult('regex');

    setTimeout(() => {
        copyResultButton.disabled = true;

        clearAllInput.disabled = false;
        clearAllInput.innerHTML = 'Clear All';
    }, 2000);
});
switchButton.addEventListener('click', () => {
    if (outputText.value.length === 0) {
        showAlert('Nothing to move!', 'error');
        showResult('switch', 'error');
    } else {
        textInput.value = outputText.value;
        outputText.value = '';
        copyResultButton.disabled = true;
        showAlert('Moved to input!', '#1c62d4');
        showResult('switch', 'custom', '#1c62d4', 'arrows-alt-v');
    }
});
copyResultButton.addEventListener('click', () => copyValue(copyResultButton, outputText));

/**
 * Runs the regex tester
 */
function runRegexTester() {
    let isValid = true;
    try {
        new RegExp(regexInput.value, flagsInput.value);
    } catch (error) {
        isValid = false;
    }
    if (textInput.value.length === 0 || regexInput.value.length === 0) {
        showAlert('Empty values(s)!', 'error');
        showResult('regex', 'error');
    } else if (!isValid) {
        showAlert('Invalid regex!', 'error');
        showResult('regex', 'error');
    } else {
        const finalRegex = new RegExp(regexInput.value, flagsInput.value);
        const replace = JSON.parse(`"${replaceInput.value.replaceAll('"', '\\"')}"`);
        showResult('regex', 'success');
        outputText.value = textInput.value.replace(finalRegex, replace);
        copyResultButton.disabled = false;
    }
}
