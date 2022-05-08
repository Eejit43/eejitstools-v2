const getFactButton = document.getElementById('get-fact');
const fact = document.getElementById('fact');

/* Add event listeners */
getFactButton.addEventListener('click', getFact);

function getFact() {
    fact.innerHTML = 'Loading...';
    fetch('https://uselessfacts.jsph.pl/random.json?language=en')
        .then(async (response) => {
            const data = await response.json();

            fact.innerHTML = data.text.replace(/`/g, "'").trim();
        })
        .catch((err) => {});
}

getFact();
