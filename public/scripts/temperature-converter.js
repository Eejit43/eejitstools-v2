const inputType = document.getElementById('input-type');
const input = document.getElementById('input');
const resetButton = document.getElementById('reset');
const message = document.getElementById('message');
const outputType = document.getElementById('output-type');
const output = document.getElementById('output');
const copyOutput = document.getElementById('copy-output');

let inputTypeName, outputTypeName;

/* Add event listeners */
inputType.addEventListener('change', convert);
input.addEventListener('input', convert);
resetButton.addEventListener('click', reset);
outputType.addEventListener('change', convert);
copyOutput.addEventListener('click', () => {
    copyValue('output', 'copy-output');
});

function reset() {
    input.value = '';
    output.value = '';
    message.innerHTML = '';
    inputType.value = 1;
    outputType.value = 2;
    copyOutput.disabled = true;
    showAlert('Reset!', 'success');
}

function convert() {
    if (/^-?([0-9]\d*)(\.\d*|,\d*)*$/g.test(input.value) || /^-?\d*\.\d+$/g.test(input.value)) {
        if (inputType.value === '1') inputTypeName = 'degF';
        else if (inputType.value === '2') inputTypeName = 'degC';
        else if (inputType.value === '3') inputTypeName = 'K';

        if (outputType.value === '1') outputTypeName = 'degF';
        else if (outputType.value === '2') outputTypeName = 'degC';
        else if (outputType.value === '3') outputTypeName = 'K';

        message.innerHTML = '';
        output.value = Number(math.format(math.evaluate(`${input.value} ${inputTypeName} to ${outputTypeName}`), { notation: 'fixed', precision: 4 }).replace(/[^0-9-.]/g, '')).toLocaleString();
        copyOutput.disabled = false;
    } else {
        if (input.value !== '') message.innerHTML = '<i class="fa-solid fa-exclamation-triangle"></i> Input is not a number!<br />';
        else message.innerHTML = '';

        output.value = '';
        copyOutput.disabled = true;
    }
}
