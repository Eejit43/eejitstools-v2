import { showAlert } from '../../functions.js';

const numberDisplay = document.querySelector<HTMLSpanElement>('#counter')!;
const activationSelect = document.querySelector<HTMLSelectElement>('#activation-button')!;
const resetButton = document.querySelector<HTMLButtonElement>('#reset')!;
const manualActivationButton = document.querySelector<HTMLButtonElement>('#manual-activation')!;

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
 * Removes the focus from important inputs to prevent multiple activations.
 */
function blurAll() {
    activationSelect.blur();
    manualActivationButton.blur();
    resetButton.blur();
}
