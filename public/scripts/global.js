import { twemojiUpdate, matchesKeywords, showAlert } from '/scripts/functions.js';
import { allPageInfo } from '/data/pages.js';

const pages = Object.keys(allPageInfo).map((key) => {
    return { title: allPageInfo[key].title, link: allPageInfo[key].link, description: allPageInfo[key].description.replace(/<span.*?>(.*?)<\/span>/g, '$1'), keywords: allPageInfo[key].keywords };
});

twemojiUpdate();

// Navigation time display
setInterval(() => {
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
}, 100);

/**
 * Resizes the navigation bar on scroll
 */
function resizeNav() {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) document.getElementById('navbar').className = 'nav-shrunk';
    else document.getElementById('navbar').className = '';
}

window.addEventListener('scroll', resizeNav);

resizeNav();

/* Search Bar */
const searchResult = document.querySelector('.search-results');
const searchText = document.querySelector('.search-text');

searchText.addEventListener('input', () => {
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
