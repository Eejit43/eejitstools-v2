const getJokeButton = document.getElementById('get-joke') as HTMLButtonElement;
const joke = document.getElementById('joke') as HTMLSpanElement;

/* Add event listeners */
getJokeButton.addEventListener('click', fetchJoke);

/**
 * Fetched a random joke.
 */
async function fetchJoke() {
    joke.textContent = 'Loading...';

    const response = await fetch('https://v2.jokeapi.dev/joke/Miscellaneous,Pun?safe-mode');
    const data = (await response.json()) as { joke?: string; setup: string; delivery: string };

    joke.innerHTML = data.joke ? data.joke.replace(/\n/g, '<br />') : `${data.setup.replace(/\n/g, '<br />')}<br />${data.delivery.replace(/\n/g, '<br />')}`;
}

fetchJoke();
