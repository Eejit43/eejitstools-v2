/* global MathJax */
import { showAlert } from '/scripts/functions.js';

const indexInput = document.getElementById('index');
const radicandInput = document.getElementById('radicand');
const operandInput = document.getElementById('operand');
const simplifyButton = document.getElementById('simplify');
const resetButton = document.getElementById('reset');
const output = document.getElementById('output');
const message = document.getElementById('message');

['input', 'paste'].forEach((event) => {
    indexInput.addEventListener(event, () => (indexInput.value = indexInput.value.replace(/[^0-9]/g, '')));
    radicandInput.addEventListener(event, () => (radicandInput.value = radicandInput.value.replace(/[^0-9-]/g, '').replace(/(?<!^)-/g, '')));
    operandInput.addEventListener(event, () => (operandInput.value = operandInput.value.replace(/[^0-9]/g, '')));
});

[indexInput, radicandInput, operandInput].forEach((input) => {
    input.addEventListener('keydown', (event) => (event.key === 'Enter' ? simplifyButton.click() : null));
});

simplifyButton.addEventListener('click', () => {
    message.textContent = '';
    if (!radicandInput.value) return showAlert('Provide a radicand first!', 'error');
    output.classList.remove('hidden');

    const index = parseInt(indexInput.value || 2);
    const operand = parseInt(operandInput.value || 1);
    const originalRadicand = parseInt(radicandInput.value);
    const negativeRadicand = originalRadicand < 0;

    let radicand = Math.abs(originalRadicand);
    radicand *= Math.pow(operand, index);

    const primeFactors = getPrimeFactors(radicand);

    const primeFactorsMapped = mapPrimeFactors(primeFactors);

    if (negativeRadicand) primeFactors.unshift(-1);

    let outputOperand = 1,
        outputRadicand = 1;

    Object.entries(primeFactorsMapped).forEach(([number, amount]) => {
        if (number === '0' && amount === 1) {
            outputOperand = 0;
            return;
        }

        if (amount / index >= 1) {
            outputOperand *= Math.pow(number, (amount - (amount % index)) / index);
            outputRadicand *= Math.pow(number, amount % index);
        }
        if (amount / index < 1) outputRadicand *= Math.pow(number, amount);
    });

    if (negativeRadicand) {
        if (outputOperand === 1) outputOperand = '';
        outputOperand += 'i';
    }

    const original = `${operand && operand !== 1 ? `${operand} ` : ''}\\sqrt${index && index !== 2 ? `[${index}]` : ''}{${originalRadicand}}`,
        factored = `\\sqrt${index && index !== 2 ? `[${index}]` : ''}{${primeFactors.join(' \\cdot ')}}`,
        mappedFactors = `${negativeRadicand ? 'i ' : ''}\\sqrt${index && index !== 2 ? `[${index}]` : ''}{${Object.entries(primeFactorsMapped)
            .map(([number, amount]) => `${number}${amount !== 1 ? `^${amount}` : ''}`)
            .join(' \\cdot ')}}`,
        finalOutput = outputRadicand !== 1 ? `${outputOperand && outputOperand !== 1 ? `${outputOperand} ` : ''}\\sqrt${index && index !== 2 ? `[${index}]` : ''}{${outputRadicand}}` : outputOperand;

    if (original === finalOutput) message.textContent = `The radicand is already in its simplest form.${primeFactors.length === 1 ? ` ${radicand} is a prime number.` : ''}`;
    output.textContent = `\\(${[original, factored, mappedFactors, finalOutput].filter((output, index, array) => output !== array[index - 1]).join(' = ')}\\)`;
    MathJax.typeset();
});
resetButton.addEventListener('click', () => {
    message.textContent = '';
    output.classList.add('hidden');
    indexInput.value = '';
    radicandInput.value = '';
    operandInput.value = '';
    showAlert('Reset!', 'success');
});

/**
 * Gets the prime factors of a number
 * @param {number} number the number to get the prime factors of
 * @returns {number[]} the prime factors of the number
 */
function getPrimeFactors(number) {
    if (number === 0) return [0];
    if (number === 1) return [1];
    if (number === 2) return [2];

    const factors = [];
    let divisor = 2;

    while (number > 2)
        if (number % divisor === 0) {
            factors.push(divisor);
            number = number / divisor;
        } else divisor++;

    return factors;
}

/**
 * Maps the prime factors of a number to an object
 * @param {number[]} numbers the numbers to map
 * @returns {Object<number, number>} the mapped prime factors
 */
function mapPrimeFactors(numbers) {
    const object = {};

    numbers.forEach((number) => {
        if (!Object.hasOwn(object, number)) object[number] = 0;
        object[number]++;
    });

    return object;
}
