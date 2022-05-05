let userQuestion = document.getElementById('userQuestion');
let rollBallBtn = document.getElementById('rollBall');
let result = document.getElementById('result');

let eightBall, randomNumber;

/* Add event listeners */
rollBallBtn.addEventListener('click', rollBall);

function rollBall() {
    if (userQuestion.value.length === 0) {
        showAlert("You didn't ask a question!", 'error');
    } else {
        randomNumber = Math.floor(Math.random() * 20);
        switch (randomNumber) {
            case 0:
                eightBall = 'It is certain'; // Yes
                break;
            case 1:
                eightBall = 'It is decidedly so'; // Yes
                break;
            case 2:
                eightBall = 'Without a doubt'; // Yes
                break;
            case 3:
                eightBall = 'Yes definitely'; // Yes
                break;
            case 4:
                eightBall = 'You may rely on it'; // Yes
                break;
            case 5:
                eightBall = 'As I see it, yes'; // Yes
                break;
            case 6:
                eightBall = 'Most likely'; // Yes
                break;
            case 7:
                eightBall = 'Outlook good'; // Yes
                break;
            case 8:
                eightBall = 'Yes'; // Yes
                break;
            case 9:
                eightBall = 'Signs point to yes'; // Yes
                break;
            case 10:
                eightBall = "Don't count on it"; // No
                break;
            case 11:
                eightBall = 'My reply is no'; // No
                break;
            case 12:
                eightBall = 'My sources say no'; // No
                break;
            case 13:
                eightBall = 'Outlook not so good'; // No
                break;
            case 14:
                eightBall = 'Very doubtful'; // No
                break;
            case 15:
                eightBall = 'Reply hazy, try again'; // Neutral
                break;
            case 16:
                eightBall = 'Ask again later'; // Neutral
                break;
            case 17:
                eightBall = 'Better not tell you now'; // Neutral
                break;
            case 18:
                eightBall = 'Cannot predict now'; // Neutral
                break;
            case 19:
                eightBall = 'Concentrate and ask again'; // Neutral
                break;
        }
        rollBallBtn.innerHTML = 'Rolling!';
        setTimeout(function () {
            rollBallBtn.innerHTML = 'Roll ball!';
        }, 2000);
        result.innerHTML = `<hr>You asked: <span style="font-weight: 500; color: dimgray; font-size: 18px">${escapeHtml(userQuestion.value)}</span><br />Response: <span style="font-weight: 500; color:#ffba24; font-size: 18px">Predicting... <i class="fa-solid fa-spinner fa-spin-pulse"></i></span>`; // prettier-ignore
        setTimeout(function () {
            result.innerHTML = `<hr>You asked: <span style="font-weight: 500; color: dimgray; font-size: 18px">${escapeHtml(userQuestion.value)}</span><br />Response: <span style="font-weight: 500; color: dimgray; font-size: 18px">${eightBall}</span>`; // prettier-ignore
        }, 2000);
    }
}
