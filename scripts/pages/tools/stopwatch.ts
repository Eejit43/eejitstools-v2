const startButton = document.getElementById('start') as HTMLButtonElement;
const stopButton = document.getElementById('stop') as HTMLButtonElement;
const resetButton = document.getElementById('reset') as HTMLButtonElement;

const hoursDisplay = document.getElementById('hours-display') as HTMLSpanElement;
const minutesDisplay = document.getElementById('minutes-display') as HTMLSpanElement;
const secondsDisplay = document.getElementById('seconds-display') as HTMLSpanElement;
const millisecondsDisplay = document.getElementById('milliseconds-display') as HTMLSpanElement;

/* Add event listeners */
startButton.addEventListener('click', startStopwatch);
stopButton.addEventListener('click', stopStopwatch);
resetButton.addEventListener('click', resetStopwatch);

let offset = 0;
let paused = true;

displayTime();

stopButton.disabled = true;

/**
 * Starts the stopwatch
 */
function startStopwatch() {
    if (paused) {
        paused = false;
        offset -= Date.now();
        displayTime();

        startButton.disabled = true;
        stopButton.disabled = false;
    }
}

/**
 * Stops (pauses) the stopwatch
 */
function stopStopwatch() {
    if (!paused) {
        paused = true;
        offset += Date.now();

        startButton.disabled = false;
        stopButton.disabled = true;
    }
}

/**
 * Stops and resets the stopwatch
 */
function resetStopwatch() {
    paused = true;
    offset = 0;
    displayTime();

    startButton.disabled = false;
    stopButton.disabled = false;
}

/**
 * Displays the stopwatch's current time
 */
function displayTime() {
    const value = paused ? offset : Date.now() + offset;

    millisecondsDisplay.textContent = format(value, 1, 1000, 3);
    secondsDisplay.textContent = format(value, 1000, 60, 2);
    minutesDisplay.textContent = format(value, 60000, 60, 2);
    hoursDisplay.textContent = format(value, 3600000, null, 2);

    if (!paused) requestAnimationFrame(displayTime);
}

/**
 * Formats a time (unix, milliseconds)
 * @param {number} value the value to format
 * @param {number} scale the scale (number to divide by)
 * @param {number|null} modulo the number to divide by and return the remainder (`null` = no division)
 * @param {number} padding the length of the number to pad the start of the ending value with
 * @returns {number} the formatted value
 */
function format(value: number, scale: number, modulo: number | null, padding: number) {
    return modulo
        ? (Math.floor(value / scale) % modulo).toString().padStart(padding, '0')
        : Math.floor(value / scale)
              .toString()
              .padStart(padding, '0');
}
