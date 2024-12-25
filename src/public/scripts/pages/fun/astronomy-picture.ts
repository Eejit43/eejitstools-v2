import type { ApodEntryMedia, FullApodEntry } from '../../../../route-handlers/astronomy-picture.js';
import { showAlert } from '../../functions.js';

const resultElement = document.querySelector<HTMLDivElement>('#result')!;
const monthInput = document.querySelector<HTMLInputElement>('#month-input')!;
const dateInput = document.querySelector<HTMLInputElement>('#date-input')!;
const yearInput = document.querySelector<HTMLInputElement>('#year-input')!;
const getDateButton = document.querySelector<HTMLButtonElement>('#get-date')!;
const resetDateButton = document.querySelector<HTMLButtonElement>('#reset-date')!;

/* Add event listeners */
getDateButton.addEventListener('click', () => {
    const values = getValuesAsNumbers();
    checkApod(values.year, values.month, values.date);
});

resetDateButton.addEventListener('click', () => {
    monthInput.value = '';
    dateInput.value = '';
    yearInput.value = '';
    checkApod(year, month, date);
});

for (const element of [dateInput, monthInput, yearInput]) {
    for (const event of ['input', 'paste'])
        element.addEventListener(event, () => {
            element.value = element.value.replaceAll(/((?!\d).)/g, '');
            checkInput(element);
        });

    element.addEventListener('keydown', (event) => {
        const values = getValuesAsNumbers();
        if (event.code === 'Enter') checkApod(values.year, values.month, values.date);
    });
}

/**
 * Checks and updates an elements value if needed.
 * @param element The element to check and update.
 */
function checkInput(element: HTMLInputElement) {
    if (element.value.length > element.maxLength) element.value = element.value.slice(0, element.maxLength);
    if ((element.max && element.value > element.max) || Number.parseInt(element.value) < 1) element.value = element.value.slice(0, 1);
}

const currentTime = new Date();
const month = currentTime.getMonth() + 1;
const date = currentTime.getDate();
const year = currentTime.getFullYear();

/**
 * Gets the value of all inputs and returns them as numbers if possible.
 */
function getValuesAsNumbers() {
    return {
        month: Number.isNaN(Number.parseInt(monthInput.value)) ? month : Number.parseInt(monthInput.value),
        date: Number.isNaN(Number.parseInt(dateInput.value)) ? date : Number.parseInt(dateInput.value),
        year: Number.isNaN(Number.parseInt(yearInput.value)) ? year : Number.parseInt(yearInput.value),
    };
}

monthInput.placeholder = month.toString();
dateInput.placeholder = date.toString();
yearInput.placeholder = year.toString();

checkApod(year, month, date);

/**
 * Checks the provided date to ensure it is between June 16th, 1995, and the current date.
 * @param yearInput The year input.
 * @param monthInput The month input.
 * @param dateInput The date input.
 */
function checkApod(yearInput: number, monthInput: number, dateInput: number) {
    if (
        new Date(`${monthInput}/${dateInput}/${yearInput} 00:00:00`).getTime() >= new Date('6/16/1995 00:00:00').getTime() &&
        new Date(`${monthInput}/${dateInput}/${yearInput} 00:00:00`).getTime() <= Date.now()
    )
        void fetchApod(yearInput, monthInput, dateInput);
    else
        showAlert(
            `Date out of range! Must be between ${new Date('6/16/1995 00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} and ${new Date().toLocaleDateString(
                undefined,
                { year: 'numeric', month: 'long', day: 'numeric' },
            )} (inclusive)`,
            'error',
        );
}

/**
 * Fetches the Astronomy Picture of the Day (APOD) for the provided date.
 * @param providedYear The provided year.
 * @param providedMonth The provided month.
 * @param providedDate The provided date.
 */
async function fetchApod(providedYear: number, providedMonth: number, providedDate: number) {
    resultElement.innerHTML = 'Pulling data from the cosmos <i class="fa-solid fa-spinner fa-pulse"></i>';

    const { success, error, source, date, title, credit, explanation, media } = (await (
        await fetch(
            `/astronomy-picture/${providedYear}/${providedMonth.toString().padStart(2, '0')}/${providedDate.toString().padStart(2, '0')}`,
        )
    ).json()) as FullApodEntry;

    if (!success && error) {
        showAlert(error, 'error');
        return;
    }

    const result = [
        `Astronomy ${media.type === 'image' ? 'Picture' : '<strike>Picture</strike> Video'} of the Day for <a href="${source}" target="_blank" class="external-link">${date}</a>:<br /><br />`,
        `<center style="font-size: 30px">${title}</center>`,
        getMediaElement(media),
        credit ? `<center>${credit}</center><br />` : '',
        `<div id="apod-explanation">${explanation}</div>`,
    ].filter(Boolean);

    resultElement.innerHTML = result.join('');

    if (media.annotated) {
        const imageElement = document.querySelector<HTMLImageElement>('a#apod-link > img')!;
        imageElement.parentElement!.addEventListener('mouseover', () => (imageElement.src = media.annotated!));
        imageElement.parentElement!.addEventListener('mouseout', () => (imageElement.src = media.src));
    }

    for (const linkElement of document.querySelectorAll<HTMLAnchorElement>('#apod-explanation a[href^="https://apod.nasa.gov/apod/ap"]'))
        linkElement.addEventListener('click', (event) => {
            if (event.metaKey) return;

            event.preventDefault();

            const dateString = /ap(\d{6})/.exec(linkElement.href)![1];

            const yearShort = Number.parseInt(dateString.slice(0, 2));

            const year = yearShort < 95 ? 2000 + yearShort : 1900 + yearShort;
            const month = Number.parseInt(dateString.slice(2, 4));
            const date = Number.parseInt(dateString.slice(4, 6));

            yearInput.value = year.toString();
            monthInput.value = month.toString();
            dateInput.value = date.toString();

            checkApod(year, month, date);
        });
}

/**
 * Gets a viewable element (`img` or `iframe` embed) for an APOD entry media.
 * @param media The media to get the element for.
 */
function getMediaElement(media: ApodEntryMedia) {
    const { type, src, highResolution, alt } = media;
    return type === 'image'
        ? `<a id="apod-link" href="${highResolution ?? src}" target="_blank"><img src="${src}"${alt ? ` alt="${alt}"` : ''}></a>`
        : `<div id="apod-embed-container"><iframe src="${src}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
}
