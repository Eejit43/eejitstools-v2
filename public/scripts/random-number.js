let minNumber = document.getElementById('min-number');
let maxNumber = document.getElementById('max-number');
let generate = document.getElementById('generate-number');
let resetButton = document.getElementById('reset');
let outputNumber = document.getElementById('random-number');

/* Add event listeners */
generate.addEventListener('click', generateNumber);
resetButton.addEventListener('click', reset);

function reset() {
    minNumber.value = '1';
    maxNumber.value = '10';
    outputNumber.innerHTML = '';
    showAlert('Cleared!', 'success');
    resetResult('generate');
}

function generateNumber() {
    let min = Number(minNumber.value);
    let max = Number(maxNumber.value);
    if (min.length === 0 || max.length === 0) {
        showAlert('Empty input!', 'error');
        showResult('generate', 'error');
    } else if (min > max || min === max) {
        showAlert('The minimum must be less than the maximum!', 'error');
        showResult('generate', 'error');
    } else {
        let output = Math.floor(Math.random() * (max - min + 1) + min).toLocaleString();
        outputNumber.innerHTML = output;
        showResult('generate', 'success');
    }
}
