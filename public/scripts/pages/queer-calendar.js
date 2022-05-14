import { showAlert, escapeHTML } from '/scripts/functions.js';

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

function checkInput(element) {
    if (element.value.length > element.maxLength) element.value = element.value.slice(0, element.maxLength);
    if (element.value > element.max || element.value < 1) element.value = element.value.slice(0, 1);
}

const currentTime = new Date();
const year = currentTime.getFullYear();
let month = currentTime.getMonth() + 1;
let date = currentTime.getDate();
if (month < 10) month = '0' + month;
if (date < 10) date = '0' + date;

monthVal.placeholder = month;
dateVal.placeholder = date;

yearOverview.href = `https://en.pronouns.page/calendar/${year}-overview.png`;
yearOverviewList.href = `https://en.pronouns.page/calendar/${year}-labels.png`;

async function getFromDate() {
    let monthInput = escapeHTML(monthVal.value);
    let dateInput = escapeHTML(dateVal.value);

    if (!monthInput) monthInput = month;
    else if (monthInput.length === 1) monthInput = '0' + monthInput;

    if (!dateInput) dateInput = date;
    else if (dateInput.length === 1) dateInput = '0' + dateInput;

    if (parseInt(monthInput) === 0 || parseInt(dateInput) === 0) {
        showAlert('Input cannot be zero!', 'error');
    } else {
        eventsDisplay.innerHTML = '<span class="error">Loading data...</span>';

        eventsTitle.innerHTML = `Events on ${year}/${monthInput}/${dateInput}:`;

        fetch(`https://en.pronouns.page/api/calendar/${year}-${monthInput}-${dateInput}`).then(async (response) => {
            const data = await response.json();

            events = data.events;
            eventsRaw = data.eventsRaw;

            const newArray = [];
            for (let i = 0; i < events.length; i++) {
                if (eventsRaw[i].flag !== null) {
                    newArray.push(`– <img src="https://en.pronouns.page/flags/${eventsRaw[i].flag}.png" style="height: 1rem; border-radius: 0.18rem !important"> ${events[i]}`);
                } else {
                    newArray.push(`– ${events[i]}`);
                }
            }
            if (newArray.length === 0) eventsDisplay.innerHTML = 'No events found on this date!';
            else eventsDisplay.innerHTML = newArray.join('<br />');
        });
    }
}

async function getCurrent() {
    eventsTitle.innerHTML = 'Current Events:';
    eventsDisplay.innerHTML = '<span class="error">Loading data...</span>';

    monthVal.value = '';
    dateVal.value = '';

    fetch(`https://en.pronouns.page/api/calendar/${year}-${month}-${date}`).then(async (response) => {
        const data = await response.json();

        events = data.events;
        eventsRaw = data.eventsRaw;

        const newArray = [];
        for (let i = 0; i < events.length; i++) {
            if (eventsRaw[i].flag !== null) {
                newArray.push(`– <img src="https://en.pronouns.page/flags/${eventsRaw[i].flag}.png" style="height: 1rem; border-radius: 0.18rem !important"> ${events[i]}`);
            } else {
                newArray.push(`– ${events[i]}`);
            }
        }
        if (newArray.length === 0) eventsDisplay.innerHTML = 'No events found on this date!';
        else eventsDisplay.innerHTML = newArray.join('<br />');
    });
}

getCurrent();
