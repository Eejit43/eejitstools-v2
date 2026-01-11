import { showAlert, showResult } from '@scripts/functions.js';

const startTimerButton = document.querySelector<HTMLButtonElement>('#start-timer')!;
const pauseResumeTimerButton = document.querySelector<HTMLButtonElement>('#pause-resume-timer')!;
const resetButton = document.querySelector<HTMLButtonElement>('#reset')!;
const hoursInput = document.querySelector<HTMLInputElement>('#hours')!;
const minutesInput = document.querySelector<HTMLInputElement>('#minutes')!;
const secondsInput = document.querySelector<HTMLInputElement>('#seconds')!;
const timerDisplay = document.querySelector<HTMLSpanElement>('#timer')!;
const timerTime = document.querySelector<HTMLSpanElement>('#timer-time')!;

/* Add event listeners */
startTimerButton.addEventListener('click', startTimer);
pauseResumeTimerButton.addEventListener('click', () => {
    if (paused) {
        paused = false;
        pauseResumeTimerButton.textContent = 'Pause';

        targetTime = Date.now() + remaining * 1000;
        displayTime();
    } else {
        if (timeout) clearTimeout(timeout);
        timeout = null;
        paused = true;
        pauseResumeTimerButton.textContent = 'Resume';
    }
});
resetButton.addEventListener('click', () => {
    if (timeout) clearTimeout(timeout);
    timeout = null;

    paused = true;
    displayTime();

    audio.pause();
    audio.currentTime = 0;
    pauseResumeTimerButton.textContent = 'Pause';
    timerTime.textContent = '';
    startTimerButton.disabled = false;
    pauseResumeTimerButton.disabled = true;
    hoursInput.value = '0';
    minutesInput.value = '1';
    secondsInput.value = '0';
    timerDisplay.textContent = '0h 0m 0s';

    showAlert('Reset!', 'success');
});
hoursInput.addEventListener('input', () => {
    hoursInput.value = hoursInput.value.replaceAll(/((?!\d).)/g, '');
    checkInput(hoursInput);
});
minutesInput.addEventListener('input', () => {
    minutesInput.value = minutesInput.value.replaceAll(/((?!\d).)/g, '');
    checkInput(minutesInput);
});
secondsInput.addEventListener('input', () => {
    secondsInput.value = secondsInput.value.replaceAll(/((?!\d).)/g, '');
    checkInput(secondsInput);
});

/**
 * Checks and updates an elements value if needed.
 * @param element The element to check and update.
 */
function checkInput(element: HTMLInputElement) {
    if (element.value.length > element.maxLength) element.value = element.value.slice(0, element.maxLength);
    if ((element.max && element.value > element.max) || Number.parseInt(element.value) < 1) element.value = element.value.slice(0, 1);
}

const audio = new Audio('/files/timer-alarm.mp3');
audio.loop = true;

let paused = true;

let targetTime: number;

/**
 * Starts the timer.
 */
function startTimer() {
    if (!paused) return;

    audio.pause();
    audio.currentTime = 0;
    paused = false;
    const hours = Number.parseInt(hoursInput.value);
    const minutes = Number.parseInt(minutesInput.value);
    const seconds = Number.parseInt(secondsInput.value);

    if (Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds)) {
        showAlert('Empty input!', 'warning');
        showResult(startButton, 'warning');
    } else if (hours <= 0 && minutes <= 0 && seconds <= 0) {
        showAlert('Invalid input!', 'error');
        showResult(startButton, 'error');
    } else {
        startTimerButton.disabled = true;
        pauseResumeTimerButton.disabled = false;

        targetTime = Date.now() + (hours * 360 + minutes * 60 + seconds) * 1000;
        requestAnimationFrame(displayTime);
    }
}

let remaining: number, secondsUntil: number, minutesUntil: number, hoursUntil: number;

let timeout: number | null = null;

/**
 * Displays the current timer time.
 */
function displayTime() {
    if (paused) return;

    remaining = (targetTime - Date.now()) / 1000;

    timeout ??= setTimeout(timerEnd, remaining * 1000) as unknown as number;

    if (remaining <= 0) return;

    secondsUntil = Math.floor(remaining % 60);
    minutesUntil = Math.floor((remaining % 3600) / 60);
    hoursUntil = Math.floor(remaining / 3600);

    timerDisplay.textContent = `${hoursUntil}h ${minutesUntil}m ${secondsUntil}s`;

    requestAnimationFrame(displayTime);

    const targetDate = new Date(targetTime);

    const output = `${targetDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric', second: 'numeric' })}, ${targetDate.toLocaleDateString(undefined, { weekday: 'long' })}`;
    if (timerTime.textContent !== output) timerTime.textContent = output;
}

/**
 * The function called when the timer ends.
 */
function timerEnd() {
    timerDisplay.innerHTML = 'Ended! <i class="fa-solid fa-bell fa-shake" style="color: var(--brand-color-3)"></i>';
    void audio.play();
    pauseResumeTimerButton.disabled = true;
}
