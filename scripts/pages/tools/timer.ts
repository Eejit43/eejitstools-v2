import { resetResult, showAlert, showResult } from '../../functions.js';

const startTimerButton = document.getElementById('start-timer');
const pauseResumeTimer = document.getElementById('pause-resume-timer');
const resetButton = document.getElementById('reset');
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const timerDisplay = document.getElementById('timer');
const timerTime = document.getElementById('timer-time');

/* Add event listeners */
startTimerButton.addEventListener('click', startTimer);
pauseResumeTimer.addEventListener('click', () => {
    if (!paused) {
        clearTimeout(timeout);
        timeout = null;
        paused = true;
        pauseResumeTimer.textContent = 'Resume';
    } else {
        paused = false;
        pauseResumeTimer.textContent = 'Pause';

        targetTime = Date.now() + remaining * 1000;
        displayTime();
    }
});
resetButton.addEventListener('click', () => {
    clearTimeout(timeout);
    timeout = null;

    paused = true;
    displayTime();

    audio.pause();
    audio.currentTime = 0;
    pauseResumeTimer.textContent = 'Pause';
    timerTime.textContent = '';
    startTimerButton.disabled = false;
    pauseResumeTimer.disabled = true;
    hoursInput.value = '0';
    minutesInput.value = '1';
    secondsInput.value = '0';
    timerDisplay.textContent = '0h 0m 0s';

    showAlert('Reset!', 'success');
    resetResult('timer');
});
hoursInput.addEventListener('input', () => {
    hoursInput.value = hoursInput.value.replace(/((?![0-9]).)/g, '');
    checkInput(hoursInput);
});
minutesInput.addEventListener('input', () => {
    minutesInput.value = minutesInput.value.replace(/((?![0-9]).)/g, '');
    checkInput(minutesInput);
});
secondsInput.addEventListener('input', () => {
    secondsInput.value = secondsInput.value.replace(/((?![0-9]).)/g, '');
    checkInput(secondsInput);
});

/**
 * Checks and updates an elements value if needed
 * @param {HTMLInputElement} element the element to check and update
 */
function checkInput(element) {
    if (element.value.length > element.maxLength) element.value = element.value.slice(0, element.maxLength);
    if ((element.max && element.value > element.max) || element.value < 1) element.value = element.value.slice(0, 1);
}

const audio = new Audio('/files/timer-alarm.mp3');
audio.loop = true;

window.audio = audio;

let paused = true;

let targetTime;

/**
 * Starts the timer
 */
function startTimer() {
    if (!paused) return;

    audio.pause();
    audio.currentTime = 0;
    paused = false;
    const hours = parseInt(hoursInput.value);
    const minutes = parseInt(minutesInput.value);
    const seconds = parseInt(secondsInput.value);

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
        showAlert('Empty input!', 'error');
        showResult('timer', 'error');
    } else if (hours <= 0 && minutes <= 0 && seconds <= 0) {
        showAlert('Invalid input!', 'error');
        showResult('timer', 'error');
    } else {
        startTimerButton.disabled = true;
        pauseResumeTimer.disabled = false;

        targetTime = Date.now() + (hours * 360 + minutes * 60 + seconds) * 1000;
        requestAnimationFrame(displayTime);
    }
}

let remaining, secondsUntil, minutesUntil, hoursUntil;

let timeout;

/**
 * Displays the current timer time
 */
function displayTime() {
    if (paused) return;

    remaining = (targetTime - Date.now()) / 1000;

    if (!timeout) timeout = setTimeout(timerEnd, remaining * 1000);

    if (remaining <= 0) return;

    secondsUntil = Math.floor(remaining % 60);
    minutesUntil = Math.floor((remaining % 3600) / 60);
    hoursUntil = Math.floor(remaining / 3600);

    timerDisplay.textContent = `${hoursUntil}h ${minutesUntil}m ${secondsUntil}s`;

    requestAnimationFrame(displayTime);

    const targetDate = new Date(targetTime);

    const output = `${targetDate.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', second: 'numeric' })}, ${targetDate.toLocaleDateString([], { weekday: 'long' })}`;
    if (timerTime.textContent !== output) timerTime.textContent = output;
}

/**
 * The function called when the timer ends
 */
function timerEnd() {
    timerDisplay.innerHTML = 'Ended! <i class="fa-solid fa-bell fa-shake" style="color: #ffaa00"></i>';
    audio.play();
    pauseResumeTimer.disabled = true;
}
