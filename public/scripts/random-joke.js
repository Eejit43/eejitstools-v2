let getJokeButton = document.getElementById('get-joke');
let joke = document.getElementById('joke');

/* Add event listeners */
getJokeButton.addEventListener('click', getJoke);

function getJoke() {
    joke.innerHTML = 'Loading...';
    fetch('https://v2.jokeapi.dev/joke/Miscellaneous,Pun?safe-mode')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            joke.innerHTML = data.joke ? data.joke.replace(/\n/g, '<br />') : `${data.setup.replace(/\n/g, '<br />')}<br />${data.delivery.replace(/\n/g, '<br />')}`;
        })
        .catch((err) => {});
}

getJoke();
