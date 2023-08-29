import { copyValue, showAlert, showResult } from '../../functions.js';

const input = document.querySelector('#input') as HTMLTextAreaElement;
const toUpperButton = document.querySelector('#to-upper') as HTMLButtonElement;
const toLowerButton = document.querySelector('#to-lower') as HTMLButtonElement;
const toTitleButton = document.querySelector('#to-title') as HTMLButtonElement;
const toSentenceButton = document.querySelector('#to-sentence') as HTMLButtonElement;
const clearButton = document.querySelector('#clear') as HTMLButtonElement;
const result = document.querySelector('#result') as HTMLTextAreaElement;
const copyResultButton = document.querySelector('#copy-result') as HTMLButtonElement;

/* Add event listeners */
toUpperButton.addEventListener('click', toUpper);
toLowerButton.addEventListener('click', toLower);
toTitleButton.addEventListener('click', toTitle);
toSentenceButton.addEventListener('click', toSentence);
clearButton.addEventListener('click', () => {
    input.value = '';
    result.value = '';
    copyResultButton.disabled = true;

    clearButton.disabled = true;
    clearButton.textContent = 'Cleared!';
    showAlert('Cleared!', 'success');

    setTimeout(() => {
        copyResultButton.disabled = true;

        clearButton.disabled = false;
        clearButton.textContent = 'Clear';
    }, 2000);
});
copyResultButton.addEventListener('click', () => {
    copyValue(copyResultButton, result);
});

/**
 * Converts the provided string to uppercase and displays the result.
 */
function toUpper() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'warning');
        showResult(toUpperButton, 'warning');
    } else {
        result.value = input.value.toUpperCase();
        showResult(toUpperButton, 'success');
        copyResultButton.disabled = false;
    }
}

/**
 * Converts the provided string to lowercase and displays the result.
 */
function toLower() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'warning');
        showResult(toLowerButton, 'warning');
    } else {
        result.value = input.value.toLowerCase();
        showResult(toLowerButton, 'success');
        copyResultButton.disabled = false;
    }
}

const lowercaseWords = [
    'A',
    'An',
    'And',
    'As',
    'At',
    'But',
    'By',
    'For',
    'From',
    'If',
    'In',
    'Into',
    'Like',
    'Near',
    'Nor',
    'Of',
    'Off',
    'On',
    'Once',
    'Onto',
    'Or',
    'Over',
    'Past',
    'So',
    'Than',
    'That',
    'The',
    'Till',
    'To',
    'Up',
    'Upon',
    'When',
    'With',
    'Yet',
];
const uppercaseWords = ['Id', 'Tv'];

/**
 * Converts the provided string to title case.
 * @param string The string to convert.
 */
function titleCase(string: string) {
    string = string.replaceAll(/([^\W_]+[^\s-]*) */g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
    });

    for (const word of lowercaseWords) string = string.replaceAll(new RegExp(`\\s${word}\\s`, 'g'), (text) => text.toLowerCase());

    for (const word of uppercaseWords) string = string.replaceAll(new RegExp(`\\b${word}\\b`, 'g'), word.toUpperCase());

    return string;
}

/**
 * Converts the provided string to title case and displays the result.
 */
function toTitle() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'warning');
        showResult(toTitleButton, 'warning');
    } else {
        result.value = titleCase(input.value);
        showResult(toTitleButton, 'success');
        copyResultButton.disabled = false;
    }
}

/**
 * Converts the provided string to sentence case and displays the result.
 */
function toSentence() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'warning');
        showResult(toSentenceButton, 'warning');
    } else {
        result.value = input.value
            .toLowerCase()
            .replaceAll(/(^\s*\w|[!.?]\s*\w)/gm, (char) => {
                return char.toUpperCase();
            })
            .replaceAll(/(\s)i(\.|!|\?|\s|\n|$)/gim, '$1I$2')
            .replaceAll(/(\s)i'm(\.|!|\?|\s|\n|$)/gim, "$1I'm$2")
            .replaceAll(/(\s)i'd(\.|!|\?|\s|\n|$)/gim, "$1I'd$2")
            .replaceAll(/(\s)i'll(\.|!|\?|\s|\n|$)/gim, "$1I'll$2")
            .replaceAll(/(\s)i've(\.|!|\?|\s|\n|$)/gim, "$1I've$2");
        showResult(toSentenceButton, 'success');
        copyResultButton.disabled = false;
    }
}
