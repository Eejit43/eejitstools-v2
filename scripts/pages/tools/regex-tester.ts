import { copyValue, resetResult, showAlert, showResult } from '../../functions.js';

const regexInput = document.getElementById('regex-input') as HTMLInputElement;
const flagsInput = document.getElementById('flags-input') as HTMLInputElement;
const replaceInput = document.getElementById('replace-input') as HTMLInputElement;
const textInput = document.getElementById('text-input') as HTMLTextAreaElement;
const runButton = document.getElementById('run-button') as HTMLButtonElement;
const clearButton = document.getElementById('clear-button') as HTMLButtonElement;
const clearAllButton = document.getElementById('clear-all-button') as HTMLButtonElement;
const switchButton = document.getElementById('switch-button') as HTMLButtonElement;
const outputText = document.getElementById('output-text') as HTMLTextAreaElement;
const copyResultButton = document.getElementById('copy-result-button') as HTMLButtonElement;

/* Add event listeners */
[regexInput, replaceInput].forEach((element) =>
    element.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            const oldPosition = (event.target as HTMLInputElement).selectionStart as number;
            const newPosition = oldPosition + 2;
            element.value = [element.value.slice(0, oldPosition), '\\n', element.value.slice(oldPosition)].join('');
            element.setSelectionRange(newPosition, newPosition);
        }
    })
);
[regexInput, replaceInput].forEach((element) =>
    element.addEventListener('paste', (event) => {
        event.preventDefault();
        element.value += event.clipboardData?.getData('text').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
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
clearAllButton.addEventListener('click', () => {
    textInput.value = '';
    outputText.value = '';
    copyResultButton.disabled = true;
    regexInput.value = '';
    flagsInput.value = 'g';
    replaceInput.value = '';

    clearAllButton.disabled = true;
    clearAllButton.innerHTML = 'Cleared!';
    showAlert('Cleared!', 'success');
    resetResult('regex');

    setTimeout(() => {
        copyResultButton.disabled = true;

        clearAllButton.disabled = false;
        clearAllButton.innerHTML = 'Clear All';
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
        showResult('switch', null, '#1c62d4', 'arrows-alt-v');
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
    } catch {
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
        const replace = JSON.parse(`"${replaceInput.value.replace(/"/g, '\\"')}"`) as string;
        showResult('regex', 'success');
        outputText.value = textInput.value.replace(finalRegex, replace);
        copyResultButton.disabled = false;
    }
}
