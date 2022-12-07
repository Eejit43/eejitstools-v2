import { twemojiUpdate, showAlert, showResult } from '/scripts/functions.js';

const monthYearDisplay = document.getElementById('month-year');
const calendarBody = document.getElementById('calendar-body');
const previousMonthButton = document.getElementById('previous-month');
const nextMonthButton = document.getElementById('next-month');
const currentDateButton = document.getElementById('current-date');
const jumpMonthSelection = document.getElementById('jump-month');
const jumpYearSelection = document.getElementById('jump-year');

const displayDay = document.getElementById('display-day');
const displayDate = document.getElementById('display-date');
const displayMonthYear = document.getElementById('display-month-year');
const eventsList = document.getElementById('events-list');

const loginPassword = document.getElementById('login-password');
const loginButton = document.getElementById('login-button');
const todoList = document.getElementById('todo-list');

previousMonthButton.addEventListener('click', previousMonth);
nextMonthButton.addEventListener('click', nextMonth);
currentDateButton.addEventListener('click', currentDate);
[jumpMonthSelection, jumpYearSelection].forEach((element) => element.addEventListener('change', jump));

loginPassword.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && loginPassword.value.length > 0) loginButton.click();
});

let todoData;

loginButton.addEventListener('click', async () => {
    const result = await (await fetch(`/calendar-todo?password=${loginPassword.value}`)).json();

    if (!result.error) {
        todoData = result;

        showAlert('Logged in!', 'success');

        todoList.dataset.password = loginPassword.value;

        loadTodoList(displayedDate, displayedMonth, displayedYear);
    } else {
        showAlert('Incorrect password!', 'error');
        showResult('login', 'error', null, null, false);
        loginButton.disabled = true;
        setTimeout(() => (loginButton.disabled = false), 1000);
    }
});

const params = new URLSearchParams(window.location.search);
const password = params.get('password');

if (password) {
    loginPassword.value = password;
    loginButton.click();
}

document.addEventListener('keydown', (event) => {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || event.ctrlKey || event.metaKey || event.altKey) return;

    if (event.code === 'ArrowUp') previousMonth();
    else if (event.code === 'ArrowDown') nextMonth();
    else if (event.code === 'ArrowLeft') previousDay();
    else if (event.code === 'ArrowRight') nextDay();
    else if (event.code === 'KeyC') currentDate();
});

let currentTime = new Date();
let displayedDate = currentTime.getDate();
let currentMonth = currentTime.getMonth();
let displayedMonth = currentTime.getMonth();
let currentYear = currentTime.getFullYear();
let displayedYear = currentTime.getFullYear();

/**
 * @type {{holidays: {name: string, date: string}[], moonPhases: {name: string, date: string}[]}}
 */
const events = await (await fetch('/calendar-events')).json();

const holidayEmojis = {
    "New Year's Day": '🎉',
    'Martin Luther King Jr. Day': '👴🏾',
    'First Day of Black History Month': '✊🏿',
    "Valentine's Day": '❤️',
    "Presidents' Day": '🤵',
    "First Day of Women's History Month": '👩',
    "St. Patrick's Day": '☘️',
    'Daylight Saving Time starts': '🕑',
    'Easter Sunday': '🐇',
    'Tax Day': '💰',
    'Easter Monday': '🐇',
    'First Day of Asian Pacific American Heritage Month': '🌏',
    'Cinco de Mayo': '🥳',
    "Mother's Day": '🤱',
    'Memorial Day': '🪦',
    'First Day of LGBTQ+ Pride Month': '🏳️‍🌈',
    'Flag Day': '🇺🇸',
    "Father's Day": '👨',
    Juneteenth: '✊🏿',
    'Summer Solstice': '☀️',
    'Independence Day': '🇺🇸',
    'Labor Day': '🛠',
    'First Day of Hispanic Heritage Month': '🌎',
    "Indigenous Peoples' Day": '🪶',
    'Columbus Day': '⛵️',
    Halloween: '🎃',
    'First Day of American Indian Heritage Month': '🪶',
    'Daylight Saving Time ends': '🕑',
    'Election Day': '🗳️',
    'Veterans Day': '🎖️',
    'Thanksgiving Day': '🦃',
    'Native American Heritage Day': '🪶',
    'Winter Solstice': '❄️',
    'Christmas Eve': '🎅🏻',
    'Christmas Day': '🎄',
    "New Year's Eve": '🕛'
};

const moonEmojis = {
    'New moon': '🌑',
    'First quarter': '🌓',
    'Full moon': '🌕',
    'Last quarter': '🌗'
};

showCalendar(displayedDate, currentMonth, currentYear);

/**
 * Goes to the previous month
 */
function previousMonth() {
    if (currentMonth === 0) currentYear--;
    currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    showCalendar(null, currentMonth, currentYear);
}

/**
 * Goes to the next month
 */
function nextMonth() {
    if (currentMonth === 11) currentYear++;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(null, currentMonth, currentYear);
}

/**
 * Goes to the previous day
 */
function previousDay() {
    if (displayedDate === 1) {
        if (displayedMonth === 0) displayedYear--;
        displayedMonth = displayedMonth === 0 ? 11 : displayedMonth - 1;
        currentMonth = displayedMonth;
        currentYear = displayedYear;
        showCalendar(new Date(displayedYear, displayedMonth + 1, 0).getDate(), currentMonth, currentYear);
    } else if (currentMonth === displayedMonth && currentYear === displayedYear) updateDisplayedDate(displayedDate - 1, displayedMonth, displayedYear);
    else {
        currentMonth = displayedMonth;
        currentYear = displayedYear;
        showCalendar(displayedDate - 1, displayedMonth, displayedYear);
    }
}

/**
 * Goes to the next day
 */
function nextDay() {
    if (displayedDate === new Date(displayedYear, displayedMonth + 1, 0).getDate()) {
        if (displayedMonth === 11) displayedYear++;
        displayedMonth = (displayedMonth + 1) % 12;
        currentMonth = displayedMonth;
        currentYear = displayedYear;
        showCalendar(1, displayedMonth, displayedYear);
    } else if (currentMonth === displayedMonth && currentYear === displayedYear) updateDisplayedDate(displayedDate + 1, displayedMonth, displayedYear);
    else {
        currentMonth = displayedMonth;
        currentYear = displayedYear;
        showCalendar(displayedDate + 1, displayedMonth, displayedYear);
    }
}

/**
 * Jumps to the current date
 */
function currentDate() {
    currentTime = new Date();
    currentMonth = currentTime.getMonth();
    currentYear = currentTime.getFullYear();
    showCalendar(currentTime.getDate(), currentMonth, currentYear);
}

/**
 * Jumps to the selected month and year
 */
function jump() {
    currentMonth = parseInt(jumpMonthSelection.value);
    currentYear = parseInt(jumpYearSelection.value);
    showCalendar(null, currentMonth, currentYear);
}

/**
 * Shows the calendar for the given month and year
 * @param {?string} date The date to display
 * @param {string} month The month to display
 * @param {string} year The year to display
 */
function showCalendar(date, month, year) {
    jumpYearSelection.innerHTML = '';
    for (let relativeYear = year - 10; relativeYear <= year + 10; relativeYear++) {
        const option = document.createElement('option');
        option.value = relativeYear;
        option.text = relativeYear;
        jumpYearSelection.appendChild(option);
    }

    const firstDay = new Date(year, month).getDay();
    const daysInMonth = 32 - new Date(year, month, 32).getDate();

    calendarBody.innerHTML = '';

    monthYearDisplay.textContent = new Date(year, month).toLocaleString(undefined, { month: 'long', year: 'numeric' });
    jumpYearSelection.value = year;
    jumpMonthSelection.value = month;

    let currentDate = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');

        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                const cell = document.createElement('td');
                cell.classList.add('no-date');
                row.appendChild(cell);
            } else if (currentDate > daysInMonth) {
                if (j === 0) break;

                const cell = document.createElement('td');
                cell.classList.add('no-date');
                row.appendChild(cell);
            } else {
                const cell = document.createElement('td');
                cell.dataset.date = currentDate;
                cell.textContent = currentDate;
                if (currentDate === currentTime.getDate() && month === currentTime.getMonth() && year === currentTime.getFullYear()) cell.classList.add('current-date');
                if (currentDate === displayedDate && month === displayedMonth && year === displayedYear) cell.classList.add('selected-date');
                cell.addEventListener('click', () => updateDisplayedDate(parseInt(cell.dataset.date), month, year));
                row.appendChild(cell);
                currentDate++;
            }
        }

        calendarBody.appendChild(row);
    }

    loadCalendarEvents();

    if (date) updateDisplayedDate(date, month, year);
}

/**
 * Updates the displayed date
 * @param {string} date The date to display
 * @param {string} month The month to display
 * @param {string} year The year to display
 */
function updateDisplayedDate(date, month, year) {
    displayedDate = date;
    displayedMonth = month;
    displayedYear = year;

    document.querySelector('.selected-date')?.classList?.remove('selected-date');
    displayDay.textContent = new Date(year, month, date).toLocaleString(undefined, { weekday: 'long' });
    displayDate.textContent = date;
    displayMonthYear.textContent = new Date(year, month).toLocaleString(undefined, { month: 'long', year: 'numeric' });

    const dateCell = document.querySelector(`[data-date="${date}"]`);
    dateCell.classList.add('selected-date');

    if (dateCell.dataset.holiday || dateCell.dataset.phase) {
        eventsList.innerHTML = '';

        const events = [dateCell.dataset.holiday?.split(', ')?.map((holiday) => `${holidayEmojis[holiday] ? `${holidayEmojis[holiday]} ` : ''}${holiday}`), dateCell.dataset.phase ? `${moonEmojis[dateCell.dataset.phase]} ${dateCell.dataset.phase} (${dateCell.dataset.time})` : null].flat().filter(Boolean);

        events.forEach((event) => {
            const eventElement = document.createElement('li');
            eventElement.textContent = event;
            eventsList.appendChild(eventElement);
        });

        twemojiUpdate();
    } else eventsList.innerHTML = 'None';

    if (todoData) loadTodoList();
}

/**
 * Loads the calendar events
 */
function loadCalendarEvents() {
    events.holidays.forEach((holiday) => {
        const date = new Date(`${holiday.date}T00:00:00`);
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
            const cell = document.querySelector(`[data-date="${date.getDate()}"]`);
            cell.classList.add('holiday');
            if (!cell.dataset.holiday) cell.dataset.holiday = holiday.name;
            else cell.dataset.holiday += `, ${holiday.name}`;
        }
    });

    events.moonPhases.forEach((moonPhase) => {
        const date = new Date(`${moonPhase.date} ${moonPhase.time} UTC`);
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
            const cell = document.querySelector(`[data-date="${date.getDate()}"]`);
            cell.dataset.phase = moonPhase.phase;
            cell.dataset.time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' });

            const moonIcon = document.createElement('span');
            moonIcon.classList.add('moon-icon');
            moonIcon.textContent = moonEmojis[moonPhase.phase];
            cell.appendChild(moonIcon);
        }
    });

    twemojiUpdate();
}

// eslint-disable-next-line jsdoc/require-returns
/**
 * Loads the todo list
 */
function loadTodoList() {
    if (!todoList) return showAlert('Please log in to use the todo list!', 'error');

    const todoListDate = new Date(displayedYear, displayedMonth, displayedDate);

    todoList.innerHTML = '';

    todoData.todo.forEach((todo, index) => {
        if (
            todo.frequency === 'daily' ||
            (todo.frequency === 'weekly' && todoListDate.getDay() === 0) ||
            (/days:/.test(todo.frequency) &&
                todo.frequency
                    .replace('days:', '')
                    .split(',')
                    .some((day) => parseInt(day) === todoListDate.getDay()))
        ) {
            const todoElement = document.createElement('div');
            todoElement.classList.add('todo');
            todoElement.dataset.index = index;

            const todoCheckbox = document.createElement('input');
            todoCheckbox.type = 'checkbox';
            todoCheckbox.classList.add('todo-checkbox');
            todoCheckbox.dataset.index = index;
            todoCheckbox.checked = todoData.data[todoListDate.getFullYear()]?.[todoListDate.getMonth() + 1]?.[todoListDate.getDate()]?.split('')?.[index] === '1';
            todoCheckbox.addEventListener('change', async () => {
                todoList.querySelectorAll('.todo-checkbox').forEach((checkbox) => (checkbox.disabled = true));

                const todoFinal = new Array(todoData.todo.length).fill('0');
                todoList.querySelectorAll('.todo-checkbox').forEach((checkbox) => (todoFinal[checkbox.dataset.index] = checkbox.checked ? '1' : '0'));

                const result = await (
                    await fetch('/calendar-todo-edit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            password: todoList.dataset.password,
                            date: displayedDate,
                            month: displayedMonth + 1,
                            year: displayedYear,
                            todo: todoFinal.join('')
                        })
                    })
                ).json();

                if (result.error) showAlert(result.error, 'error');

                todoData = result;
                loadTodoList();
            });

            const todoText = document.createElement('span');
            todoText.textContent = todo.title;

            todoElement.appendChild(todoCheckbox);
            todoElement.appendChild(todoText);

            todoList.appendChild(todoElement);
        }
    });
}