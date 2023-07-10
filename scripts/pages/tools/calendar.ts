import { holidayEmojis, moonEmojis } from '../../../data/pages.js';
import { showAlert, showResult, twemojiUpdate } from '../../functions.js';

const monthYearDisplay = document.getElementById('month-year') as HTMLDivElement;
const calendarBody = document.getElementById('calendar-body') as HTMLElement;
const previousMonthButton = document.getElementById('previous-month') as HTMLInputElement;
const nextMonthButton = document.getElementById('next-month') as HTMLInputElement;
const currentDateButton = document.getElementById('current-date') as HTMLInputElement;
const jumpMonthSelection = document.getElementById('jump-month') as HTMLSelectElement;
const jumpYearSelection = document.getElementById('jump-year') as HTMLSelectElement;

const displayDay = document.getElementById('display-day') as HTMLDivElement;
const displayDate = document.getElementById('display-date') as HTMLDivElement;
const displayMonthYear = document.getElementById('display-month-year') as HTMLDivElement;
const eventsList = document.getElementById('events-list') as HTMLUListElement;

const loginPassword = document.getElementById('login-password') as HTMLInputElement;
const loginButton = document.getElementById('login-button') as HTMLInputElement;
const todoList = document.getElementById('todo-list') as HTMLDivElement;

previousMonthButton.addEventListener('click', previousMonth);
nextMonthButton.addEventListener('click', nextMonth);
currentDateButton.addEventListener('click', currentDate);
[jumpMonthSelection, jumpYearSelection].forEach((element) => element.addEventListener('change', jump));

loginPassword.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && loginPassword.value.length > 0) loginButton.click();
});

interface TodoData {
    todo: { title: string; id: string; frequency: string }[];
    data: { [year: string]: { [month: string]: { [date: string]: { [id: string]: string } } } };
}

let todoData = null as TodoData | null;

loginButton.addEventListener('click', async () => {
    const result = (await (await fetch(`/calendar-todo?password=${loginPassword.value}`)).json()) as TodoData & { error?: boolean };

    if (!result.error) {
        todoData = result;

        showAlert('Logged in!', 'success');

        todoList.dataset.password = loginPassword.value;

        loadTodoList();
    } else {
        showAlert('Incorrect password!', 'error');
        showResult('login', 'error', undefined, undefined, false);
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
    if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA' || event.ctrlKey || event.metaKey || event.altKey) return;

    if (event.code === 'ArrowUp') previousMonth();
    else if (event.code === 'ArrowDown') nextMonth();
    else if (event.code === 'ArrowLeft') previousDay();
    else if (event.code === 'ArrowRight') nextDay();
    else if (event.code === 'KeyC') currentDate();
    else if (event.code === 'KeyS') {
        const saveButton = document.getElementById('todo-save-button') as HTMLButtonElement;
        if (saveButton && !saveButton.disabled) saveButton.click();
    }
});

let currentTime = new Date();
let displayedDate = currentTime.getDate();
let currentMonth = currentTime.getMonth();
let displayedMonth = currentTime.getMonth();
let currentYear = currentTime.getFullYear();
let displayedYear = currentTime.getFullYear();

interface CalendarEvents {
    holidays: { name: string; date: string }[];
    moonPhases: { phase: string; date: string; time: string }[];
}

const events = (await (await fetch('/calendar-events')).json()) as CalendarEvents;

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
 * @param {?number} date The date to display
 * @param {number} month The month to display
 * @param {number} year The year to display
 */
function showCalendar(date: number | null, month: number, year: number) {
    jumpYearSelection.innerHTML = '';
    for (let relativeYear = year - 10; relativeYear <= year + 10; relativeYear++) {
        const option = document.createElement('option');
        option.value = relativeYear.toString();
        option.text = relativeYear.toString();
        jumpYearSelection.appendChild(option);
    }

    const firstDay = new Date(year, month).getDay();
    const daysInMonth = 32 - new Date(year, month, 32).getDate();

    calendarBody.innerHTML = '';

    monthYearDisplay.textContent = new Date(year, month).toLocaleString(undefined, { month: 'long', year: 'numeric' });
    jumpYearSelection.value = year.toString();
    jumpMonthSelection.value = month.toString();

    let currentDate = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');

        for (let j = 0; j < 7; j++)
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
                cell.dataset.date = currentDate.toString();
                cell.textContent = currentDate.toString();
                if (currentDate === currentTime.getDate() && month === currentTime.getMonth() && year === currentTime.getFullYear()) cell.classList.add('current-date');
                if (currentDate === displayedDate && month === displayedMonth && year === displayedYear) cell.classList.add('selected-date');
                cell.addEventListener('click', () => updateDisplayedDate(parseInt(cell.dataset.date as string), month, year));
                row.appendChild(cell);
                currentDate++;
            }

        calendarBody.appendChild(row);
    }

    loadCalendarEvents();

    if (date) updateDisplayedDate(date, month, year);
}

/**
 * Updates the displayed date
 * @param {number} date The date to display
 * @param {number} month The month to display
 * @param {number} year The year to display
 */
function updateDisplayedDate(date: number, month: number, year: number) {
    displayedDate = date;
    displayedMonth = month;
    displayedYear = year;

    document.querySelector('.selected-date')?.classList?.remove('selected-date');
    displayDay.textContent = new Date(year, month, date).toLocaleString(undefined, { weekday: 'long' });
    displayDate.textContent = date.toString();
    displayMonthYear.textContent = new Date(year, month).toLocaleString(undefined, { month: 'long', year: 'numeric' });

    const dateCell = document.querySelector(`[data-date="${date}"]`) as HTMLTableCellElement;
    dateCell.classList.add('selected-date');

    if (dateCell.dataset.holiday || dateCell.dataset.phase) {
        eventsList.innerHTML = '';

        const events = [dateCell.dataset.holiday?.split(', ')?.map((holiday) => `${holidayEmojis[holiday] ? `${holidayEmojis[holiday]} ` : ''}${holiday}`), dateCell.dataset.phase ? `${moonEmojis[dateCell.dataset.phase]} ${dateCell.dataset.phase} (${dateCell.dataset.time as string})` : null].flat().filter(Boolean) as string[];

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
            const cell = document.querySelector(`[data-date="${date.getDate()}"]`) as HTMLTableCellElement;
            cell.classList.add('holiday');
            if (!cell.dataset.holiday) cell.dataset.holiday = holiday.name;
            else cell.dataset.holiday += `, ${holiday.name}`;
        }
    });

    events.moonPhases.forEach((moonPhase) => {
        const date = new Date(`${moonPhase.date} ${moonPhase.time} UTC`);
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
            const cell = document.querySelector(`[data-date="${date.getDate()}"]`) as HTMLTableCellElement;
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

/**
 * Loads the todo list
 */
function loadTodoList() {
    if (!todoList) return showAlert('Please log in to use the todo list!', 'error');

    const todoListDate = new Date(displayedYear, displayedMonth, displayedDate);

    todoList.innerHTML = '';

    (todoData as TodoData).todo.forEach((todo) => {
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
            todoElement.dataset.id = todo.id;

            const todoCheckbox = document.createElement('input');
            todoCheckbox.type = 'checkbox';
            todoCheckbox.classList.add('todo-checkbox');
            todoCheckbox.id = `todo-${todo.id}`;
            todoCheckbox.dataset.id = todo.id;
            todoCheckbox.checked = !!(todoData as TodoData).data[todoListDate.getFullYear()]?.[todoListDate.getMonth() + 1]?.[todoListDate.getDate()]?.[todo.id];
            todoCheckbox.addEventListener('change', () => {
                const todoFinal: { [id: string]: boolean } = {};
                (todoList.querySelectorAll('.todo-checkbox') as NodeListOf<HTMLInputElement>).forEach((checkbox) => (todoFinal[checkbox.dataset.id as string] = checkbox.checked));

                if (Object.entries(todoFinal).some(([id, checked]) => !!(todoData as TodoData).data[todoListDate.getFullYear()]?.[todoListDate.getMonth() + 1]?.[todoListDate.getDate()]?.[id] !== checked)) todoSaveButton.disabled = false;
                else todoSaveButton.disabled = true;
            });

            const todoLabel = document.createElement('label');
            todoLabel.classList.add('todo-label');
            todoLabel.htmlFor = `todo-${todo.id}`;

            const checkboxSpan = document.createElement('span');
            checkboxSpan.classList.add('checkbox-container');

            const checkboxSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            checkboxSvg.setAttribute('width', '12px');
            checkboxSvg.setAttribute('height', '10px');
            checkboxSvg.setAttribute('viewBox', '0 0 12 10');

            const checkboxPolyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            checkboxPolyline.setAttribute('points', '1.5 6 4.5 9 10.5 1');

            checkboxSvg.appendChild(checkboxPolyline);
            checkboxSpan.appendChild(checkboxSvg);

            const todoLabelText = document.createElement('span');
            todoLabelText.classList.add('todo-label-text');
            todoLabelText.textContent = todo.title;

            todoLabel.appendChild(checkboxSpan);
            todoLabel.appendChild(todoLabelText);

            todoElement.appendChild(todoCheckbox);
            todoElement.appendChild(todoLabel);

            todoList.appendChild(todoElement);
        }
    });

    const todoSaveButton = document.createElement('button');
    todoSaveButton.id = 'todo-save-button';
    todoSaveButton.textContent = 'Save changes';
    todoSaveButton.disabled = true;
    todoSaveButton.addEventListener('click', async () => {
        const allCheckboxes = todoList.querySelectorAll('.todo-checkbox') as NodeListOf<HTMLInputElement>;
        allCheckboxes.forEach((checkbox) => (checkbox.disabled = true));
        todoSaveButton.disabled = true;

        const todoFinal = {} as { [id: string]: boolean };
        allCheckboxes.forEach((checkbox) => (todoFinal[checkbox.dataset.id as string] = checkbox.checked));

        const result = (await (
            await fetch('/calendar-todo-edit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: todoList.dataset.password,
                    date: displayedDate,
                    month: displayedMonth + 1,
                    year: displayedYear,
                    todo: todoFinal
                })
            })
        ).json()) as TodoData & { error?: string };

        if (result.error) showAlert(result.error, 'error');

        todoData = result;

        allCheckboxes.forEach((checkbox) => (checkbox.disabled = false));
    });

    todoList.appendChild(todoSaveButton);
}
