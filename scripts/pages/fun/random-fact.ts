const getFactButton = document.getElementById('get-fact');
const fact = document.getElementById('fact');

/* Add event listeners */
getFactButton.addEventListener('click', fetchFact);

/**
 * Fetches a random fact
 */
async function fetchFact() {
    fact.textContent = 'Loading...';

    const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
    const data = await response.json();

    fact.textContent = data.text.replace(/`/g, "'").trim();
}

fetchFact();
