let numberDisplay = document.getElementById('counter');
let activationButton = document.getElementById('activation-button');
let reset = document.getElementById('reset');
let manualActivation = document.getElementById('manual-activation');

let number = 0;
let key = 'Space';

/* Add event listeners */
activationButton.addEventListener('change', updateKey);
reset.addEventListener('click', function () {
    showAlert('Reset!', 'success');
    number = 0;
    numberDisplay.innerHTML = 0;
    activationButton.value = '1';
    key = 'Space';
    blurAll();
});
document.addEventListener(
    'keyup',
    (event) => {
        blurAll();
        if (event.code === key) {
            number++;
            numberDisplay.innerHTML = number;
        }
    },
    false
);
manualActivation.addEventListener('click', function () {
    blurAll();
    number++;
    numberDisplay.innerHTML = number;
});

function blurAll() {
    activationButton.blur();
    manualActivation.blur();
    reset.blur();
}

function updateKey() {
    if (activationButton.value === '1') {
        key = 'Space';
    } else if (activationButton.value === '2') {
        key = 'Enter';
    } else if (activationButton.value === '3') {
        key = 'KeyC';
    }
    blurAll();
}
