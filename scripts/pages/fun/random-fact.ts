const getFactButton = document.getElementById('get-fact') as HTMLButtonElement;
const factOutput = document.getElementById('fact-output') as HTMLDivElement;

/* Add event listeners */
getFactButton.addEventListener('click', fetchFact);

/**
 * Fetches a random fact.
 */
async function fetchFact() {
    factOutput.textContent = 'Loading...';

    const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
    const data = (await response.json()) as { text: string };

    factOutput.textContent = data.text.replace(/`/g, "'").trim();
}

fetchFact();
