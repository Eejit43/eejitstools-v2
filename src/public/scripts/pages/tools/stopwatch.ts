const startButton = document.querySelector<HTMLButtonElement>('#start')!;
const stopButton = document.querySelector<HTMLButtonElement>('#stop')!;
const resetButton = document.querySelector<HTMLButtonElement>('#reset')!;

const hoursDisplay = document.querySelector<HTMLSpanElement>('#hours-display')!;
const minutesDisplay = document.querySelector<HTMLSpanElement>('#minutes-display')!;
const secondsDisplay = document.querySelector<HTMLSpanElement>('#seconds-display')!;
const millisecondsDisplay = document.querySelector<HTMLSpanElement>('#milliseconds-display')!;

/* Add event listeners */
startButton.addEventListener('click', startStopwatch);
stopButton.addEventListener('click', stopStopwatch);
resetButton.addEventListener('click', resetStopwatch);

let offset = 0;
let paused = true;

displayTime();

stopButton.disabled = true;

/**
 * Starts the stopwatch.
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
 * Stops (pauses) the stopwatch.
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
 * Stops and resets the stopwatch.
 */
function resetStopwatch() {
    paused = true;
    offset = 0;
    displayTime();

    startButton.disabled = false;
    stopButton.disabled = true;
}

/**
 * Displays the stopwatch's current time.
 */
function displayTime() {
    const value = paused ? offset : Date.now() + offset;

    millisecondsDisplay.textContent = format(value, 1, 1000, 3);
    secondsDisplay.textContent = format(value, 1000, 60, 2);
    minutesDisplay.textContent = format(value, 60_000, 60, 2);
    hoursDisplay.textContent = format(value, 3_600_000, null, 2);

    if (!paused) requestAnimationFrame(displayTime);
}

/**
 * Formats a time (unix, milliseconds).
 * @param value The value to format.
 * @param scale The scale (number to divide by).
 * @param modulo The number to divide by and return the remainder (`null` = no division).
 * @param padding The length of the number to pad the start of the ending value with.
 */
function format(value: number, scale: number, modulo: number | null, padding: number) {
    return modulo
        ? (Math.floor(value / scale) % modulo).toString().padStart(padding, '0')
        : Math.floor(value / scale)
              .toString()
              .padStart(padding, '0');
}
