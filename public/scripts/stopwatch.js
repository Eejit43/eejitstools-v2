// Modified from https://jsfiddle.net/Larph/he10jyu9/

let startButton = document.getElementById('start');
let stopButton = document.getElementById('stop');
let resetButton = document.getElementById('reset');

let hoursDisplay = document.getElementById('hours-display');
let minutesDisplay = document.getElementById('minutes-display');
let secondsDisplay = document.getElementById('seconds-display');
let millisecondsDisplay = document.getElementById('milliseconds-display');

/* Add event listeners */
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);

let hrs, min, sec, mil, pt, tt, iID;
let dt = (ps = 0);
let t = 0;
let running,
    started = false;

function timerCycle() {
    if (running) {
        t = performance.now() * 0.001;
        dt += t - pt;
        pt = t;
        tt = Math.floor(dt);
        mil = dt - tt;
        millisecondsDisplay.textContent = mil.toFixed(3).slice(-3);
        sec = tt % 60;
        if (sec === ps) return;
        ps = sec;
        min = Math.floor(tt / 60) % 60;
        hrs = Math.floor(tt / 3600);
        hoursDisplay.textContent = ('0' + hrs).slice(-2);
        minutesDisplay.textContent = ('0' + min).slice(-2);
        secondsDisplay.textContent = ('0' + sec).slice(-2);
    }
}

function stop() {
    if (iID) {
        clearInterval(iID);
        iID = 0;
    }
}

function start() {
    if (started && !running) {
        running = true;
        t = pt = performance.now() * 0.001;
        iID = setInterval(timerCycle, 33);
    }
}

function startTimer() {
    if (!started) {
        started = true;
        stop();
        start();
    }
}

function stopTimer() {
    if (started) {
        started = running = false;
        stop();
    }
}

function resetTimer() {
    started = running = false;
    stop();
    dt = ps = 0;
    hoursDisplay.textContent = '00';
    minutesDisplay.textContent = '00';
    secondsDisplay.textContent = '00';
    millisecondsDisplay.textContent = '000';
}
