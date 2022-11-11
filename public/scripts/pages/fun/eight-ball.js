import { escapeHTML, showAlert } from '/scripts/functions.js';

const question = document.getElementById('question');
const rollButton = document.getElementById('roll');
const result = document.getElementById('result');

/* Add event listeners */
rollButton.addEventListener('click', () => {
    if (question.value.length === 0) showAlert("You didn't ask a question!", 'error');
    else {
        rollButton.disabled = true;
        rollButton.innerHTML = 'Rolling!';
        result.innerHTML = `<hr>You asked: <span style="font-weight: 500; color: dimgray; font-size: 18px">${escapeHTML(question.value)}</span><br />Response: <span style="font-weight: 500; color:#ffba24; font-size: 18px">Predicting... <i class="fa-solid fa-spinner fa-spin-pulse"></i></span>`;

        setTimeout(() => {
            rollButton.disabled = false;
            rollButton.innerHTML = 'Roll ball!';
            result.innerHTML = `<hr>You asked: <span style="font-weight: 500; color: dimgray; font-size: 18px">${escapeHTML(question.value)}</span><br />Response: <span style="font-weight: 500; color: dimgray; font-size: 18px">${results[Math.floor(Math.random() * 20)]}</span>`;
        }, 2000);
    }
});

const results = {
    0: 'It is certain',
    1: 'It is decidedly so',
    2: 'Without a doubt',
    3: 'Yes definitely',
    4: 'You may rely on it',
    5: 'As I see it, yes',
    6: 'Most likely',
    7: 'Outlook good',
    8: 'Yes',
    9: 'Signs point to yes',
    10: "Don't count on it",
    11: 'My reply is no',
    12: 'My sources say no',
    13: 'Outlook not so good',
    14: 'Very doubtful',
    15: 'Reply hazy, try again',
    16: 'Ask again later',
    17: 'Better not tell you now',
    18: 'Cannot predict now',
    19: 'Concentrate and ask again'
};
