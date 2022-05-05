let startTimerButton = document.getElementById('start-timer');
let pauseResumeTimer = document.getElementById('pause-resume-timer');
let resetButton = document.getElementById('reset');
let hoursButton = document.getElementById('hours');
let minutesButton = document.getElementById('minutes');
let secondsButton = document.getElementById('seconds');
let timerDisplay = document.getElementById('timer');
let timerTime = document.getElementById('timer-time');

/* Add event listeners */
startTimerButton.addEventListener('click', startTimer);
pauseResumeTimer.addEventListener('click', pauseResume);
resetButton.addEventListener('click', reset);
hoursButton.addEventListener('input', function () {
    let input = hoursButton;
    input.value = input.value.replace(/((?![0-9]).)/g, '');
});
hoursButton.addEventListener('input', function () {
    checkInput(this);
});
minutesButton.addEventListener('input', function () {
    let input = minutesButton;
    input.value = input.value.replace(/((?![0-9]).)/g, '');
});
minutesButton.addEventListener('input', function () {
    checkInput(this);
});
secondsButton.addEventListener('input', function () {
    let input = secondsButton;
    input.value = input.value.replace(/((?![0-9]).)/g, '');
});
secondsButton.addEventListener('input', function () {
    checkInput(this);
});

function checkInput(element) {
    if (element.value.length > element.maxLength) element.value = element.value.slice(0, element.maxLength);
    if (element.value > element.max || element.value < 1) element.value = element.value.slice(0, 1);
}

let audio = new Audio('./timer-alarm.mp3');

function reset() {
    clearInterval(runTimer);
    audio.pause();
    audio.currentTime = 0;
    timerState = 1;
    pauseResumeTimer.innerHTML = 'Pause';
    timerTime.innerHTML = '';
    startTimerButton.disabled = false;
    pauseResumeTimer.disabled = true;
    hoursButton.value = '0';
    minutesButton.value = '1';
    secondsButton.value = '0';
    timerDisplay.innerHTML = '0h 0m 0s';
    showAlert('Reset!', 'success');
    resetResult('timer');
}

let targettime, runTimer;

function startTimer() {
    audio.pause();
    audio.currentTime = 0;
    timerState = 1;
    let hours = parseInt(hoursButton.value);
    let minutes = parseInt(minutesButton.value);
    let seconds = parseInt(secondsButton.value);
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
        showAlert('Empty input!', 'error');
        showResult('timer', 'error');
    } else if (hours <= 0 && minutes <= 0 && seconds <= 0) {
        showAlert('Invalid input!', 'error');
        showResult('timer', 'error');
    } else {
        startTimerButton.disabled = true;
        pauseResumeTimer.disabled = false;
        let timeuntil = (hours * 3600 + minutes * 60 + seconds) * 1000;

        let curtime = new Date().getTime();

        targettime = parseInt(String(curtime + timeuntil).slice(0, -3));

        let distance = targettime - curtime;
        runTimer = setInterval(timer, 500);
    }
}

let hoursuntil, minutesuntil, secondsuntil, targettimestring;

function timer() {
    let curtime = parseInt(String(new Date().getTime()).slice(0, -3));

    let distance = targettime - curtime;

    hoursuntil = Math.floor(distance / 3600);
    minutesuntil = Math.floor((distance - hoursuntil * 3600) / 60);
    secondsuntil = Math.floor(distance - hoursuntil * 3600 - minutesuntil * 60);

    timerDisplay.innerHTML = `${hoursuntil}h ${minutesuntil}m ${secondsuntil}s`;

    if (distance <= 0) {
        timerDisplay.innerHTML = 'Ended! <i class="fa-solid fa-bell fa-shake" style="color: gold"></i>';
        audio.play();
        audio.loop = true;
        clearInterval(runTimer);
    }

    let targettime2 = new Date(targettime * 1000);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let date = targettime2.getDate();
    let month = months[targettime2.getMonth()];
    let year = targettime2.getFullYear();
    let fullhours = targettime2.getHours();
    let hours = ((fullhours + 11) % 12) + 1;
    let minutes = targettime2.getMinutes();
    let sec = targettime2.getSeconds();

    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (sec < 10) {
        sec = '0' + sec;
    }

    let timesuffix = fullhours >= 12 ? 'PM' : 'AM';

    timerTime.innerHTML = month + ' ' + date + ', ' + year + ' ' + hours + ':' + minutes + ':' + sec + ' ' + timesuffix;
}

let timerState = 1; // 1 = running, 2 = paused

function pauseResume() {
    if (timerState === 1) {
        timerState = 2;
        pauseResumeTimer.innerHTML = 'Resume';
        clearInterval(runTimer);
    } else {
        timerState = 1;
        pauseResumeTimer.innerHTML = 'Pause';

        let hours2 = parseInt(hoursuntil);
        let minutes2 = parseInt(minutesuntil);
        let seconds2 = parseInt(secondsuntil);

        let curtime = new Date().getTime();

        let timeuntil = (hours2 * 3600 + minutes2 * 60 + seconds2) * 1000;
        targettime = parseInt(String(curtime + timeuntil).slice(0, -3));
        runTimer = setInterval(timer, 500);
    }
}
