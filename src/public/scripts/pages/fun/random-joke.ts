const getJokeButton = document.querySelector<HTMLButtonElement>('#get-joke')!;
const jokeOutput = document.querySelector<HTMLDivElement>('#joke-output')!;

/* Add event listeners */
getJokeButton.addEventListener('click', fetchJoke);

/**
 * Fetched a random joke.
 */
async function fetchJoke() {
    jokeOutput.textContent = 'Loading...';

    const response = await fetch('https://v2.jokeapi.dev/joke/Miscellaneous,Pun?safe-mode');
    const data = (await response.json()) as { joke?: string; setup: string; delivery: string };

    jokeOutput.innerHTML = data.joke
        ? data.joke.replaceAll('\n', '<br />')
        : `${data.setup.replaceAll('\n', '<br />')}<br />${data.delivery.replaceAll('\n', '<br />')}`;
}

fetchJoke(); // eslint-disable-line unicorn/prefer-top-level-await
