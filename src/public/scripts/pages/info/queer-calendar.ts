import { escapeHtml, showAlert } from '@scripts/functions.js';

const eventsTitle = document.querySelector<HTMLDivElement>('#events-title')!;
const eventsDisplay = document.querySelector<HTMLUListElement>('#events')!;
const monthInput = document.querySelector<HTMLInputElement>('#month-input')!;
const dateInput = document.querySelector<HTMLInputElement>('#date-input')!;
const getDateButton = document.querySelector<HTMLButtonElement>('#get-date')!;
const resetDateButton = document.querySelector<HTMLButtonElement>('#reset-date')!;
const yearOverview = document.querySelector<HTMLAnchorElement>('#year-overview')!;

/* Add event listeners */
getDateButton.addEventListener('click', getFromDate);
resetDateButton.addEventListener('click', getCurrent);

for (const element of [dateInput, monthInput])
    for (const event of ['input', 'paste'])
        element.addEventListener(event, () => {
            element.value = element.value.replaceAll(/((?!\d).)/g, '');
            checkInput(element);
        });

/**
 * Checks and updates an elements value if needed.
 * @param element The element to check and update.
 */
function checkInput(element: HTMLInputElement) {
    if (element.value.length > element.maxLength) element.value = element.value.slice(0, element.maxLength);
    if ((element.max && element.value > element.max) || Number.parseInt(element.value) < 1) element.value = element.value.slice(0, 1);
}

const currentTime = new Date();
const year = currentTime.getFullYear().toString();
const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
const date = currentTime.getDate().toString().padStart(2, '0');

monthInput.placeholder = month;
dateInput.placeholder = date;

yearOverview.href = `https://en.pronouns.page/calendar/en/${year}-labels.png`;

interface CalendarData {
    events: string[];
    eventsRaw: {
        display?: {
            type: string;
            name: string;
        };
    }[];
}

/**
 * Fetches calendar information for the specified date.
 */
function getFromDate() {
    const monthValue = escapeHtml(monthInput.value || month).padStart(2, '0');
    const dateValue = escapeHtml(dateInput.value || date).padStart(2, '0');

    if (Number.parseInt(monthValue) === 0 || Number.parseInt(dateValue) === 0) showAlert('Input cannot be zero!', 'error');
    else {
        eventsDisplay.innerHTML = '<span class="error">Loading data...</span>';

        eventsTitle.textContent = `Events on ${monthValue}/${dateValue}/${year}:`;

        void addEvents(year, monthValue, dateValue);
    }
}

/**
 * Fetches calendar information for the current date.
 */
function getCurrent() {
    eventsTitle.textContent = 'Current Events:';

    monthInput.value = '';
    dateInput.value = '';

    void addEvents(year, month, date);
}

/**
 * Fetches events for the provided date and adds the data to the list.
 * @param year The year to fetch information for.
 * @param month The month to fetch information for.
 * @param date The date to fetch information for.
 */
async function addEvents(year: string, month: string, date: string) {
    // Reset list
    const loadingSpan = document.createElement('span');
    loadingSpan.textContent = 'Loading data...';

    eventsDisplay.innerHTML = '';
    eventsDisplay.append(loadingSpan);

    // Fetch data
    const response = await fetch(`https://en.pronouns.page/api/calendar/${year}-${month}-${date}`);

    const data = (await response.json()) as CalendarData;

    const { events, eventsRaw } = data;

    const newEvents = [];
    for (const [index, eventText] of events.entries()) {
        const listElement = document.createElement('li');

        if (eventsRaw[index].display?.type === 'flag') {
            const imageElement = document.createElement('img');
            imageElement.src = `https://en.pronouns.page/flags/${eventsRaw[index].display.name}.png`;

            listElement.append(imageElement, eventText);
        } else listElement.textContent = eventText;

        newEvents.push(listElement);
    }

    eventsDisplay.innerHTML = '';

    if (newEvents.length === 0) eventsDisplay.textContent = 'No events found on this date!';
    else eventsDisplay.append(...newEvents);
}

getCurrent();
