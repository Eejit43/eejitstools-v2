import { showAlert } from '../../functions.js';

const numberDisplay = document.getElementById('counter') as HTMLSpanElement;
const activationSelect = document.getElementById('activation-button') as HTMLSelectElement;
const resetButton = document.getElementById('reset') as HTMLButtonElement;
const manualActivationButton = document.getElementById('manual-activation') as HTMLButtonElement;

let number = 0;
let key = 'Space';

/* Add event listeners */
activationSelect.addEventListener('change', () => {
    blurAll();
    if (activationSelect.value === '1') key = 'Space';
    else if (activationSelect.value === '2') key = 'Enter';
    else if (activationSelect.value === '3') key = 'KeyC';
});
resetButton.addEventListener('click', () => {
    blurAll();
    number = 0;
    numberDisplay.textContent = '0';
    activationSelect.value = '1';
    key = 'Space';

    showAlert('Reset!', 'success');
});
document.addEventListener('keyup', (event) => {
    blurAll();
    if (event.code === key) {
        number++;
        numberDisplay.textContent = number.toString();
    }
});
manualActivationButton.addEventListener('click', () => {
    blurAll();
    number++;
    numberDisplay.textContent = number.toString();
});

/**
 * Removes the focus from important buttons to prevent multiple activations.
 */
function blurAll() {
    activationSelect.blur();
    manualActivationButton.blur();
    resetButton.blur();
}
