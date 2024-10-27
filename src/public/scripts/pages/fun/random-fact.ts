const getFactButton = document.querySelector<HTMLButtonElement>('#get-fact')!;
const factOutput = document.querySelector<HTMLDivElement>('#fact-output')!;

/* Add event listeners */
getFactButton.addEventListener('click', fetchFact);

/**
 * Fetches a random fact.
 */
async function fetchFact() {
    factOutput.textContent = 'Loading...';

    const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
    const data = (await response.json()) as { text: string };

    factOutput.textContent = data.text.replaceAll('`', "'").trim();
}

fetchFact(); // eslint-disable-line unicorn/prefer-top-level-await
