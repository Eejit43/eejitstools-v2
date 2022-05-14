import { showAlert, showResult, resetResult, copyValue } from '/scripts/functions.js';

const input = document.getElementById('input');
const toUpperButton = document.getElementById('to-upper');
const toLowerButton = document.getElementById('to-lower');
const toTitleButton = document.getElementById('to-title');
const toSentenceButton = document.getElementById('to-sentence');
const clear = document.getElementById('clear');
const result = document.getElementById('result');
const copyResult = document.getElementById('copy-result');

/* Add event listeners */
toUpperButton.addEventListener('click', toUpper);
toLowerButton.addEventListener('click', toLower);
toTitleButton.addEventListener('click', toTitle);
toSentenceButton.addEventListener('click', toSentence);
clear.addEventListener('click', () => {
    input.value = '';
    result.value = '';
    copyResult.disabled = true;

    clear.disabled = true;
    clear.innerHTML = 'Cleared!';
    showAlert('Cleared!', 'success');
    resetResult('uppercase');
    resetResult('lowercase');
    resetResult('title');
    resetResult('sentence');

    setTimeout(() => {
        copyResult.disabled = true;

        clear.disabled = false;
        clear.innerHTML = 'Clear';
    }, 2000);
});
copyResult.addEventListener('click', () => {
    copyValue(copyResult, result);
});

function toUpper() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('uppercase', 'error');
    } else {
        result.value = input.value.toUpperCase();
        showResult('uppercase', 'success');
        copyResult.disabled = false;
    }
}

function toLower() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('lowercase', 'error');
    } else {
        result.value = input.value.toLowerCase();
        showResult('lowercase', 'success');
        copyResult.disabled = false;
    }
}

function titleCase(str) {
    str = str.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    const lowers = ['A', 'An', 'And', 'As', 'At', 'But', 'By', 'For', 'From', 'If', 'In', 'Into', 'Like', 'Near', 'Nor', 'Of', 'Off', 'On', 'Once', 'Onto', 'Or', 'Over', 'Past', 'So', 'Than', 'That', 'The', 'Till', 'To', 'Up', 'Upon', 'When', 'With', 'Yet'];
    for (let i = 0, j = lowers.length; i < j; i++)
        str = str.replace(new RegExp(`\\s${lowers[i]}\\s`, 'g'), (text) => {
            return text.toLowerCase();
        });

    const uppers = ['Id', 'Tv'];
    for (let i = 0, j = uppers.length; i < j; i++) str = str.replace(new RegExp(`\\b${uppers[i]}\\b`, 'g'), uppers[i].toUpperCase());

    return str;
}

function toTitle() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('title', 'error');
    } else {
        result.value = titleCase(input.value);
        showResult('title', 'success');
        copyResult.disabled = false;
    }
}

function toSentence() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('sentence', 'error');
    } else {
        result.value = input.value
            .toLowerCase()
            .replace(/(^\s*\w|[\.\!\?]\s*\w)/gm, (char) => {
                return char.toUpperCase();
            })
            .replace(/(\s)i(\.|\!|\?|\s|\n|$)/gim, '$1I$2')
            .replace(/(\s)i'm(\.|\!|\?|\s|\n|$)/gim, "$1I'm$2")
            .replace(/(\s)i'd(\.|\!|\?|\s|\n|$)/gim, "$1I'd$2")
            .replace(/(\s)i'll(\.|\!|\?|\s|\n|$)/gim, "$1I'll$2")
            .replace(/(\s)i've(\.|\!|\?|\s|\n|$)/gim, "$1I've$2");
        showResult('sentence', 'success');
        copyResult.disabled = false;
    }
}
