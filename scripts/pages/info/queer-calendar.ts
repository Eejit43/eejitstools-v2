import { escapeHtml, showAlert } from '../../functions.js';

const eventsTitle = document.getElementById('events-title') as HTMLDivElement;
const eventsDisplay = document.getElementById('events') as HTMLDivElement;
const monthInput = document.getElementById('month') as HTMLInputElement;
const dateInput = document.getElementById('date') as HTMLInputElement;
const getDateButton = document.getElementById('get-date') as HTMLButtonElement;
const resetDateButton = document.getElementById('reset-date') as HTMLButtonElement;
const yearOverview = document.getElementById('year-overview') as HTMLAnchorElement;
const yearOverviewList = document.getElementById('year-overview-list') as HTMLAnchorElement;

/* Add event listeners */
getDateButton.addEventListener('click', getFromDate);
resetDateButton.addEventListener('click', getCurrent);
['input', 'paste'].forEach((event) => {
    monthInput.addEventListener(event, () => {
        monthInput.value = monthInput.value.replace(/((?![0-9]).)/g, '');
        checkInput(monthInput);
    });
});
['input', 'paste'].forEach((event) => {
    dateInput.addEventListener(event, () => {
        dateInput.value = dateInput.value.replace(/((?![0-9]).)/g, '');
        checkInput(dateInput);
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

    if (parseInt(monthValue) === 0 || parseInt(dateValue) === 0) showAlert('Input cannot be zero!', 'error');
    else {
        eventsDisplay.innerHTML = '<span class="error">Loading data...</span>';

        eventsTitle.textContent = `Events on ${year}/${monthValue}/${dateValue}:`;

        fetch(`https://en.pronouns.page/api/calendar/${year}-${monthValue}-${dateValue}`).then(async (response) => {
            const data = (await response.json()) as CalendarData;

            const { events, eventsRaw } = data;

            const newEvents = [];
            for (let i = 0; i < events.length; i++)
                if (eventsRaw[i].flag !== null) newEvents.push(`– <img src="https://en.pronouns.page/flags/${eventsRaw[i].flag}.png" style="height: 1rem; border-radius: 0.18rem !important"> ${events[i]}`);
                else newEvents.push(`– ${events[i]}`);

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
        for (let i = 0; i < events.length; i++)
            if (eventsRaw[i].flag !== null) newEvents.push(`– <img src="https://en.pronouns.page/flags/${eventsRaw[i].flag}.png" style="height: 1rem; border-radius: 0.18rem !important"> ${events[i]}`);
            else newEvents.push(`– ${events[i]}`);

        if (newEvents.length === 0) eventsDisplay.textContent = 'No events found on this date!';
        else eventsDisplay.innerHTML = newEvents.join('<br />');
    });
}

getCurrent();
