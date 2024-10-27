import { copyValue, showAlert, showResult } from '../../functions.js';

const regexInput = document.querySelector<HTMLInputElement>('#regex-input')!;
const flagsInput = document.querySelector<HTMLInputElement>('#flags-input')!;
const replaceInput = document.querySelector<HTMLInputElement>('#replace-input')!;
const textInput = document.querySelector<HTMLTextAreaElement>('#text-input')!;
const runButton = document.querySelector<HTMLButtonElement>('#run-button')!;
const clearButton = document.querySelector<HTMLButtonElement>('#clear-button')!;
const clearAllButton = document.querySelector<HTMLButtonElement>('#clear-all-button')!;
const switchButton = document.querySelector<HTMLButtonElement>('#switch-button')!;
const outputText = document.querySelector<HTMLTextAreaElement>('#output-text')!;
const copyResultButton = document.querySelector<HTMLButtonElement>('#copy-result-button')!;

/* Add event listeners */
for (const element of [regexInput, replaceInput])
    element.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            const oldPosition = (event.target as HTMLInputElement).selectionStart!;
            const newPosition = oldPosition + 2;
            element.value = [element.value.slice(0, oldPosition), '\\n', element.value.slice(oldPosition)].join('');
            element.setSelectionRange(newPosition, newPosition);
        }
    });
for (const element of [regexInput, replaceInput])
    element.addEventListener('paste', (event) => {
        event.preventDefault();

        const text = event.clipboardData!.getData('text/plain').replaceAll('\n', '\\n').replaceAll('\r', '\\r');

        const range = document.getSelection()!.getRangeAt(0);
        range.deleteContents();

        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.selectNodeContents(textNode);
        range.collapse(false);

        const selection = document.getSelection()!;
        selection.removeAllRanges();
        selection.addRange(range);
    });
runButton.addEventListener('click', runRegexTester);
clearButton.addEventListener('click', () => {
    textInput.value = '';
    outputText.value = '';
    copyResultButton.disabled = true;

    clearButton.disabled = true;
    clearButton.innerHTML = 'Cleared!';
    showAlert('Cleared!', 'success');

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

    setTimeout(() => {
        copyResultButton.disabled = true;

        clearAllButton.disabled = false;
        clearAllButton.innerHTML = 'Clear All';
    }, 2000);
});
switchButton.addEventListener('click', () => {
    if (outputText.value.length === 0) {
        showAlert('Nothing to move!', 'warning');
        showResult(switchButton, 'warning');
    } else {
        textInput.value = outputText.value;
        outputText.value = '';
        copyResultButton.disabled = true;
        showAlert('Moved to input!', 'success');
        showResult(switchButton, 'success');
    }
});
copyResultButton.addEventListener('click', () => copyValue(copyResultButton, outputText));

/**
 * Runs the regex tester.
 */
function runRegexTester() {
    let regex: RegExp | null = null;
    let replacer: string | null = null;

    try {
        regex = new RegExp(regexInput.value, flagsInput.value);
        replacer = JSON.parse(`"${replaceInput.value.replaceAll('"', '\\"')}"`) as string;
    } catch {} // eslint-disable-line no-empty

    if (textInput.value.length === 0 || regexInput.value.length === 0) {
        showAlert('Empty values(s)!', 'warning');
        showResult(runButton, 'warning');
    } else if (regex && replacer !== null) {
        showResult(runButton, 'success');
        outputText.value = textInput.value.replace(regex, replacer);
        copyResultButton.disabled = false;
    } else {
        showAlert(`Invalid ${regex ? 'replacer' : 'regex'}!`, 'error');
        showResult(runButton, 'error');
    }
}
