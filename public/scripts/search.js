import { allPageInfo } from '/data/pages.js';
import { matchesKeywords } from '/scripts/functions.js';

const pages = Object.keys(allPageInfo).map((key) => {
    return { title: allPageInfo[key].title, link: allPageInfo[key].link, description: allPageInfo[key].description.replace(/<span.*?>(.*?)<\/span>/g, '$1'), keywords: allPageInfo[key].keywords };
});

const searchResult = document.querySelector('.large-search-results');
const searchText = document.querySelector('.large-search-text');

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
