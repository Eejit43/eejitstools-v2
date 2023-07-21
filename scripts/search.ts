import { allPages } from '../data/pages.js';

const searchResult = document.querySelector('.large-search-results') as HTMLDivElement;
const searchInput = document.querySelector('.large-search-text') as HTMLInputElement;

searchInput.addEventListener('input', () => {
    const value = searchInput.value.toLowerCase();
    const results = [];
    for (const page of Object.values(allPages).flatMap((value) => Object.values(value))) if (page.title.toLowerCase().includes(value) || page.id.toLowerCase().includes(value) || page.descriptionParsed.toLowerCase().includes(value) || page.keywords.some((keyword) => keyword.includes(value))) results.push(`<tr><td><a href="${page.link}"><div class="results-title"><i class="fa-regular fa-${page.icon}"></i> ${page.title}</div><div class="results-description">${page.descriptionParsed}</div></a></td></tr>`);

    if (value !== '' && results.length === 0) results.push('<tr><td>No results found!</td></tr>');
    searchResult.innerHTML = value !== '' && results.length > 0 ? `<table><tbody>${results.join('')}</tbody></table>` : '';
});

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const result = (document.querySelector('.large-search-box .large-search-results table tbody tr td a.selected') ?? document.querySelector('.large-search-box .large-search-results table tbody tr td a')) as HTMLAnchorElement | null;
        if (result) window.open(result.href, event.metaKey ? '_blank' : '_self');
    } else if (event.key === 'Escape') {
        searchInput.value = '';
        searchResult.innerHTML = '';
        searchInput.blur();
    }
});

document.querySelector('.large-search-button')!.addEventListener('click', () => searchInput.focus());

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        const firstResult = document.querySelector('.large-search-box .large-search-results table tbody tr td a');
        if (firstResult) {
            const currentResult = document.querySelector('.large-search-box .large-search-results table tbody tr td a.selected');

            const nextTrElement = currentResult ? (event.key === 'ArrowUp' ? currentResult.parentElement!.parentElement!.previousElementSibling : currentResult.parentElement!.parentElement!.nextElementSibling) : null;

            if (nextTrElement) {
                if (currentResult) currentResult.classList.remove('selected');
                nextTrElement.querySelector('td a')!.classList.add('selected');
            } else if (!currentResult) firstResult.classList.add('selected');

            const selectedResult = document.querySelector('.large-search-box .large-search-results table tbody tr td a.selected');
            if (selectedResult) selectedResult.parentElement!.parentElement!.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});
