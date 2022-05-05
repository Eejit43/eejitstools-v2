let input = document.getElementById('input');
let toUpperButton = document.getElementById('to-upper');
let toLowerButton = document.getElementById('to-lower');
let toTitleButton = document.getElementById('to-title');
let toSentenceButton = document.getElementById('to-sentence');
let clear = document.getElementById('clear');
let result = document.getElementById('result');
let copyResult = document.getElementById('copy-result');

/* Add event listeners */
toUpperButton.addEventListener('click', toUpper);
toLowerButton.addEventListener('click', toLower);
toTitleButton.addEventListener('click', toTitle);
toSentenceButton.addEventListener('click', toSentence);
clear.addEventListener('click', clearAll);
copyResult.addEventListener('click', function () {
    copyValue('result', 'copy-result');
});

let clearMessageTimeout;

function clearAll() {
    copyResult = document.getElementById('copy-result');
    input.value = '';
    result.value = '';
    copyResult.disabled = true;
    showAlert('Cleared!', 'success');
    clear.innerHTML = 'Cleared!';
    clearTimeout(clearMessageTimeout);
    clearMessageTimeout = setTimeout(function () {
        clear.innerHTML = 'Clear';
    }, 2000);
    resetResult('u');
    resetResult('l');
    resetResult('t');
    resetResult('s');
}

function toUpper() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('u', 'error');
    } else {
        result.value = input.value.toUpperCase();
        showResult('u', 'success');
        copyResult.disabled = false;
    }
}

function toLower() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('l', 'error');
    } else {
        result.value = input.value.toLowerCase();
        showResult('l', 'success');
        copyResult.disabled = false;
    }
}

function titleCase(str) {
    let i, j, lowers, uppers;
    str = str.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    lowers = ['A', 'An', 'And', 'As', 'At', 'But', 'By', 'For', 'From', 'If', 'In', 'Into', 'Like', 'Near', 'Nor', 'Of', 'Off', 'On', 'Once', 'Onto', 'Or', 'Over', 'Past', 'So', 'Than', 'That', 'The', 'Till', 'To', 'Up', 'Upon', 'When', 'With', 'Yet'];
    for (i = 0, j = lowers.length; i < j; i++)
        str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), function (txt) {
            return txt.toLowerCase();
        });

    uppers = ['Id', 'Tv'];
    for (i = 0, j = uppers.length; i < j; i++) str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'), uppers[i].toUpperCase());

    return str;
}

function toTitle() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('t', 'error');
    } else {
        result.value = titleCase(input.value);
        showResult('t', 'success');
        copyResult.disabled = false;
    }
}

function toSentence() {
    if (input.value.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('s', 'error');
    } else {
        result.value = input.value
            .toLowerCase()
            .replace(/(^\s*\w|[\.\!\?]\s*\w)/gm, function (c) {
                return c.toUpperCase();
            })
            .replace(/(\s)i(\.|\!|\?|\s|\n|$)/gim, '$1I$2')
            .replace(/(\s)i'm(\.|\!|\?|\s|\n|$)/gim, "$1I'm$2")
            .replace(/(\s)i'd(\.|\!|\?|\s|\n|$)/gim, "$1I'd$2")
            .replace(/(\s)i'll(\.|\!|\?|\s|\n|$)/gim, "$1I'll$2")
            .replace(/(\s)i've(\.|\!|\?|\s|\n|$)/gim, "$1I've$2");
        showResult('s', 'success');
        copyResult.disabled = false;
    }
}
