import { allPageInfo } from '/data/pages.js';
import { addAnimation, matchesKeywords, showAlert, twemojiUpdate, updateInnerHTML } from '/scripts/functions.js';

const pages = Object.keys(allPageInfo).map((key) => {
    return { title: allPageInfo[key].title, link: allPageInfo[key].link, description: allPageInfo[key].description.replace(/<span.*?>(.*?)<\/span>/g, '$1'), keywords: allPageInfo[key].keywords };
});

twemojiUpdate();

/* Navigation time display */
const timeDisplay = document.getElementById('time-display');
setInterval(() => {
    const currentTime = new Date();

    const timeEmoji = currentTime.getHours() >= 7 && currentTime.getHours() < 17 ? '<img draggable="false" class="emoji" alt="☀️" src="https://twemoji.maxcdn.com/v/13.1.0/svg/2600.svg">' : '<img draggable="false" class="emoji" alt="🌒" src="https://twemoji.maxcdn.com/v/13.1.0/svg/1f312.svg">';

    const finalTime = `${new Date().toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', second: 'numeric' })} ${timeEmoji}`;

    updateInnerHTML(timeDisplay, finalTime);
}, 100);

const navbar = document.getElementById('navbar');

/**
 * Resizes the navigation bar on scroll
 */
function resizeNav() {
    if (document.documentElement.scrollTop > 80) navbar.classList.add('nav-shrunk');
    else navbar.classList.remove('nav-shrunk');
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

const githubUrl = 'https://github.com/Eejit43/eejitstools-v2';

/* Keyboard shortcuts */
document.addEventListener('keydown', (event) => {
    if (!event.altKey) return;
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

    if (event.code === 'KeyK') document.getElementById('shortcuts').style.display = 'block';
    else if (event.code === 'KeyT') window.scrollTo({ top: 0, behavior: 'smooth' });
    else if (event.code === 'KeyC') {
        navigator.clipboard.writeText('');
        showAlert('Cleared clipboard!', 'success');
    } else if (event.code === 'KeyH') window.open('/', '_self');
    else if (event.code === 'KeyS') window.open(githubUrl, '_blank');
    else if (!event.shiftKey && event.code === 'KeyP') {
        const { pathname } = window.location;
        let finalUrl;
        if (pathname === '/') finalUrl = 'views/index.ejs';
        else if (allPageInfo[pathname.replace(/^\/(tools|info|fun)\//, '')]?.link === pathname.replace(/^\//, '')) finalUrl = `views/pages${pathname}.ejs`;
        else finalUrl = 'views/error.ejs';

        window.open(`${githubUrl}/blob/main/${finalUrl}`, '_blank');
    } else if (event.shiftKey && event.code === 'KeyP') {
        const { pathname } = window.location;
        let finalUrl;
        if (pathname === '/') finalUrl = 'public/scripts/global.js';
        else if (allPageInfo[pathname.replace(/^\/(tools|info|fun)\//, '')]?.link === pathname.replace(/^\//, '') && allPageInfo[pathname.replace(/^\/(tools|info|fun)\//, '')]?.script) finalUrl = `public/scripts/pages/${pathname.replace(/^\/(tools|info|fun)\//, '')}.js`;
        else finalUrl = 'public/scripts/global.js';

        window.open(`${githubUrl}/blob/main/${finalUrl}`, '_blank');
    } else if (event.code === 'Slash') {
        document.querySelector('.search-text').focus();
        event.preventDefault();
    }
});

/* Scroll to top button */
document.getElementById('scroll-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* Keyboard shortcuts popup */
const modal = document.getElementById('shortcuts');

document.getElementById('show-shortcuts').addEventListener('click', () => {
    modal.style.display = 'block';
});

document.getElementById('close-shortcuts').addEventListener('click', () => {
    addAnimation('#shortcuts', 'animate-out-top', '').then(() => {
        modal.style.display = 'none';
    });
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        addAnimation('#shortcuts', 'animate-out-top', '').then(() => {
            modal.style.display = 'none';
        });
    }
});

window.addEventListener('keydown', (event) => {
    if (event.code === 'Escape' && modal.style.display === 'block') {
        addAnimation('#shortcuts', 'animate-out-top', '').then(() => {
            modal.style.display = 'none';
        });
    }
});
