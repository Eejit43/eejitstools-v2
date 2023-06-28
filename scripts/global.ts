import { pagesParsed } from '/data/pages.js';
import { addAnimation, showAlert, twemojiUpdate, updateInnerHTML } from '/scripts/functions.js';

twemojiUpdate();

/* Funky logo hover effect */
const logo = document.querySelector('.logo');
logo.addEventListener('mouseover', () => {
    const letters = logo.querySelectorAll('span');
    letters.forEach((letter, index) => {
        const beforeContent = letter.dataset.value;

        let iterations = 0;

        const interval = setInterval(() => {
            letter.textContent = beforeContent
                .split('')
                .map(() => String.fromCharCode(Math.floor(Math.random() * 94) + 33))
                .join('');

            if (iterations >= 10) {
                clearInterval(interval);
                letter.textContent = beforeContent;
            }

            iterations++;
        }, 30 + index * 10);
    });
});

/* Navigation time display */
const timeDisplay = document.getElementById('time-display');
const timeIcon = document.getElementById('time-icon');
setInterval(() => {
    const currentTime = new Date();

    const finalTime = new Date().toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', second: 'numeric' });

    updateInnerHTML(timeDisplay, finalTime);

    const currentHours = currentTime.getHours();

    if (currentHours >= 6 && currentHours < 19 && !timeIcon.classList.contains('fa-sun-bright')) timeIcon.classList = 'fa-solid fa-sun-bright';
    else if ((currentHours >= 19 || currentHours < 6) && !timeIcon.classList.contains('fa-moon-stars')) timeIcon.classList = 'fa-solid fa-moon-stars';
}, 100);

const navbar = document.getElementById('navbar');

/**
 * Resizes the navigation bar on scroll
 */
function resizeNav() {
    if (document.documentElement.scrollTop > 80) navbar.classList.add('nav-shrunk');
    else navbar.classList.remove('nav-shrunk');
}

document.addEventListener('scroll', resizeNav);

resizeNav();

/* Search Bar */
const searchResult = document.querySelector('.search-results');
const searchText = document.querySelector('.search-text');

searchText.addEventListener('input', () => {
    const value = searchText.value.toLowerCase();
    const results = [];
    Object.values(pagesParsed)
        .map((value) => Object.values(value))
        .flat()
        .forEach((page) => {
            if (page.title.toLowerCase().includes(value) || page.id.toLowerCase().includes(value) || page.descriptionParsed.toLowerCase().includes(value) || page.keywords.some((keyword) => keyword.includes(value))) {
                results.push(`<tr><td><a href="${page.link}"><div class="results-title"><i class="fa-regular fa-${page.icon}"></i> ${page.title}</div><div class="results-description">${page.descriptionParsed}</div></a></td></tr>`);
            }
        });
    if (value !== '' && results.length === 0) results.push('<tr><td>No results found!</td></tr>');
    searchResult.innerHTML = value !== '' && results.length > 0 ? `<table><tbody>${results.join('')}</tbody></table>` : '';
});

searchText.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const result = document.querySelector('.search-box .search-results table tbody tr td a.selected') || document.querySelector('.search-box .search-results table tbody tr td a');
        if (result) window.open(result.href, event.metaKey ? '_blank' : '_self');
    } else if (event.key === 'Escape') {
        searchText.value = '';
        searchResult.textContent = '';
        searchText.blur();
    }
});

document.querySelector('.search-button').addEventListener('click', () => searchText.focus());

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        const firstResult = document.querySelector('.search-box .search-results table tbody tr td a');
        if (firstResult) {
            const currentResult = document.querySelector('.search-box .search-results table tbody tr td a.selected');

            const nextTrElement = event.key === 'ArrowUp' ? currentResult?.parentElement.parentElement.previousElementSibling : currentResult?.parentElement.parentElement.nextElementSibling;

            if (nextTrElement) {
                if (currentResult) currentResult.classList.remove('selected');
                nextTrElement.querySelector('td').querySelector('a').classList.add('selected');
            } else if (!currentResult) {
                firstResult.classList.add('selected');
            }

            const selectedResult = document.querySelector('.search-box .search-results table tbody tr td a.selected');
            if (selectedResult) {
                selectedResult.parentElement.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
});

const githubUrl = 'https://github.com/Eejit43/eejitstools-v2';

/* Keyboard shortcuts */
document.addEventListener('keydown', (event) => {
    if (!event.altKey) return;
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.contentEditable === 'true') return;

    if (event.code === 'KeyK') document.getElementById('shortcuts').style.display = 'block';
    else if (event.code === 'KeyT') window.scrollTo({ top: 0, behavior: 'smooth' });
    else if (event.code === 'KeyC') {
        navigator.clipboard.writeText('');
        showAlert('Cleared clipboard!', 'success', 500);
    } else if (event.code === 'KeyH') window.open('/', event.metaKey ? '_blank' : '_self');
    else if (event.code === 'KeyS') window.open(githubUrl, '_blank');
    else if (!event.shiftKey && event.code === 'KeyP') {
        const { pathname } = window.location;
        let finalUrl;
        if (pathname === '/') finalUrl = 'views/index.hbs';
        else if (pathname === '/search') finalUrl = 'views/search.hbs';
        else {
            const category = pathname.split('/')[1];
            const page = pagesParsed[category]?.[pathname.split('/')[2]];

            if (!page) finalUrl = 'views/error.hbs';
            else finalUrl = `views/pages/${category}/${page.id}.hbs`;
        }

        window.open(`${githubUrl}/blob/main/${finalUrl}`, '_blank');
    } else if (event.shiftKey && event.code === 'KeyP') {
        const { pathname } = window.location;
        let finalUrl;
        if (pathname === '/') finalUrl = 'public/scripts/global.js';
        else if (pathname === '/search') finalUrl = 'public/scripts/search.js';
        else {
            const category = pathname.split('/')[1];
            const page = pagesParsed[category]?.[pathname.split('/')[2]];

            if (!page) finalUrl = 'public/scripts/global.js';
            else finalUrl = `public/scripts/pages/${category}/${page.id}.js`;
        }

        window.open(`${githubUrl}/blob/main/${finalUrl}`, '_blank');
    } else if (event.code === 'Slash') {
        event.preventDefault();
        document.querySelector('.search-text').focus();
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
    addAnimation('#shortcuts', 'animate-out-top', '').then(() => (modal.style.display = 'none'));
});

document.addEventListener('click', (event) => {
    if (event.target === modal) addAnimation('#shortcuts', 'animate-out-top', '').then(() => (modal.style.display = 'none'));
});

document.addEventListener('keydown', (event) => {
    if (event.code === 'Escape' && modal.style.display === 'block') {
        addAnimation('#shortcuts', 'animate-out-top', '').then(() => {
            modal.style.display = 'none';
        });
    }
});