// Emoji parser
function twemojiUpdate() {
    twemoji.parse(document.body, { folder: 'svg', ext: '.svg' });
}

twemojiUpdate();

// Popup alert
function showAlert(text, color) {
    if (color === 'success') color = '#009c3f';
    if (color === 'error') color = '#ff5555';
    Toastify({ text: text, duration: 2000, position: 'center', style: { background: '#333', boxShadow: 'none', minWidth: '150px', textAlign: 'center', fontFamily: '"Source Sans Pro", sans-serif', fontWeight: '600', fontSize: '17px', color: color, padding: '16px 30px' } }).showToast();
}

// Button icon
function showResult(id, type, color = undefined, icon = undefined) {
    const oldElement = document.getElementById(id + '-runResult');
    const newElement = oldElement.cloneNode(true);
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
    const element = document.getElementById(id + '-runResult');
    element.style.color = '';
    element.className = '';
}

// Arrow icons
function updateArrow(id, type, arrowType = 'right') {
    const element = document.getElementById(id + '-arrow');
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
    const oldElement = document.getElementById(button);
    const newElement = oldElement.cloneNode(true);
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
    const oldElement = document.getElementById(button);
    const newElement = oldElement.cloneNode(true);
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
    const oldElement = document.getElementById(button);
    const newElement = oldElement.cloneNode(true);
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
    const currentTime = new Date();
    const fullHours = currentTime.getHours();
    const hours = ((fullHours + 11) % 12) + 1;
    let minutes = currentTime.getMinutes();
    let seconds = currentTime.getSeconds();
    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;

    const timeSuffix = fullHours >= 12 ? 'PM' : 'AM';

    const timeEmoji = fullHours >= 7 && fullHours < 17 ? '<img draggable="false" class="emoji" alt="☀️" src="https://twemoji.maxcdn.com/v/13.1.0/svg/2600.svg">' : '<img draggable="false" class="emoji" alt="🌒" src="https://twemoji.maxcdn.com/v/13.1.0/svg/1f312.svg">';

    const finalTime = `${hours}:${minutes}:${seconds} ${timeSuffix} ${timeEmoji}`;

    if (document.getElementById('time-display').innerHTML !== finalTime) document.getElementById('time-display').innerHTML = finalTime;

    setTimeout(navTime, 100);
}

navTime();

// Navbar resize on scroll
function resizeNav() {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) document.getElementById('navbar').className = 'nav-shrunk';
    else document.getElementById('navbar').className = '';
}

window.addEventListener('scroll', resizeNav);

resizeNav();

// String to HTML
function stringToHTML(str) {
    return new DOMParser().parseFromString(str, 'text/html');
}

// Search Bar
const searchResult = document.querySelector('.search-results');
const searchText = document.querySelector('.search-text');

function matchesKeywords(keywords, input) {
    for (let i = 0; i < keywords.length; i++) {
        if (keywords[i].includes(input)) return true;
    }
    return false;
}

searchText.addEventListener('input', async () => {
    const pages = await (await fetch('/pages')).json();

    const value = searchText.value.toLowerCase();
    const results = [];
    pages.forEach((page) => {
        if (page.title.toLowerCase().includes(value) || page.description.toLowerCase().includes(value) || page.link.toLowerCase().includes(value) || matchesKeywords(page.keywords, value)) {
            results.push(`<tr><td><a href="/${page.link}"><div class="results-title">${page.title}</div><div class="results-description">${page.description}</div></a></td></tr>`);
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
document.addEventListener('keydown', (event) => {
    if (!event.altKey) return;

    if (event.code === 'KeyC') {
        navigator.clipboard.writeText('');
        showAlert('Cleared clipboard!', 'success');
    } else if (event.code === 'KeyH') window.open('/', '_self');
    else if (event.code === 'KeyS') window.open('https://github.com/Eejit43/eejitstools-v2', '_blank');
    else if (event.code === 'Slash' && document.activeElement !== document.querySelector('.search-text')) {
        document.querySelector('.search-text').focus();
        event.preventDefault();
    }
});
