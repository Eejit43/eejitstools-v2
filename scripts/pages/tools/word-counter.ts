import { showAlert } from '../../functions.js';

const input = document.getElementById('input');
const characterDisplay = document.getElementById('character-count');
const wordDisplay = document.getElementById('word-count');
const sentenceDisplay = document.getElementById('sentence-count');
const lineDisplay = document.getElementById('line-count');
const paragraphDisplay = document.getElementById('paragraph-count');

/* Add event listeners */
document.getElementById('input').addEventListener('input', () => {
    characterDisplay.textContent = input.value.length;
    wordDisplay.textContent = input.value.trim()
        ? input.value
              .trim()
              .split(/\s+/)
              .filter((word) => /\w/.test(word)).length
        : 0;
    sentenceDisplay.textContent = input.value.trim()
        ? input.value
              .trim()
              .split(/[.?!]/)
              .filter((sentence) => !/^\s*$/.test(sentence)).length
        : 0;
    lineDisplay.textContent = input.value.trim() ? input.value.trim().split('\n').length : 0;
    paragraphDisplay.textContent = input.value.trim() ? input.value.trim().split('\n\n').length : 0;
});
document.getElementById('reset').addEventListener('click', () => {
    input.value = '';

    characterDisplay.textContent = '0';
    wordDisplay.textContent = '0';
    sentenceDisplay.textContent = '0';
    lineDisplay.textContent = '0';
    paragraphDisplay.textContent = '0';

    showAlert('Reset!', 'success');
});
