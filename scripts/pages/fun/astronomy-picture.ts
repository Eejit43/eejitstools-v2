import { showAlert } from '/scripts/functions.js';

const resultElement = document.getElementById('result');
const yearVal = document.getElementById('year');
const monthVal = document.getElementById('month');
const dateVal = document.getElementById('date');
const getDate = document.getElementById('get-date');
const resetDate = document.getElementById('reset-date');

/* Add event listeners */
getDate.addEventListener('click', () => {
    checkApod(yearVal.value || year, monthVal.value || month, dateVal.value || date);
});

resetDate.addEventListener('click', () => {
    yearVal.value = '';
    monthVal.value = '';
    dateVal.value = '';
    checkApod(year, month, date);
});

[dateVal, monthVal, yearVal].forEach((element) => {
    ['input', 'paste'].forEach((event) => {
        element.addEventListener(event, () => {
            element.value = element.value.replace(/((?![0-9]).)/g, '');
            checkInput(element);
        });
    });
    element.addEventListener('keydown', (event) => {
        if (event.code === 'Enter') checkApod(yearVal.value || year, monthVal.value || month, dateVal.value || date);
    });
});

/**
 * Checks and updates an elements value if needed
 * @param {HTMLElement} element the element to check and update
 */
function checkInput(element) {
    if (element.value.length > element.maxLength) element.value = element.value.slice(0, element.maxLength);
    if ((element.max && element.value > element.max) || element.value < 1) element.value = element.value.slice(0, 1);
}

const currentTime = new Date();
const year = currentTime.getFullYear();
const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
const date = currentTime.getDate().toString().padStart(2, '0');

yearVal.placeholder = year;
monthVal.placeholder = month;
dateVal.placeholder = date;

checkApod(year, month, date);

/**
 * Checks the provided date to ensure it is between June 16th, 1995, and the current date
 * @param {number} yearInput the year input
 * @param {number} monthInput the month input
 * @param {number} dateInput the date input
 */
function checkApod(yearInput, monthInput, dateInput) {
    if (new Date(`${monthInput}/${dateInput}/${yearInput} 00:00:00`).getTime() >= new Date('6/16/1995 00:00:00').getTime() && new Date(`${monthInput}/${dateInput}/${yearInput} 00:00:00`).getTime() <= new Date().getTime()) fetchApod(yearInput, monthInput, dateInput);
    else showAlert(`Date out of range! Must be between ${new Date('6/16/1995 00:00:00').toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })} and ${new Date().toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })} (inclusive)`, 'error');
}

/**
 * @typedef {import('../../../../apod-fetcher.js').apodEntry} apodEntry
 * @typedef {import('../../../../apod-fetcher.js').apodEntryMedia} apodEntryMedia
 */

/**
 * Fetches the Astronomy Picture of the Day (APOD) for the provided date
 * @param {number} yearInput the year input
 * @param {number} monthInput the month input
 * @param {number} dateInput the date input
 */
async function fetchApod(yearInput, monthInput, dateInput) {
    resultElement.innerHTML = 'Pulling data from the cosmos <i class="fa-solid fa-spinner fa-pulse"></i>';

    /** @type {apodEntry} */
    const { success, error, source, date, title, credit, explanation, media } = await (await fetch(`/apod/${yearInput}/${monthInput}/${dateInput}`)).json();

    if (!success) return showAlert(error, 'error');

    const result = [
        `Astronomy ${media.type === 'image' ? 'Picture' : '<strike>Picture</strike> Video'} of the Day for <a href="${source}" target="_blank">${date}</a>:<br /><br />`, //
        `<center style="font-size: 30px">${title}</center>`,
        getMediaElement(media),
        credit ? `<center>${credit}</center><br />` : '',
        explanation
    ].filter(Boolean);

    resultElement.innerHTML = result.join('');

    if (media.annotated) {
        const imageElement = document.querySelector('a#apod-link > img');
        imageElement.parentElement.addEventListener('mouseover', () => (imageElement.src = media.annotated));
        imageElement.parentElement.addEventListener('mouseout', () => (imageElement.src = media.src));
    }
}

/**
 * Gets a viewable element (`img` or `iframe` embed) for an APOD entry media
 * @param {apodEntryMedia} media the media to get the element for
 */
function getMediaElement(media) {
    const { type, src, highResolution, alt } = media;
    if (type === 'image') return `<a id="apod-link" href="${highResolution || src}" target="_blank"><img src="${src}"${alt ? ` alt="${alt}"` : ''}></a>`;
    else return `<div id="apod-embed-container"><iframe src="${src}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
}
