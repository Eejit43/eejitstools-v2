import { ApodEntryMedia, FullApodEntry } from '../../../apod-fetcher.js';
import { showAlert } from '../../functions.js';

const resultElement = document.getElementById('result') as HTMLDivElement;
const yearInput = document.getElementById('year') as HTMLInputElement;
const monthInput = document.getElementById('month') as HTMLInputElement;
const dateInput = document.getElementById('date') as HTMLInputElement;
const getDateButton = document.getElementById('get-date') as HTMLButtonElement;
const resetDateButton = document.getElementById('reset-date') as HTMLButtonElement;

/* Add event listeners */
getDateButton.addEventListener('click', () => {
    checkApod(valuesAsNumbers.year, valuesAsNumbers.month, valuesAsNumbers.date);
});

resetDateButton.addEventListener('click', () => {
    yearInput.value = '';
    monthInput.value = '';
    dateInput.value = '';
    checkApod(year, month, date);
});

[dateInput, monthInput, yearInput].forEach((element) => {
    ['input', 'paste'].forEach((event) => {
        element.addEventListener(event, () => {
            element.value = element.value.replace(/((?![0-9]).)/g, '');
            checkInput(element);
        });
    });
    element.addEventListener('keydown', (event) => {
        if (event.code === 'Enter') checkApod(valuesAsNumbers.year, valuesAsNumbers.month, valuesAsNumbers.date);
    });
});

/**
 * Checks and updates an elements value if needed.
 * @param element The element to check and update.
 */
function checkInput(element: HTMLInputElement) {
    if (element.value.length > element.maxLength) element.value = element.value.slice(0, element.maxLength);
    if ((element.max && element.value > element.max) || parseInt(element.value) < 1) element.value = element.value.slice(0, 1);
}

const currentTime = new Date();
const year = currentTime.getFullYear();
const month = currentTime.getMonth() + 1;
const date = currentTime.getDate();

const valuesAsNumbers = {
    year: !isNaN(parseInt(yearInput.value)) ? parseInt(yearInput.value) : year,
    month: !isNaN(parseInt(monthInput.value)) ? parseInt(monthInput.value) : month,
    date: !isNaN(parseInt(dateInput.value)) ? parseInt(dateInput.value) : date
};

yearInput.placeholder = year.toString();
monthInput.placeholder = month.toString();
dateInput.placeholder = date.toString();

checkApod(year, month, date);

/**
 * Checks the provided date to ensure it is between June 16th, 1995, and the current date.
 * @param yearInput The year input.
 * @param monthInput The month input.
 * @param dateInput The date input.
 */
function checkApod(yearInput: number, monthInput: number, dateInput: number) {
    if (new Date(`${monthInput}/${dateInput}/${yearInput} 00:00:00`).getTime() >= new Date('6/16/1995 00:00:00').getTime() && new Date(`${monthInput}/${dateInput}/${yearInput} 00:00:00`).getTime() <= new Date().getTime()) fetchApod(yearInput, monthInput, dateInput);
    else showAlert(`Date out of range! Must be between ${new Date('6/16/1995 00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} and ${new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} (inclusive)`, 'error');
}

/**
 * Fetches the Astronomy Picture of the Day (APOD) for the provided date.
 * @param yearInput The year input.
 * @param monthInput The month input.
 * @param dateInput The date input.
 */
async function fetchApod(yearInput: number, monthInput: number, dateInput: number) {
    resultElement.innerHTML = 'Pulling data from the cosmos <i class="fa-solid fa-spinner fa-pulse"></i>';

    const { success, error, source, date, title, credit, explanation, media } = (await (await fetch(`/apod/${yearInput}/${monthInput.toString().padStart(2, '0')}/${dateInput.toString().padStart(2, '0')}`)).json()) as FullApodEntry;

    if (!success && error) return showAlert(error, 'error');

    const result = [
        `Astronomy ${media.type === 'image' ? 'Picture' : '<strike>Picture</strike> Video'} of the Day for <a href="${source}" target="_blank">${date}</a>:<br /><br />`, //
        `<center style="font-size: 30px">${title}</center>`,
        getMediaElement(media),
        credit ? `<center>${credit}</center><br />` : '',
        explanation
    ].filter(Boolean);

    resultElement.innerHTML = result.join('');

    if (media.annotated) {
        const imageElement = document.querySelector('a#apod-link > img') as HTMLImageElement;
        (imageElement.parentElement as HTMLElement).addEventListener('mouseover', () => (imageElement.src = media.annotated as string));
        (imageElement.parentElement as HTMLElement).addEventListener('mouseout', () => (imageElement.src = media.src));
    }
}

/**
 * Gets a viewable element (`img` or `iframe` embed) for an APOD entry media.
 * @param media The media to get the element for.
 */
function getMediaElement(media: ApodEntryMedia) {
    const { type, src, highResolution, alt } = media;
    if (type === 'image') return `<a id="apod-link" href="${highResolution || src}" target="_blank"><img src="${src}"${alt ? ` alt="${alt}"` : ''}></a>`;
    else return `<div id="apod-embed-container"><iframe src="${src}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
}
