import { showAlert } from '../../functions.js';

const input = document.getElementById('input') as HTMLTextAreaElement;
const characterDisplay = document.getElementById('character-count') as HTMLSpanElement;
const wordDisplay = document.getElementById('word-count') as HTMLSpanElement;
const sentenceDisplay = document.getElementById('sentence-count') as HTMLSpanElement;
const lineDisplay = document.getElementById('line-count') as HTMLSpanElement;
const paragraphDisplay = document.getElementById('paragraph-count') as HTMLSpanElement;
const resetButton = document.getElementById('reset') as HTMLButtonElement;

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
              .split(/[.?!]/)
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
