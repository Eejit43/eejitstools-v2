import type { CalendarEvents } from '../../../../route-handlers/calendar.js';
import { holidayEmojis, moonEmojis } from '../../../data/emojis.js';
import { showAlert, showResult, twemojiUpdate } from '../../functions.js';

const monthYearDisplay = document.querySelector<HTMLDivElement>('#month-year')!;
const calendarBody = document.querySelector<HTMLTableSectionElement>('#calendar-body')!;
const previousMonthButton = document.querySelector<HTMLButtonElement>('#previous-month')!;
const nextMonthButton = document.querySelector<HTMLButtonElement>('#next-month')!;
const currentDateButton = document.querySelector<HTMLButtonElement>('#current-date')!;
const jumpMonthSelection = document.querySelector<HTMLSelectElement>('#jump-month')!;
const jumpYearSelection = document.querySelector<HTMLSelectElement>('#jump-year')!;

const displayDay = document.querySelector<HTMLDivElement>('#display-day')!;
const displayDate = document.querySelector<HTMLDivElement>('#display-date')!;
const displayMonthYear = document.querySelector<HTMLDivElement>('#display-month-year')!;
const eventsList = document.querySelector<HTMLUListElement>('#events-list')!;

const loginPassword = document.querySelector<HTMLInputElement>('#login-password')!;
const loginButton = document.querySelector<HTMLButtonElement>('#login-button')!;
const todoList = document.querySelector<HTMLDivElement>('#todo-list')!;

previousMonthButton.addEventListener('click', previousMonth);
nextMonthButton.addEventListener('click', nextMonth);
currentDateButton.addEventListener('click', currentDate);
for (const element of [jumpMonthSelection, jumpYearSelection]) element.addEventListener('change', jump);

loginPassword.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && loginPassword.value.length > 0) loginButton.click();
});

interface TodoData {
    todo: { title: string; id: string; frequency: string }[];
    data: Record<string, Record<string, Record<string, Record<string, string>>>>;
}

let todoData = null as TodoData | null;

loginButton.addEventListener('click', async () => {
    const result = (await (await fetch(`/calendar-todo?password=${loginPassword.value}`)).json()) as TodoData & { error?: boolean };

    if (result.error) {
        showAlert('Incorrect password!', 'error');
        showResult(loginButton, 'error');
    } else {
        todoData = result;

        showAlert('Logged in!', 'success');

        todoList.dataset.password = loginPassword.value;

        loadTodoList();
    }
});

const parameters = new URLSearchParams(window.location.search);
const password = parameters.get('password');

if (password) {
    loginPassword.value = password;
    loginButton.click();
}

document.addEventListener('keydown', (event) => {
    if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
    )
        return;

    switch (event.code) {
        case 'ArrowUp': {
            previousMonth();
            break;
        }
        case 'ArrowDown': {
            nextMonth();
            break;
        }
        case 'ArrowLeft': {
            previousDay();
            break;
        }
        case 'ArrowRight': {
            nextDay();
            break;
        }
        case 'KeyC': {
            currentDate();
            break;
        }
        case 'KeyS': {
            const saveButton = document.querySelector<HTMLButtonElement>('#todo-save-button')!;
            if (saveButton && !saveButton.disabled) saveButton.click();
        }
    }
});

let currentTime = new Date();
let displayedDate = currentTime.getDate();
let currentMonth = currentTime.getMonth();
let displayedMonth = currentTime.getMonth();
let currentYear = currentTime.getFullYear();
let displayedYear = currentTime.getFullYear();

const events = (await (await fetch('/calendar-events')).json()) as CalendarEvents;

showCalendar(displayedDate, currentMonth, currentYear);

/**
 * Goes to the previous month.
 */
function previousMonth() {
    if (currentMonth === 0) currentYear--;
    currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    showCalendar(null, currentMonth, currentYear);
}

/**
 * Goes to the next month.
 */
function nextMonth() {
    if (currentMonth === 11) currentYear++;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(null, currentMonth, currentYear);
}

/**
 * Goes to the previous day.
 */
function previousDay() {
    if (displayedDate === 1) {
        if (displayedMonth === 0) displayedYear--;
        displayedMonth = displayedMonth === 0 ? 11 : displayedMonth - 1;
        currentMonth = displayedMonth;
        currentYear = displayedYear;
        showCalendar(new Date(displayedYear, displayedMonth + 1, 0).getDate(), currentMonth, currentYear);
    } else if (currentMonth === displayedMonth && currentYear === displayedYear)
        updateDisplayedDate(displayedDate - 1, displayedMonth, displayedYear);
    else {
        currentMonth = displayedMonth;
        currentYear = displayedYear;
        showCalendar(displayedDate - 1, displayedMonth, displayedYear);
    }
}

/**
 * Goes to the next day.
 */
function nextDay() {
    if (displayedDate === new Date(displayedYear, displayedMonth + 1, 0).getDate()) {
        if (displayedMonth === 11) displayedYear++;
        displayedMonth = (displayedMonth + 1) % 12;
        currentMonth = displayedMonth;
        currentYear = displayedYear;
        showCalendar(1, displayedMonth, displayedYear);
    } else if (currentMonth === displayedMonth && currentYear === displayedYear)
        updateDisplayedDate(displayedDate + 1, displayedMonth, displayedYear);
    else {
        currentMonth = displayedMonth;
        currentYear = displayedYear;
        showCalendar(displayedDate + 1, displayedMonth, displayedYear);
    }
}

/**
 * Jumps to the current date.
 */
function currentDate() {
    currentTime = new Date();
    currentMonth = currentTime.getMonth();
    currentYear = currentTime.getFullYear();
    showCalendar(currentTime.getDate(), currentMonth, currentYear);
}

/**
 * Jumps to the selected month and year.
 */
function jump() {
    currentMonth = Number.parseInt(jumpMonthSelection.value);
    currentYear = Number.parseInt(jumpYearSelection.value);
    showCalendar(null, currentMonth, currentYear);
}

/**
 * Shows the calendar for the given month and year.
 * @param date The date to display.
 * @param month The month to display.
 * @param year The year to display.
 */
function showCalendar(date: number | null, month: number, year: number) {
    jumpYearSelection.innerHTML = '';
    for (let relativeYear = year - 10; relativeYear <= year + 10; relativeYear++) {
        const option = document.createElement('option');
        option.value = relativeYear.toString();
        option.text = relativeYear.toString();
        jumpYearSelection.append(option);
    }

    const firstDay = new Date(year, month).getDay();
    const daysInMonth = 32 - new Date(year, month, 32).getDate();

    calendarBody.innerHTML = '';

    monthYearDisplay.textContent = new Date(year, month).toLocaleString(undefined, { month: 'long', year: 'numeric' });
    jumpYearSelection.value = year.toString();
    jumpMonthSelection.value = month.toString();

    let currentDate = 1;
    for (let index = 0; index < 6; index++) {
        const row = document.createElement('tr');

        for (let dayIndex = 0; dayIndex < 7; dayIndex++)
            if (index === 0 && dayIndex < firstDay) {
                const cell = document.createElement('td');
                cell.classList.add('no-date');
                row.append(cell);
            } else if (currentDate > daysInMonth) {
                if (dayIndex === 0) break;

                const cell = document.createElement('td');
                cell.classList.add('no-date');
                row.append(cell);
            } else {
                const cell = document.createElement('td');
                cell.dataset.date = currentDate.toString();
                cell.textContent = currentDate.toString();
                if (currentDate === currentTime.getDate() && month === currentTime.getMonth() && year === currentTime.getFullYear())
                    cell.classList.add('current-date');
                if (currentDate === displayedDate && month === displayedMonth && year === displayedYear)
                    cell.classList.add('selected-date');
                cell.addEventListener('click', () => updateDisplayedDate(Number.parseInt(cell.dataset.date!), month, year));
                row.append(cell);
                currentDate++;
            }

        calendarBody.append(row);
    }

    loadCalendarEvents();

    if (date) updateDisplayedDate(date, month, year);
}

/**
 * Updates the displayed date.
 * @param date The date to display.
 * @param month The month to display.
 * @param year The year to display.
 */
function updateDisplayedDate(date: number, month: number, year: number) {
    displayedDate = date;
    displayedMonth = month;
    displayedYear = year;

    document.querySelector('.selected-date')?.classList?.remove('selected-date');
    displayDay.textContent = new Date(year, month, date).toLocaleString(undefined, { weekday: 'long' });
    displayDate.textContent = date.toString();
    displayMonthYear.textContent = new Date(year, month).toLocaleString(undefined, { month: 'long', year: 'numeric' });

    const dateCell = document.querySelector<HTMLTableCellElement>(`[data-date="${date}"]`)!;
    dateCell.classList.add('selected-date');

    if (dateCell.dataset.holiday ?? dateCell.dataset.phase) {
        eventsList.innerHTML = '';

        const events = [
            dateCell.dataset.holiday
                ?.split(', ')
                ?.map((holiday) => `${holidayEmojis[holiday] ? `${holidayEmojis[holiday]} ` : ''}${holiday}`),
            dateCell.dataset.phase ? `${moonEmojis[dateCell.dataset.phase]} ${dateCell.dataset.phase} (${dateCell.dataset.time!})` : null,
        ]
            .flat()
            .filter(Boolean) as string[];

        for (const event of events) {
            const eventElement = document.createElement('li');
            eventElement.textContent = event;
            eventsList.append(eventElement);
        }

        twemojiUpdate();
    } else eventsList.innerHTML = 'None';

    if (todoData) loadTodoList();
}

/**
 * Loads the calendar events.
 */
function loadCalendarEvents() {
    for (const holiday of events.holidays) {
        const date = new Date(`${holiday.date}T00:00:00`);
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
            const cell = document.querySelector<HTMLTableCellElement>(`[data-date="${date.getDate()}"]`)!;
            cell.classList.add('holiday');
            if (cell.dataset.holiday) cell.dataset.holiday += `, ${holiday.name}`;
            else cell.dataset.holiday = holiday.name;
        }
    }

    for (const moonPhase of events.moonPhases) {
        const date = new Date(`${moonPhase.date} ${moonPhase.time} UTC`);
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
            const cell = document.querySelector<HTMLTableCellElement>(`[data-date="${date.getDate()}"]`)!;
            cell.dataset.phase = moonPhase.phase;
            cell.dataset.time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' });

            const moonIcon = document.createElement('span');
            moonIcon.classList.add('moon-icon');
            moonIcon.textContent = moonEmojis[moonPhase.phase];
            cell.append(moonIcon);
        }
    }

    twemojiUpdate();
}

/**
 * Loads the todo list.
 */
function loadTodoList() {
    if (!todoList) return showAlert('Please log in to use the todo list!', 'error');

    const todoListDate = new Date(displayedYear, displayedMonth, displayedDate);

    todoList.innerHTML = '';

    for (const todo of todoData!.todo)
        if (
            todo.frequency === 'daily' ||
            (todo.frequency === 'weekly' && todoListDate.getDay() === 0) ||
            (todo.frequency.includes('days:') &&
                todo.frequency
                    .replace('days:', '')
                    .split(',')
                    .some((day) => Number.parseInt(day) === todoListDate.getDay()))
        ) {
            const todoElement = document.createElement('div');
            todoElement.classList.add('todo');
            todoElement.dataset.id = todo.id;

            const todoCheckbox = document.createElement('input');
            todoCheckbox.type = 'checkbox';
            todoCheckbox.classList.add('todo-checkbox');
            todoCheckbox.id = `todo-${todo.id}`;
            todoCheckbox.dataset.id = todo.id;
            todoCheckbox.checked =
                !!todoData!.data[todoListDate.getFullYear()]?.[todoListDate.getMonth() + 1]?.[todoListDate.getDate()]?.[todo.id];
            todoCheckbox.addEventListener('change', () => {
                const todoFinal: Record<string, boolean> = {};
                for (const checkbox of todoList.querySelectorAll<HTMLInputElement>('.todo-checkbox'))
                    todoFinal[checkbox.dataset.id!] = checkbox.checked;

                todoSaveButton.disabled = !Object.entries(todoFinal).some(
                    ([id, checked]) =>
                        !!todoData!.data[todoListDate.getFullYear()]?.[todoListDate.getMonth() + 1]?.[todoListDate.getDate()]?.[id] !==
                        checked,
                );
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

            checkboxSvg.append(checkboxPolyline);
            checkboxSpan.append(checkboxSvg);

            const todoLabelText = document.createElement('span');
            todoLabelText.classList.add('todo-label-text');
            todoLabelText.textContent = todo.title;

            todoLabel.append(checkboxSpan);
            todoLabel.append(todoLabelText);

            todoElement.append(todoCheckbox);
            todoElement.append(todoLabel);

            todoList.append(todoElement);
        }

    const todoSaveButton = document.createElement('button');
    todoSaveButton.id = 'todo-save-button';
    todoSaveButton.textContent = 'Save changes';
    todoSaveButton.disabled = true;
    todoSaveButton.addEventListener('click', async () => {
        const allCheckboxes = todoList.querySelectorAll<HTMLInputElement>('.todo-checkbox');
        for (const checkbox of allCheckboxes) checkbox.disabled = true;
        todoSaveButton.disabled = true;

        const todoFinal = {} as Record<string, boolean>;
        for (const checkbox of allCheckboxes) todoFinal[checkbox.dataset.id!] = checkbox.checked;

        const result = (await (
            await fetch('/calendar-todo-edit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: todoList.dataset.password,
                    date: displayedDate,
                    month: displayedMonth + 1,
                    year: displayedYear,
                    todo: todoFinal,
                }),
            })
        ).json()) as TodoData & { error?: string };

        if (result.error) showAlert(result.error, 'error');

        todoData = result;

        for (const checkbox of allCheckboxes) checkbox.disabled = false;
    });

    todoList.append(todoSaveButton);
}
