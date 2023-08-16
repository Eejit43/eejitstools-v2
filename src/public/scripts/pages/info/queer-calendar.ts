import { escapeHtml, showAlert } from '../../functions.js';

const eventsTitle = document.querySelector('#events-title') as HTMLDivElement;
const eventsDisplay = document.querySelector('#events') as HTMLDivElement;
const monthInput = document.querySelector('#month') as HTMLInputElement;
const dateInput = document.querySelector('#date') as HTMLInputElement;
const getDateButton = document.querySelector('#get-date') as HTMLButtonElement;
const resetDateButton = document.querySelector('#reset-date') as HTMLButtonElement;
const yearOverview = document.querySelector('#year-overview') as HTMLAnchorElement;
const yearOverviewList = document.querySelector('#year-overview-list') as HTMLAnchorElement;

/* Add event listeners */
getDateButton.addEventListener('click', getFromDate);
resetDateButton.addEventListener('click', getCurrent);
for (const event of ['input', 'paste'])
    monthInput.addEventListener(event, () => {
        monthInput.value = monthInput.value.replaceAll(/((?!\d).)/g, '');
        checkInput(monthInput);
    });

for (const event of ['input', 'paste'])
    dateInput.addEventListener(event, () => {
        dateInput.value = dateInput.value.replaceAll(/((?!\d).)/g, '');
        checkInput(dateInput);
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
const year = currentTime.getFullYear();
const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
const date = currentTime.getDate().toString().padStart(2, '0');

monthInput.placeholder = month;
dateInput.placeholder = date;

yearOverview.href = `https://en.pronouns.page/calendar/${year}-overview.png`;
yearOverviewList.href = `https://en.pronouns.page/calendar/${year}-labels.png`;

interface CalendarData {
    events: string[];
    eventsRaw: {
        flag: string;
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

        eventsTitle.textContent = `Events on ${year}/${monthValue}/${dateValue}:`;

        fetch(`https://en.pronouns.page/api/calendar/${year}-${monthValue}-${dateValue}`).then(async (response) => {
            const data = (await response.json()) as CalendarData;

            const { events, eventsRaw } = data;

            const newEvents = [];
            for (let index = 0; index < events.length; index++)
                if (eventsRaw[index].flag === null) newEvents.push(`– ${events[index]}`);
                else newEvents.push(`– <img src="https://en.pronouns.page/flags/${eventsRaw[index].flag}.png" style="height: 1rem; border-radius: 0.18rem !important"> ${events[index]}`);

            if (newEvents.length === 0) eventsDisplay.textContent = 'No events found on this date!';
            else eventsDisplay.innerHTML = newEvents.join('<br />');
        });
    }
}

/**
 * Fetches calendar information for the current date.
 */
function getCurrent() {
    eventsTitle.textContent = 'Current Events:';
    eventsDisplay.innerHTML = '<span class="error">Loading data...</span>';

    monthInput.value = '';
    dateInput.value = '';

    fetch(`https://en.pronouns.page/api/calendar/${year}-${month}-${date}`).then(async (response) => {
        const data = (await response.json()) as CalendarData;

        const { events, eventsRaw } = data;

        const newEvents = [];
        for (let index = 0; index < events.length; index++)
            if (eventsRaw[index].flag === null) newEvents.push(`– ${events[index]}`);
            else newEvents.push(`– <img src="https://en.pronouns.page/flags/${eventsRaw[index].flag}.png" style="height: 1rem; border-radius: 0.18rem !important"> ${events[index]}`);

        if (newEvents.length === 0) eventsDisplay.textContent = 'No events found on this date!';
        else eventsDisplay.innerHTML = newEvents.join('<br />');
    });
}

getCurrent();
