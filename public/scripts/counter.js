const numberDisplay = document.getElementById('counter');
const activationButton = document.getElementById('activation-button');
const reset = document.getElementById('reset');
const manualActivation = document.getElementById('manual-activation');

let number = 0;
let key = 'Space';

/* Add event listeners */
activationButton.addEventListener('change', () => {
    blurAll();
    if (activationButton.value === '1') key = 'Space';
    else if (activationButton.value === '2') key = 'Enter';
    else if (activationButton.value === '3') key = 'KeyC';
});
reset.addEventListener('click', () => {
    blurAll();
    number = 0;
    numberDisplay.textContent = '0';
    activationButton.value = '1';
    key = 'Space';

    showAlert('Reset!', 'success');
});
document.addEventListener('keyup', (event) => {
    blurAll();
    if (event.code === key) {
        number++;
        numberDisplay.textContent = number;
    }
});
manualActivation.addEventListener('click', () => {
    blurAll();
    number++;
    numberDisplay.textContent = number;
});

/**
 * Removes the focus from important buttons to prevent multiple activations
 */
function blurAll() {
    activationButton.blur();
    manualActivation.blur();
    reset.blur();
}
