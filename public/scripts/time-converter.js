let inputType = document.getElementById('input-type');
let input = document.getElementById('input');
let resetButton = document.getElementById('reset');
let message = document.getElementById('message');
let outputType = document.getElementById('output-type');
let output = document.getElementById('output');
let copyOutput = document.getElementById('copy-output');

/* Add event listeners */
inputType.addEventListener('change', convert);
input.addEventListener('input', convert);
resetButton.addEventListener('click', reset);
outputType.addEventListener('change', convert);
copyOutput.addEventListener('click', function () {
    copyValue('output', 'copy-output');
});

function reset() {
    input.value = '';
    output.value = '';
    message.innerHTML = '';
    inputType.value = 7;
    outputType.value = 5;
    copyOutput.disabled = true;
    showAlert('Reset!', 'success');
}

math.createUnit('nauticalmile', { definition: '1852 meter', aliases: ['nmile', 'nauticalm'] });
math.createUnit('nanometer', { definition: '0.001 micrometer', override: true });

function convert() {
    if (/^-?([0-9]\d*)(\.\d*|,\d*)*$/g.test(input.value) || /^-?\d*\.\d+$/g.test(input.value)) {
        if (inputType.value === '1') {
            inputTypeName = 'nanoseconds';
        } else if (inputType.value === '2') {
            inputTypeName = 'microseconds';
        } else if (inputType.value === '3') {
            inputTypeName = 'milliseconds';
        } else if (inputType.value === '4') {
            inputTypeName = 'seconds';
        } else if (inputType.value === '5') {
            inputTypeName = 'minutes';
        } else if (inputType.value === '6') {
            inputTypeName = 'hours';
        } else if (inputType.value === '7') {
            inputTypeName = 'days';
        } else if (inputType.value === '8') {
            inputTypeName = 'weeks';
        } else if (inputType.value === '9') {
            inputTypeName = 'months';
        } else if (inputType.value === '10') {
            inputTypeName = 'years';
        } else if (inputType.value === '11') {
            inputTypeName = 'decades';
        } else if (inputType.value === '12') {
            inputTypeName = 'centuries';
        } else if (inputType.value === '13') {
            inputTypeName = 'millennia';
        }

        if (outputType.value === '1') {
            outputTypeName = 'nanoseconds';
        } else if (outputType.value === '2') {
            outputTypeName = 'microseconds';
        } else if (outputType.value === '3') {
            outputTypeName = 'milliseconds';
        } else if (outputType.value === '4') {
            outputTypeName = 'seconds';
        } else if (outputType.value === '5') {
            outputTypeName = 'minutes';
        } else if (outputType.value === '6') {
            outputTypeName = 'hours';
        } else if (outputType.value === '7') {
            outputTypeName = 'days';
        } else if (outputType.value === '8') {
            outputTypeName = 'weeks';
        } else if (outputType.value === '9') {
            outputTypeName = 'months';
        } else if (outputType.value === '10') {
            outputTypeName = 'years';
        } else if (outputType.value === '11') {
            outputTypeName = 'decades';
        } else if (outputType.value === '12') {
            outputTypeName = 'centuries';
        } else if (outputType.value === '13') {
            outputTypeName = 'millennia';
        }

        message.innerHTML = '';
        output.value = math.number(math.format(math.evaluate(`${input.value} ${inputTypeName} to ${outputTypeName}`), { notation: 'fixed', precision: 15 }).replace(/[^0-9-.]/g, '')).toLocaleString(undefined, { maximumFractionDigits: 12 });
        copyOutput.disabled = false;
    } else {
        if (input.value !== '') {
            message.innerHTML = '<i class="fa-solid fa-exclamation-triangle"></i> Input is not a number!<br />';
        } else {
            message.innerHTML = '';
        }
        output.value = '';
        copyOutput.disabled = true;
    }
}
