import { showAlert } from '../../functions.js';

const numberDisplay = document.querySelector('#counter') as HTMLSpanElement;
const activationSelect = document.querySelector('#activation-button') as HTMLSelectElement;
const resetButton = document.querySelector('#reset') as HTMLButtonElement;
const manualActivationButton = document.querySelector('#manual-activation') as HTMLButtonElement;

let number = 0;
let key = 'Space';

/* Add event listeners */
activationSelect.addEventListener('change', () => {
    blurAll();
    switch (activationSelect.value) {
        case '1': {
            key = 'Space';
            break;
        }
        case '2': {
            key = 'Enter';
            break;
        }
        case '3': {
            key = 'KeyC';
        }
    }
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
