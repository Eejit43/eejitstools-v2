import { showAlert } from '../../functions.js';

const input = document.querySelector<HTMLTextAreaElement>('#input')!;
const characterDisplay = document.querySelector<HTMLSpanElement>('#character-count')!;
const wordDisplay = document.querySelector<HTMLSpanElement>('#word-count')!;
const sentenceDisplay = document.querySelector<HTMLSpanElement>('#sentence-count')!;
const lineDisplay = document.querySelector<HTMLSpanElement>('#line-count')!;
const paragraphDisplay = document.querySelector<HTMLSpanElement>('#paragraph-count')!;
const resetButton = document.querySelector<HTMLButtonElement>('#reset')!;

/* Add event listeners */
input.addEventListener('input', () => {
    characterDisplay.textContent = input.value.length.toString();
    wordDisplay.textContent = input.value.trim()
        ? input.value
              .trim()
              .split(/\s+/)
              .filter((word) => /\w/.test(word))
              .length.toString()
        : '0';
    sentenceDisplay.textContent = input.value.trim()
        ? input.value
              .trim()
              .split(/[!.?]/)
              .filter((sentence) => !/^\s*$/.test(sentence))
              .length.toString()
        : '0';
    lineDisplay.textContent = input.value.trim() ? input.value.trim().split('\n').length.toString() : '0';
    paragraphDisplay.textContent = input.value.trim() ? input.value.trim().split('\n\n').length.toString() : '0';
});
resetButton.addEventListener('click', () => {
    input.value = '';

    characterDisplay.textContent = '0';
    wordDisplay.textContent = '0';
    sentenceDisplay.textContent = '0';
    lineDisplay.textContent = '0';
    paragraphDisplay.textContent = '0';

    showAlert('Reset!', 'success');
});
