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

stopButton.disabled = true;

function startStopwatch() {
    if (paused) {
        paused = false;
        offset -= Date.now();
        displayTime();

        startButton.disabled = true;
        stopButton.disabled = false;
    }
}

function stopStopwatch() {
    if (!paused) {
        paused = true;
        offset += Date.now();

        startButton.disabled = false;
        stopButton.disabled = true;
    }
}

function resetStopwatch() {
    paused = true;
    offset = 0;
    displayTime();

    startButton.disabled = false;
    stopButton.disabled = false;
}

function displayTime() {
    const value = paused ? offset : Date.now() + offset;

    millisecondsDisplay.textContent = format(value, 1, 1000, 3);
    secondsDisplay.textContent = format(value, 1000, 60, 2);
    minutesDisplay.textContent = format(value, 60000, 60, 2);
    hoursDisplay.textContent = format(value, 3600000, null, 2);

    if (!paused) requestAnimationFrame(displayTime);
}

function format(value, scale, modulo, padding) {
    return modulo ? (Math.floor(value / scale) % modulo).toString().padStart(padding, 0) : (Math.floor(value / scale)).toString().padStart(padding, 0); // prettier-ignore
}
