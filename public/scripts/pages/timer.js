import { showAlert, showResult, resetResult } from '/scripts/functions.js';

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

function checkInput(element) {
    if (element.value?.length > element.maxLength) element.value = element.value.slice(0, element.maxLength);
    if (element.value > element.max || element.value < 1) element.value = element.value.slice(0, 1);
}

const audio = new Audio('/timer-alarm.mp3');

let paused = true;

let targetTime, runTimer;
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
function displayTime() {
    if (paused) return;

    remaining = (targetTime - Date.now()) / 1000;

    if (remaining <= 0) {
        timerDisplay.innerHTML = 'Ended! <i class="fa-solid fa-bell fa-shake" style="color: #ffaa00"></i>';
        audio.play();
        audio.loop = true;
        pauseResumeTimer.disabled = true;
        return;
    }

    secondsUntil = Math.floor(remaining % 60);
    minutesUntil = Math.floor((remaining % 3600) / 60);
    hoursUntil = Math.floor(remaining / 3600);

    timerDisplay.textContent = `${hoursUntil}h ${minutesUntil}m ${secondsUntil}s`;

    requestAnimationFrame(displayTime);

    const targetDate = new Date(targetTime);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = targetDate.getDate();
    const month = months[targetDate.getMonth()];
    const year = targetDate.getFullYear();
    const fullHours = targetDate.getHours();
    const hours = ((fullHours + 11) % 12) + 1;
    let minutes = targetDate.getMinutes();
    let seconds = targetDate.getSeconds();

    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;

    const timeSuffix = fullHours >= 12 ? 'PM' : 'AM';

    const output = `${month} ${date}, ${year} ${hours}:${minutes}:${seconds} ${timeSuffix}`;
    if (timerTime.textContent !== output) timerTime.textContent = output;
}
