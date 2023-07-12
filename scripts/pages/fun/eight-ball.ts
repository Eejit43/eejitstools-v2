import { showAlert } from '../../functions.js';

const questionInput = document.getElementById('question-input') as HTMLInputElement;
const rollButton = document.getElementById('roll') as HTMLButtonElement;
const questionDisplay = document.getElementById('question-display') as HTMLDivElement;
const answerOutput = document.getElementById('answer-output') as HTMLDivElement;

/* Add event listeners */
questionInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') rollButton.click();
});
rollButton.addEventListener('click', () => {
    if (questionInput.value.length === 0) showAlert("You didn't ask a question!", 'error');
    else {
        rollButton.disabled = true;
        rollButton.textContent = 'Rolling!';

        questionDisplay.textContent = questionInput.value;
        answerOutput.textContent = 'Rolling...';
        answerOutput.classList.add('rolling');

        const spinner = document.createElement('i');
        spinner.classList.add('fa-solid', 'fa-spinner', 'fa-spin-pulse');
        answerOutput.appendChild(spinner);

        setTimeout(() => {
            rollButton.disabled = false;
            rollButton.textContent = 'Roll ball!';
            answerOutput.textContent = resultNames[Math.floor(Math.random() * 20)];
            answerOutput.classList.remove('rolling');
        }, 1000);
    }
});

const resultNames: Record<string, string> = {
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
