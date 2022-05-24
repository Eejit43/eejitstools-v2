import { escapeHTML, showAlert } from '/scripts/functions.js';

const eventsTitle = document.getElementById('events-title');
const eventsDisplay = document.getElementById('events');
const monthVal = document.getElementById('month');
const dateVal = document.getElementById('date');
const getDate = document.getElementById('get-date');
const resetDate = document.getElementById('reset-date');
const yearOverview = document.getElementById('year-overview');
const yearOverviewList = document.getElementById('year-overview-list');

/* Add event listeners */
getDate.addEventListener('click', getFromDate);
resetDate.addEventListener('click', getCurrent);
['input', 'paste'].forEach((event) => {
    monthVal.addEventListener(event, () => {
        monthVal.value = monthVal.value.replace(/((?![0-9]).)/g, '');
        checkInput(monthVal);
    });
});
['input', 'paste'].forEach((event) => {
    dateVal.addEventListener(event, () => {
        dateVal.value = dateVal.value.replace(/((?![0-9]).)/g, '');
        checkInput(dateVal);
    });
});

/**
 * Checks and updates an elements value if needed
 * @param {HTMLElement} element the element to check and update
 */
function checkInput(element) {
    console.log(element.max);
    if (element.value.length > element.maxLength) element.value = element.value.slice(0, element.maxLength);
    if ((element.max && element.value > element.max) || element.value < 1) element.value = element.value.slice(0, 1);
}

const currentTime = new Date();
const year = currentTime.getFullYear();
const month = (currentTime.getMonth() + 1).toString().padStart(2, 0);
const date = currentTime.getDate().toString().padStart(2, 0);

monthVal.placeholder = month;
dateVal.placeholder = date;

yearOverview.href = `https://en.pronouns.page/calendar/${year}-overview.png`;
yearOverviewList.href = `https://en.pronouns.page/calendar/${year}-labels.png`;

/**
 * Fetches calendar information for the specified date
 */
async function getFromDate() {
    const monthInput = escapeHTML(monthVal.value || month).padStart(2, 0);
    const dateInput = escapeHTML(dateVal.value || date).padStart(2, 0);

    if (parseInt(monthInput) === 0 || parseInt(dateInput) === 0) {
        showAlert('Input cannot be zero!', 'error');
    } else {
        eventsDisplay.innerHTML = '<span class="error">Loading data...</span>';

        eventsTitle.innerHTML = `Events on ${year}/${monthInput}/${dateInput}:`;

        fetch(`https://en.pronouns.page/api/calendar/${year}-${monthInput}-${dateInput}`).then(async (response) => {
            const data = await response.json();

            const events = data.events;
            const eventsRaw = data.eventsRaw;

            const newEvents = [];
            for (let i = 0; i < events.length; i++) {
                if (eventsRaw[i].flag !== null) newEvents.push(`– <img src="https://en.pronouns.page/flags/${eventsRaw[i].flag}.png" style="height: 1rem; border-radius: 0.18rem !important"> ${events[i]}`);
                else newEvents.push(`– ${events[i]}`);
            }
            if (newEvents.length === 0) eventsDisplay.innerHTML = 'No events found on this date!';
            else eventsDisplay.innerHTML = newEvents.join('<br />');
        });
    }
}

/**
 * Fetches calendar information for the current date
 */
async function getCurrent() {
    eventsTitle.innerHTML = 'Current Events:';
    eventsDisplay.innerHTML = '<span class="error">Loading data...</span>';

    monthVal.value = '';
    dateVal.value = '';

    fetch(`https://en.pronouns.page/api/calendar/${year}-${month}-${date}`).then(async (response) => {
        const data = await response.json();

        const events = data.events;
        const eventsRaw = data.eventsRaw;

        const newEvents = [];
        for (let i = 0; i < events.length; i++) {
            if (eventsRaw[i].flag !== null) newEvents.push(`– <img src="https://en.pronouns.page/flags/${eventsRaw[i].flag}.png" style="height: 1rem; border-radius: 0.18rem !important"> ${events[i]}`);
            else newEvents.push(`– ${events[i]}`);
        }
        if (newEvents.length === 0) eventsDisplay.innerHTML = 'No events found on this date!';
        else eventsDisplay.innerHTML = newEvents.join('<br />');
    });
}

getCurrent();
