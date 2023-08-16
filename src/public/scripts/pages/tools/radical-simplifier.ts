import { showAlert } from '../../functions.js';

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        MathJax: {
            typeset(): void;
        };
    }
}

const indexInput = document.querySelector('#index') as HTMLInputElement;
const radicandInput = document.querySelector('#radicand') as HTMLInputElement;
const operandInput = document.querySelector('#operand') as HTMLInputElement;
const simplifyButton = document.querySelector('#simplify') as HTMLButtonElement;
const resetButton = document.querySelector('#reset') as HTMLButtonElement;
const output = document.querySelector('#output') as HTMLSpanElement;
const message = document.querySelector('#message') as HTMLSpanElement;

for (const event of ['input', 'paste']) {
    indexInput.addEventListener(event, () => (indexInput.value = indexInput.value.replaceAll(/\D/g, '')));
    radicandInput.addEventListener(event, () => (radicandInput.value = radicandInput.value.replaceAll(/[^\d-]/g, '').replaceAll(/(?<!^)-/g, '')));
    operandInput.addEventListener(event, () => (operandInput.value = operandInput.value.replaceAll(/\D/g, '')));
}

for (const input of [indexInput, radicandInput, operandInput]) input.addEventListener('keydown', (event) => (event.key === 'Enter' ? simplifyButton.click() : null));

simplifyButton.addEventListener('click', () => {
    message.textContent = '';
    if (!radicandInput.value) return showAlert('Provide a radicand first!', 'error');
    output.classList.remove('hidden');

    const index = indexInput.value ? Number.parseInt(indexInput.value) : 2;
    const operand = operandInput.value ? Number.parseInt(operandInput.value) : 1;
    const originalRadicand = Number.parseInt(radicandInput.value);
    const negativeRadicand = originalRadicand < 0;

    let radicand = Math.abs(originalRadicand);
    radicand *= Math.pow(operand, index);

    const primeFactors = getPrimeFactors(radicand);

    const primeFactorsObject = mapPrimeFactors(primeFactors);

    if (negativeRadicand) primeFactors.unshift(-1);

    let outputOperand: number | string = 1,
        outputRadicand = 1;

    for (const [number, amount] of Object.entries(primeFactorsObject)) {
        if (number === '0' && amount === 1) {
            outputOperand = 0;
            continue;
        }

        if (amount / index >= 1) {
            (outputOperand as number) *= Math.pow(Number(number), (amount - (amount % index)) / index);
            outputRadicand *= Math.pow(Number(number), amount % index);
        }
        if (amount / index < 1) outputRadicand *= Math.pow(Number(number), amount);
    }

    if (negativeRadicand) {
        if (outputOperand === 1) outputOperand = '';
        outputOperand += 'i';
    }

    const original = `${operand && operand !== 1 ? `${operand} ` : ''}\\sqrt${index && index !== 2 ? `[${index}]` : ''}{${originalRadicand}}`,
        factored = `\\sqrt${index && index !== 2 ? `[${index}]` : ''}{${primeFactors.join(' \\cdot ')}}`,
        mappedFactors = `${negativeRadicand ? 'i ' : ''}\\sqrt${index && index !== 2 ? `[${index}]` : ''}{${Object.entries(primeFactorsObject)
            .map(([number, amount]) => `${number}${amount === 1 ? '' : `^${amount}`}`)
            .join(' \\cdot ')}}`,
        finalOutput = outputRadicand === 1 ? outputOperand : `${outputOperand && outputOperand !== 1 ? `${outputOperand} ` : ''}\\sqrt${index && index !== 2 ? `[${index}]` : ''}{${outputRadicand}}`;

    if (original === finalOutput) message.textContent = `The radical is already in its simplest form.${primeFactors.length === 1 ? ` ${radicand} is a prime number.` : ''}`;
    output.textContent = `\\(${[original, factored, mappedFactors, finalOutput].filter((output, index, array) => output !== array[index - 1]).join(' = ')}\\)`;
    window.MathJax.typeset(); // Parse LaTeX math to visual representation
});

resetButton.addEventListener('click', () => {
    message.textContent = 'Nothing yet!';
    output.classList.add('hidden');
    indexInput.value = '';
    radicandInput.value = '';
    operandInput.value = '';
    showAlert('Reset!', 'success');
});

/**
 * Gets the prime factors of a number.
 * @param number The number to get the prime factors of.
 * @see https://github.com/nayuki/Nayuki-web-published-code/blob/master/calculate-prime-factorization-javascript/calculate-prime-factorization.js
 */
function getPrimeFactors(number: number) {
    if (number === 0) return [0];
    if (number === 1) return [1];

    const result = [];
    while (number !== 1) {
        const factor = smallestFactor(number);
        result.push(factor);
        number /= factor;
    }
    return result;
}

/**
 * Returns the smallest prime factor of the given integer.
 * @param number The number to get the prime factors of.
 * @see https://github.com/nayuki/Nayuki-web-published-code/blob/master/calculate-prime-factorization-javascript/calculate-prime-factorization.js
 */
function smallestFactor(number: number) {
    if (number % 2 === 0) return 2;
    const end = Math.floor(Math.sqrt(number));
    for (let index = 3; index <= end; index += 2) if (number % index === 0) return index;

    return number;
}

/**
 * Maps the prime factors of a number to an object.
 * @param numbers The numbers to map.
 */
function mapPrimeFactors(numbers: number[]) {
    const object: Record<string, number> = {};

    for (const number of numbers) {
        if (!(number in object)) object[number] = 0;
        object[number]++;
    }

    return object;
}
