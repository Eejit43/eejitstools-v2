/**
 * Update emojis on the loaded content
 */
function twemojiUpdate() {
    twemoji.parse(document.body, { folder: 'svg', ext: '.svg' });
}

twemojiUpdate();

/**
 * Displays a popup alert
 * @param {string} text The string to display
 * @param {string} color 'success', 'error', or color
 */
function showAlert(text, color) {
    color = color.toLowerCase();
    if (color === 'success') color = '#009c3f';
    if (color === 'error') color = '#ff5555';
    Toastify({ text: text || 'No text specified!', duration: 2000, position: 'center', style: { background: '#333', boxShadow: 'none', minWidth: '150px', textAlign: 'center', fontFamily: '"Source Sans Pro", sans-serif', fontWeight: '600', fontSize: '17px', color: color || '#009c3f', padding: '16px 30px' } }).showToast();
}

/**
 * Updates the icon of the specified element
 * @param {string} id The prefix of the element ID to update
 * @param {string} [type] The type of icon to show ('success' or 'error')
 * @param {string} [color] The color of the icon to show
 * @param {string} [icon] The icon of the icon to show
 */
function showResult(id, type, color = '#009c3f', icon = 'check') {
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
    setTimeout(() => {
        newElement.style.color = '';
        newElement.className = '';
    }, 2000);
}

/**
 * Removes the icon of the specified element
 * @param {string} id The prefix of the element ID to update
 */
function resetResult(id) {
    const element = document.getElementById(id + '-runResult');
    element.style.color = '';
    element.className = '';
}

/**
 * Updates the arrow icon of the specified element
 * @param {HTMLElement} element The element to update
 * @param {string} [type] The type of icon to show ('success', 'error', or 'reset')
 * @param {string} [arrowType='right'] The direction of the arrow (defaults to 'right')
 */
function updateArrow(element, type, arrowType = 'right') {
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

/**
 * Copy an element's value
 * @param {HTMLElement} element The element to update
 * @param {HTMLElement} copyElement The element of the value to be copied
 */
function copyValue(element, copyElement) {
    navigator.clipboard.writeText(copyElement.value);

    const content = element.textContent;

    element.disabled = true;
    element.textContent = 'Copied!';
    showAlert('Copied!', 'success');

    setTimeout(() => {
        element.disabled = false;
        element.textContent = content;
    }, 2000);
}

/**
 * Copy a string
 * @param {HTMLElement} element The element to update
 * @param {string} text The text to copy
 */
function copyText(element, text) {
    navigator.clipboard.writeText(text);

    const content = element.textContent;

    element.disabled = true;
    element.textContent = 'Copied!';
    showAlert('Copied!', 'success');

    setTimeout(() => {
        element.disabled = false;
        element.textContent = content;
    }, 2000);
}

/**
 * Copy a variable
 * @param {HTMLElement} element The element to update
 * @param {string} variable The name of the variable to copy
 */
function copyVar(element, variable) {
    navigator.clipboard.writeText(eval(variable));

    const content = element.textContent;

    element.disabled = true;
    element.textContent = 'Copied!';
    showAlert('Copied!', 'success');

    setTimeout(() => {
        element.disabled = false;
        element.textContent = content;
    }, 2000);
}

/**
 * Escapes HTML syntax in a string
 * @param {string} input String to be modified
 * @returns {string} Formatted string
 */
function escapeHTML(input) {
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

/**
 * Resizes the navigation bar on scroll
 */
function resizeNav() {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) document.getElementById('navbar').className = 'nav-shrunk';
    else document.getElementById('navbar').className = '';
}

window.addEventListener('scroll', resizeNav);

resizeNav();

/**
 * Converts a string to HTML
 * @param {string} string String to convert
 * @returns {Document} HTML
 */
function stringToHTML(string) {
    return new DOMParser().parseFromString(string, 'text/html');
}

/**
 * Whether or not the provided keyword(s) are included in the input
 * @param {string[]} keywords The keyword(s) to check
 * @param {string} string The text to check the keywords against
 * @returns {boolean}
 */
function matchesKeywords(keywords, string) {
    for (let i = 0; i < keywords.length; i++) if (keywords[i].includes(string)) return true;
    return false;
}

/* Search Bar */
const searchResult = document.querySelector('.search-results');
const searchText = document.querySelector('.search-text');

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
        const firstResult = document.querySelector('.search-box .search-results table tbody tr td a');
        if (firstResult) window.open(firstResult.href, '_self');
    }
});

/* Keyboard shortcuts */
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
