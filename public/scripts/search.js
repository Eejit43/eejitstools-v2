import { pagesParsed } from '/data/pages.js';

const searchResult = document.querySelector('.large-search-results');
const searchText = document.querySelector('.large-search-text');

searchText.addEventListener('input', () => {
    const value = searchText.value.toLowerCase();
    const results = [];
    Object.values(pagesParsed).forEach((page) => {
        if (page.title.toLowerCase().includes(value) || page.descriptionParsed.toLowerCase().includes(value) || page.name.toLowerCase().includes(value) || page.keywords.some((keyword) => keyword.includes(value))) {
            results.push(`<tr><td><a href="${page.link}"><div class="results-title">${page.title}</div><div class="results-description">${page.descriptionParsed}</div></a></td></tr>`);
        }
    });
    if (value !== '' && results.length === 0) results.push('<tr><td>No results found!</td></tr>');
    searchResult.innerHTML = value !== '' && results.length > 0 ? `<table><tbody>${results.join('')}</tbody></table>` : '';
});

searchText.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const result = document.querySelector('.large-search-box .large-search-results table tbody tr td a.selected') || document.querySelector('.large-search-box .large-search-results table tbody tr td a');
        if (result) window.open(result.href, event.metaKey ? '_blank' : '_self');
    } else if (event.key === 'Escape') {
        searchText.value = '';
        searchResult.innerHTML = '';
        searchText.blur();
    }
});

document.querySelector('.large-search-button').addEventListener('click', () => searchText.focus());

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        const firstResult = document.querySelector('.large-search-box .large-search-results table tbody tr td a');
        if (firstResult) {
            const currentResult = document.querySelector('.large-search-box .large-search-results table tbody tr td a.selected');

            const nextTrElement = event.key === 'ArrowUp' ? currentResult?.parentElement.parentElement.previousElementSibling : currentResult?.parentElement.parentElement.nextElementSibling;

            if (nextTrElement) {
                if (currentResult) currentResult.classList.remove('selected');
                nextTrElement.querySelector('td').querySelector('a').classList.add('selected');
            } else if (!currentResult) {
                firstResult.classList.add('selected');
            }

            const selectedResult = document.querySelector('.large-search-box .large-search-results table tbody tr td a.selected');
            if (selectedResult) {
                selectedResult.parentElement.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
});
