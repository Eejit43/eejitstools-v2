import { pagesParsedValues } from '/data/pages.js';
import { matchesKeywords } from '/scripts/functions.js';

const searchResult = document.querySelector('.large-search-results');
const searchText = document.querySelector('.large-search-text');

searchText.addEventListener('input', () => {
    const value = searchText.value.toLowerCase();
    const results = [];
    pagesParsedValues.forEach((page) => {
        if (page.title.toLowerCase().includes(value) || page.descriptionParsed.toLowerCase().includes(value) || page.name.toLowerCase().includes(value) || matchesKeywords(page.keywords, value)) {
            results.push(`<tr><td><a href="${page.link}"><div class="results-title">${page.title}</div><div class="results-description">${page.descriptionParsed}</div></a></td></tr>`);
        }
    });
    if (value !== '' && results.length === 0) results.push('<tr><td>No results found!</td></tr>');
    searchResult.innerHTML = value !== '' && results.length > 0 ? `<table><tbody>${results.join('')}</tbody></table>` : '';
});

searchText.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const firstResult = document.querySelector('.large-search-box .large-search-results table tbody tr td a');
        if (firstResult) window.open(firstResult.href, event.metaKey ? '_blank' : '_self');
    } else if (event.key === 'Escape') {
        searchText.value = '';
        searchResult.innerHTML = '';
        searchText.blur();
    }
});

document.querySelector('.large-search-button').addEventListener('click', () => searchText.focus());
