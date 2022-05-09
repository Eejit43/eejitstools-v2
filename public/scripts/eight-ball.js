const userQuestion = document.getElementById('userQuestion');
const rollBallBtn = document.getElementById('rollBall');
const result = document.getElementById('result');

/* Add event listeners */
rollBallBtn.addEventListener('click', () => {
    if (userQuestion.value.length === 0) showAlert("You didn't ask a question!", 'error');
    else {
        const randomNumber = Math.floor(Math.random() * 20);

        let eightBall;
        switch (randomNumber) {
            case 0:
                eightBall = 'It is certain';
                break;
            case 1:
                eightBall = 'It is decidedly so';
                break;
            case 2:
                eightBall = 'Without a doubt';
                break;
            case 3:
                eightBall = 'Yes definitely';
                break;
            case 4:
                eightBall = 'You may rely on it';
                break;
            case 5:
                eightBall = 'As I see it, yes';
                break;
            case 6:
                eightBall = 'Most likely';
                break;
            case 7:
                eightBall = 'Outlook good';
                break;
            case 8:
                eightBall = 'Yes';
                break;
            case 9:
                eightBall = 'Signs point to yes';
                break;
            case 10:
                eightBall = "Don't count on it";
                break;
            case 11:
                eightBall = 'My reply is no';
                break;
            case 12:
                eightBall = 'My sources say no';
                break;
            case 13:
                eightBall = 'Outlook not so good';
                break;
            case 14:
                eightBall = 'Very doubtful';
                break;
            case 15:
                eightBall = 'Reply hazy, try again';
                break;
            case 16:
                eightBall = 'Ask again later';
                break;
            case 17:
                eightBall = 'Better not tell you now';
                break;
            case 18:
                eightBall = 'Cannot predict now';
                break;
            case 19:
                eightBall = 'Concentrate and ask again';
                break;
        }
        rollBallBtn.disabled = true;
        rollBallBtn.innerHTML = 'Rolling!';
        result.innerHTML = `<hr>You asked: <span style="font-weight: 500; color: dimgray; font-size: 18px">${escapeHTML(userQuestion.value)}</span><br />Response: <span style="font-weight: 500; color:#ffba24; font-size: 18px">Predicting... <i class="fa-solid fa-spinner fa-spin-pulse"></i></span>`;

        setTimeout(() => {
            rollBallBtn.disabled = false;
            rollBallBtn.innerHTML = 'Roll ball!';
            result.innerHTML = `<hr>You asked: <span style="font-weight: 500; color: dimgray; font-size: 18px">${escapeHTML(userQuestion.value)}</span><br />Response: <span style="font-weight: 500; color: dimgray; font-size: 18px">${eightBall}</span>`;
        }, 2000);
    }
});
