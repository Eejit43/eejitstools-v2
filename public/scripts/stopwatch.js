// Modified from https://jsfiddle.net/Larph/he10jyu9/

const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');

const hoursDisplay = document.getElementById('hours-display');
const minutesDisplay = document.getElementById('minutes-display');
const secondsDisplay = document.getElementById('seconds-display');
const millisecondsDisplay = document.getElementById('milliseconds-display');

/* Add event listeners */
startButton.addEventListener('click', startStopwatch);
stopButton.addEventListener('click', stopStopwatch);
resetButton.addEventListener('click', resetStopwatch);

let offset = 0;
let paused = true;

displayTime();

function startStopwatch() {
    if (paused) {
        paused = false;
        offset -= Date.now();
        displayTime();
    }
}

function stopStopwatch() {
    if (!paused) {
        paused = true;
        offset += Date.now();
    }
}

function resetStopwatch() {
    stopStopwatch();
    if (paused) {
        offset = 0;
        displayTime();
    } else offset = -Date.now();
}

function format(value, scale, modulo, padding) {
    value = Math.floor(value / scale) % modulo;
    return value.toString().padStart(padding, 0);
}

function displayTime() {
    const value = paused ? offset : Date.now() + offset;

    millisecondsDisplay.textContent = format(value, 1, 1000, 3);
    secondsDisplay.textContent = format(value, 1000, 60, 2);
    minutesDisplay.textContent = format(value, 60000, 60, 2);

    if (!paused) requestAnimationFrame(displayTime);
}
