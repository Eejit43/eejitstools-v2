let input = document.getElementById('input');

let characterDisplay = document.getElementById('character-count');
let wordDisplay = document.getElementById('word-count');
let sentenceDisplay = document.getElementById('sentence-count');
let lineDisplay = document.getElementById('line-count');
let paragraphDisplay = document.getElementById('paragraph-count');

let characterCount, wordCount, sentenceCount, lineCount, paragraphCount;

/* Add event listeners */
document.getElementById('input').addEventListener('input', updateValues);
document.getElementById('reset').addEventListener('click', reset);

function updateValues() {
    characterCount = input.value.length;
    wordCount = input.value.trim()
        ? input.value
              .trim()
              .split(/\s+/)
              .filter((word) => /\w/.test(word)).length
        : 0;
    sentenceCount = input.value.trim()
        ? input.value
              .trim()
              .split(/[.?!]/)
              .filter((sentence) => !/^\s*$/.test(sentence)).length
        : 0;
    lineCount = input.value.trim() ? input.value.trim().split('\n').length : 0;
    paragraphCount = input.value.trim() ? input.value.trim().split('\n\n').length : 0;

    characterDisplay.innerHTML = characterCount;
    wordDisplay.innerHTML = wordCount;
    sentenceDisplay.innerHTML = sentenceCount;
    lineDisplay.innerHTML = lineCount;
    paragraphDisplay.innerHTML = paragraphCount;
}

function reset() {
    input.value = '';

    characterDisplay.innerHTML = '0';
    wordDisplay.innerHTML = '0';
    sentenceDisplay.innerHTML = '0';
    lineDisplay.innerHTML = '0';
    paragraphDisplay.innerHTML = '0';

    showAlert('Reset!', 'success');
}
