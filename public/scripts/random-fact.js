let getFactButton = document.getElementById('get-fact');
let fact = document.getElementById('fact');

/* Add event listeners */
getFactButton.addEventListener('click', getFact);

function getFact() {
    fact.innerHTML = 'Loading...';
    fetch('https://uselessfacts.jsph.pl/random.json?language=en')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            fact.innerHTML = data.text.replace(/`/g, "'").trim();
        })
        .catch((err) => {});
}

getFact();
