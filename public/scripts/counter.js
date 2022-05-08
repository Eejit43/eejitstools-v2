const numberDisplay = document.getElementById('counter');
const activationButton = document.getElementById('activation-button');
const reset = document.getElementById('reset');
const manualActivation = document.getElementById('manual-activation');

let number = 0;
let key = 'Space';

/* Add event listeners */
activationButton.addEventListener('change', updateKey);
reset.addEventListener('click', () => {
    showAlert('Reset!', 'success');
    number = 0;
    numberDisplay.innerHTML = 0;
    activationButton.value = '1';
    key = 'Space';
    blurAll();
});
document.addEventListener('keyup', (event) => {
    blurAll();
    if (event.code === key) {
        number++;
        numberDisplay.innerHTML = number;
    }
});
manualActivation.addEventListener('click', () => {
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
    if (activationButton.value === '1') key = 'Space';
    else if (activationButton.value === '2') key = 'Enter';
    else if (activationButton.value === '3') key = 'KeyC';
    blurAll();
}
