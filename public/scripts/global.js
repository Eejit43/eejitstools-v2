// Emoji parser
function twemojiUpdate() {
    twemoji.parse(document.body, {
        folder: 'svg',
        ext: '.svg',
    });
}

twemojiUpdate();

// Popup alert
function showAlert(text, color) {
    if (color === 'success') color = '#009c3f';
    if (color === 'error') color = '#ff5555';
    Toastify({
        text: text,
        duration: 2000,
        position: 'center',
        style: {
            background: '#333',
            boxShadow: 'none',
            minWidth: '150px',
            textAlign: 'center',
            fontFamily: '"Source Sans Pro", sans-serif',
            fontWeight: '600',
            fontSize: '17px',
            color: color,
            padding: '16px 30px',
        },
    }).showToast();
}

// Button icon
function showResult(id, type, color = undefined, icon = undefined) {
    let oldElement = document.getElementById(id + '-runResult');
    let newElement = oldElement.cloneNode(true);
    oldElement.parentNode.replaceChild(newElement, oldElement);
    if (type === 'success') {
        color = '#009c3f';
        icon = 'check';
    } else if (type === 'error') {
        color = '#ff5555';
        icon = 'xmark';
    }
    newElement.style.color = color;
    newElement.className = 'fa-solid fa-' + icon;
    setTimeout(function () {
        newElement.style.color = '';
        newElement.className = '';
    }, 2000);
}

function resetResult(id) {
    let element = document.getElementById(id + '-runResult');
    element.style.color = '';
    element.className = '';
}

// Arrow icons
function updateArrow(id, type, arrowType = 'right') {
    let element = document.getElementById(id + '-arrow');
    if (type === 'success') {
        color = '#009c3f';
        icon = `arrow-${arrowType}`;
    } else if (type === 'error') {
        color = '#ff5555';
        icon = 'xmark';
    } else if (type === 'reset') {
        color = 'dimgray';
        icon = `arrow-${arrowType}`;
    }
    element.style.color = color;
    element.className = 'fa-solid fa-' + icon;
}

// Copy text
function copyValue(toCopy, button) {
    let oldElement = document.getElementById(button);
    let newElement = oldElement.cloneNode(true);
    oldElement.parentNode.replaceChild(newElement, oldElement);
    const element = document.getElementById(toCopy);
    navigator.clipboard.writeText(element.value);
    newElement.innerHTML = 'Copied!';
    setTimeout(function () {
        newElement.innerHTML = 'Copy';
    }, 2000);
    showAlert('Copied!', 'success');

    newElement.addEventListener('click', function () {
        copyValue(toCopy, button);
    });
}

function copyText(button, text) {
    let oldElement = document.getElementById(button);
    let newElement = oldElement.cloneNode(true);
    oldElement.parentNode.replaceChild(newElement, oldElement);
    navigator.clipboard.writeText(text);
    newElement.innerHTML = 'Copied!';
    setTimeout(function () {
        newElement.innerHTML = 'Copy';
    }, 2000);
    showAlert('Copied!', 'success');

    newElement.addEventListener('click', function () {
        copyText(button, text);
    });
}

function copyVar(variable, button, message) {
    let oldElement = document.getElementById(button);
    let newElement = oldElement.cloneNode(true);
    oldElement.parentNode.replaceChild(newElement, oldElement);
    navigator.clipboard.writeText(eval(variable));
    newElement.innerHTML = 'Copied!';
    setTimeout(function () {
        newElement.innerHTML = message;
    }, 2000);
    showAlert('Copied!', 'success');

    newElement.addEventListener('click', function () {
        copyVar(variable, button, message);
    });
}

// Escape html
function escapeHtml(input) {
    return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// Navigation time display
function navTime() {
    let currentTime = new Date();
    let fullHours = currentTime.getHours();
    let hours = ((fullHours + 11) % 12) + 1;
    let minutes = currentTime.getMinutes();
    let sec = currentTime.getSeconds();
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (sec < 10) {
        sec = '0' + sec;
    }

    let timeSuffix = fullHours >= 12 ? 'PM' : 'AM';

    let timeEmoji = fullHours >= 7 && fullHours < 17 ? '<img draggable="false" class="emoji" alt="☀️" src="https://twemoji.maxcdn.com/v/13.1.0/svg/2600.svg">' : '<img draggable="false" class="emoji" alt="🌒" src="https://twemoji.maxcdn.com/v/13.1.0/svg/1f312.svg">'; // prettier-ignore

    let finalTime = `${hours}:${minutes}:${sec} ${timeSuffix} ${timeEmoji}`;

    if (document.getElementById('time-display').innerHTML !== finalTime) {
        document.getElementById('time-display').innerHTML = finalTime;
    }

    setTimeout(navTime, 100);
}

navTime();

// Navbar resize on scroll
function resizeNav() {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        document.getElementById('navbar').className = 'nav-shrunk';
    } else {
        document.getElementById('navbar').className = '';
    }
}

window.onscroll = function () {
    resizeNav();
};

resizeNav();

// String to HTML (modified from https://gomakethings.com/converting-a-string-into-markup-with-vanilla-js/)
const DOMParserSupported = (function () {
    if (!window.DOMParser) return false;
    var parser = new DOMParser();
    try {
        parser.parseFromString('x', 'text/html');
    } catch (err) {
        return false;
    }
    return true;
})();

function stringToHTML(str) {
    if (DOMParserSupported) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(str, 'text/html');
        return doc;
    } else {
        const dom = document.createElement('div');
        dom.innerHTML = str;
        return dom;
    }
}

// Search Bar
const searchResult = document.querySelector('.search-results');
const searchText = document.querySelector('.search-text');

let pages = [];

function matchesKeywords(keywords, input) {
    for (let i = 0; i < keywords.length; i++) {
        if (keywords[i].includes(input)) return true;
    }
    return false;
}

fetch('/')
    .then((response) => {
        return response.text();
    })
    .then((pre_html) => {
        html = stringToHTML(pre_html);
        let rows = html.querySelectorAll('tr');
        for (let i = 0; i < rows.length; i++) {
            const outerHTML = html.querySelectorAll('tr')[i].outerHTML;
            const title = outerHTML.match(/<\/(i|span)> .*?<\/a>/g)[0].replace(/<\/(i|span|a)> ?/g, ''); // prettier-ignore
            const link = outerHTML.match(/href=".*?"><(i|span)/g)[0].replace(/(href="|"><(i|span))/g, ''); // prettier-ignore
            const description = outerHTML.match(/<td>.*?<\/td>/g)[0].replace(/<\/?td>/g, '').replace(/<span.*?>(.*?)<\/span>/g, '$1'); // prettier-ignore
            const keywords = outerHTML.match(/data-keywords=".*?"/g)[0].replace(/data-keywords="(.*?)"/g, '$1').toLowerCase().split(', '); // prettier-ignore
            pages.push({ title: title, description: description, link: link, keywords: keywords });
        }
    });

searchText.addEventListener('input', () => {
    const value = searchText.value.toLowerCase();
    const results = [];
    pages.forEach((page) => {
        if (page.title.toLowerCase().includes(value) || page.description.toLowerCase().includes(value) || page.link.toLowerCase().includes(value) || matchesKeywords(page.keywords, value)) {
            results.push(`<tr><td><a href="${page.link}"><div class="results-title">${page.title}</div><div class="results-description">${page.description}</div></a></td></tr>`);
        }
    });
    if (value !== '' && results.length === 0) results.push('<tr><td>No results found!</td></tr>');
    searchResult.innerHTML = value !== '' && results.length > 0 ? `<table><tbody>${results.join('')}</tbody></table>` : '';
});

searchText.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        try {
            window.open(document.querySelector('.search-box .search-results table tbody tr td a').href, '_self');
        } catch (err) {}
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', runKeyboardShortcut);

function runKeyboardShortcut(event) {
    if (event.altKey && event.code === 'KeyC') {
        navigator.clipboard.writeText('');
        showAlert('Cleared clipboard!', 'success');
    } else if (event.altKey && event.code === 'KeyH') {
        window.open('/', '_self');
    } else if (event.altKey && event.code === 'KeyS') {
        window.open('https://github.com/Eejit43/eejitstools-v2', '_blank');
    } else if (event.altKey && event.code === 'Slash' && document.querySelector('.search-text') !== document.activeElement) {
        document.querySelector('.search-text').focus();
        event.preventDefault();
    }
}
