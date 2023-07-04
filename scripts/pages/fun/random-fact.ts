const getFactButton = document.getElementById('get-fact') as HTMLButtonElement;
const fact = document.getElementById('fact') as HTMLSpanElement;

/* Add event listeners */
getFactButton.addEventListener('click', fetchFact);

/**
 * Fetches a random fact
 */
async function fetchFact() {
    fact.textContent = 'Loading...';

    const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
    const data = (await response.json()) as { text: string };

    fact.textContent = data.text.replace(/`/g, "'").trim();
}

fetchFact();
