import { allPages } from '../data/pages.js';
import { addAnimation, showAlert, twemojiUpdate, updateInnerHtml } from './functions.js';

twemojiUpdate();

/* Funky logo hover effect */
const logo = document.querySelector<HTMLSpanElement>('.logo')!;
logo.addEventListener('mouseover', () => {
    const letters = logo.querySelectorAll('span');
    for (const [index, letter] of letters.entries()) {
        const contentBefore = letter.dataset.value!;

        let iterations = 0;

        const interval = setInterval(
            () => {
                letter.textContent = [...contentBefore].map(() => String.fromCodePoint(Math.floor(Math.random() * 94) + 33)).join('');

                if (iterations >= 10) {
                    clearInterval(interval);
                    letter.textContent = contentBefore;
                }

                iterations++;
            },
            30 + index * 10,
        );
    }
});

/* Navigation time display */
const timeDisplay = document.querySelector<HTMLSpanElement>('#time-display')!;
const timeIcon = document.querySelector('#time-icon')!;
setInterval(() => {
    const currentTime = new Date();

    const finalTime = new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric', second: 'numeric' });

    updateInnerHtml(timeDisplay, finalTime);

    const currentHours = currentTime.getHours();

    if (timeIcon.classList.contains('fa-triangle-exclamation')) timeIcon.classList.remove('fa-triangle-exclamation');

    if (currentHours >= 6 && currentHours < 19 && !timeIcon.classList.contains('fa-sun-bright')) {
        timeIcon.classList.remove('fa-moon-stars');
        timeIcon.classList.add('fa-sun-bright');
    } else if ((currentHours >= 19 || currentHours < 6) && !timeIcon.classList.contains('fa-moon-stars')) {
        timeIcon.classList.remove('fa-sun-bright');
        timeIcon.classList.add('fa-moon-stars');
    }
}, 100);

const navbar = document.querySelector('nav')!;

/**
 * Resizes the navigation bar on scroll.
 */
function resizeNav() {
    if (document.documentElement.scrollTop > 80) navbar.classList.add('nav-shrunk');
    else navbar.classList.remove('nav-shrunk');
}

document.addEventListener('scroll', resizeNav);

resizeNav();

/* Search Bar */
const searchResult = document.querySelector<HTMLDivElement>('.search-results')!;
const searchInput = document.querySelector<HTMLInputElement>('.search-text')!;

searchInput.addEventListener('input', () => {
    const value = searchInput.value.toLowerCase();
    const results = [];
    for (const page of Object.values(allPages).flatMap((value) => Object.values(value)))
        if (
            page.title.toLowerCase().includes(value) ||
            page.id.toLowerCase().includes(value) ||
            page.descriptionParsed.toLowerCase().includes(value) ||
            page.keywords.some((keyword) => keyword.includes(value))
        )
            results.push(
                `<tr><td><a href="${page.link}"><div class="results-title"><i class="fa-regular fa-${page.icon}"></i> ${page.title}</div><div class="results-description">${page.descriptionParsed}</div></a></td></tr>`,
            );

    if (value !== '' && results.length === 0) results.push('<tr><td>No results found!</td></tr>');
    searchResult.innerHTML = value !== '' && results.length > 0 ? `<table><tbody>${results.join('')}</tbody></table>` : '';
});

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const result =
            document.querySelector<HTMLAnchorElement>('.search-box .search-result-selected') ??
            document.querySelector<HTMLAnchorElement>('.search-box a');
        if (result) window.open(result.href, event.metaKey ? '_blank' : '_self');
    } else if (event.key === 'Escape') {
        searchInput.value = '';
        searchResult.textContent = '';
        searchInput.blur();
    }
});

document.querySelector('.search-button')!.addEventListener('click', () => {
    searchInput.focus();
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        const firstResult = document.querySelector('.search-box a');
        if (firstResult) {
            const currentResult = document.querySelector('.search-box .search-result-selected');

            const nextTrElement = currentResult
                ? event.key === 'ArrowUp'
                    ? currentResult.parentElement!.parentElement!.previousElementSibling
                    : currentResult.parentElement!.parentElement!.nextElementSibling
                : null;

            if (nextTrElement) {
                if (currentResult) currentResult.classList.remove('search-result-selected');
                nextTrElement.querySelector('td a')!.classList.add('search-result-selected');
            } else if (!currentResult) firstResult.classList.add('search-result-selected');

            const selectedResult = document.querySelector('.search-box .search-result-selected');
            if (selectedResult) selectedResult.parentElement!.parentElement!.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

const githubUrl = 'https://github.com/Eejit43/eejitstools-v2';

/* Keyboard shortcuts */
document.addEventListener('keydown', (event) => {
    if (!event.altKey) return;
    if (
        document.activeElement &&
        (document.activeElement.tagName === 'INPUT' ||
            document.activeElement.tagName === 'TEXTAREA' ||
            (document.activeElement as HTMLElement).contentEditable === 'plaintext-only')
    )
        return;

    switch (event.code) {
        case 'KeyK': {
            shortcutsModal.style.display = 'block';
            break;
        }
        case 'KeyT': {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            break;
        }
        case 'KeyC': {
            void navigator.clipboard.writeText('');
            showAlert('Cleared clipboard!', 'success', 500);
            break;
        }
        case 'KeyH': {
            window.open('/', event.metaKey ? '_blank' : '_self');
            break;
        }
        case 'KeyS': {
            window.open(githubUrl, '_blank');
            break;
        }
        default: {
            if (!event.shiftKey && event.code === 'KeyP') {
                const { pathname } = window.location;
                let finalUrl;
                if (pathname === '/') finalUrl = 'src/views/index.hbs';
                else if (pathname === '/search') finalUrl = 'src/views/search.hbs';
                else {
                    const [, category, rawPage] = pathname.split('/');
                    const page = category in allPages ? allPages[category][rawPage] : undefined;

                    finalUrl = page ? `src/views/pages/${category}/${page.id}.hbs` : 'src/views/error.hbs';
                }

                window.open(`${githubUrl}/blob/main/${finalUrl}`, '_blank');
            } else if (event.shiftKey && event.code === 'KeyP') {
                const { pathname } = window.location;
                let finalUrl;
                if (pathname === '/') finalUrl = 'src/public/scripts/global.ts';
                else if (pathname === '/search') finalUrl = 'src/public/scripts/search.ts';
                else {
                    const [, category, rawPage] = pathname.split('/');
                    const page = category in allPages ? allPages[category][rawPage] : undefined;

                    finalUrl = page ? `src/public/scripts/pages/${category}/${page.id}.ts` : 'src/public/scripts/global.ts';
                }

                window.open(`${githubUrl}/blob/main/${finalUrl}`, '_blank');
            } else if (event.code === 'Slash') {
                event.preventDefault();
                searchInput.focus();
            }
        }
    }
});

/* Scroll to top button */
document.querySelector('#scroll-to-top')!.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* Keyboard shortcuts popup */
const shortcutsModal = document.querySelector<HTMLDivElement>('#shortcuts')!;

document.querySelector('#show-shortcuts')!.addEventListener('click', () => {
    shortcutsModal.style.display = 'block';
});

document.querySelector('#close-shortcuts')!.addEventListener('click', () => {
    void addAnimation(shortcutsModal, 'animate-out-top').then(() => (shortcutsModal.style.display = 'none'));
});

document.addEventListener('click', (event) => {
    if (event.target === shortcutsModal)
        void addAnimation(shortcutsModal, 'animate-out-top').then(() => (shortcutsModal.style.display = 'none'));
});

document.addEventListener('keydown', (event) => {
    if (event.code === 'Escape' && shortcutsModal.style.display === 'block')
        void addAnimation(shortcutsModal, 'animate-out-top').then(() => (shortcutsModal.style.display = 'none'));
});
