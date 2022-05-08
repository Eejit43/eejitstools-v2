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
monthVal.addEventListener('input', () => {
    monthVal.value = monthVal.value.replace(/((?![0-9]).)/g, '');
});
monthVal.addEventListener('paste', () => {
    monthVal.value = monthVal.value.replace(/((?![0-9]).)/g, '');
});
monthVal.addEventListener('input', () => {
    checkInput(this);
});
dateVal.addEventListener('input', () => {
    dateVal.value = dateVal.value.replace(/((?![0-9]).)/g, '');
});
dateVal.addEventListener('paste', () => {
    dateVal.value = dateVal.value.replace(/((?![0-9]).)/g, '');
});
dateVal.addEventListener('input', () => {
    checkInput(this);
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

function prepend(value, array) {
    const newArray = array.slice();
    newArray.unshift(value);
    return newArray;
}

async function getFromDate() {
    let monthInput = escapeHtml(monthVal.value);
    let dateInput = escapeHtml(dateVal.value);

    if (monthInput === '') monthInput = month;
    else if (monthInput.length === 1) monthInput = '0' + monthInput;

    if (dateInput === '') dateInput = date;
    else if (dateInput.length === 1) dateInput = '0' + dateInput;

    if (Number(monthInput) !== 0 && Number(dateInput) !== 0) {
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
    } else showAlert('Input cannot be zero!', 'error');
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
