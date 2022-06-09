import { showAlert, stringToHTML } from '/scripts/functions.js';

const resultElement = document.getElementById('result');
const yearVal = document.getElementById('year');
const monthVal = document.getElementById('month');
const dateVal = document.getElementById('date');
const getDate = document.getElementById('get-date');
const resetDate = document.getElementById('reset-date');

/* Add event listeners */
getDate.addEventListener('click', () => {
    checkApod(yearVal.value !== '' ? yearVal.value : year, monthVal.value !== '' ? monthVal.value : month, dateVal.value !== '' ? dateVal.value : date);
});
resetDate.addEventListener('click', () => {
    yearVal.value = '';
    monthVal.value = '';
    dateVal.value = '';
    checkApod(year, month, date);
});
['input', 'paste'].forEach((event) => {
    yearVal.addEventListener(event, () => {
        yearVal.value = yearVal.value.replace(/((?![0-9]).)/g, '');
        checkInput(yearVal);
    });
});
['input', 'paste'].forEach((event) => {
    monthVal.addEventListener(event, () => {
        monthVal.value = monthVal.value.replace(/((?![0-9]).)/g, '');
        checkInput(monthVal);
    });
});
['input', 'paste'].forEach((event) => {
    dateVal.addEventListener(event, () => {
        dateVal.value = dateVal.value.replace(/((?![0-9]).)/g, '');
        checkInput(dateVal);
    });
});

/**
 * Checks and updates an elements value if needed
 * @param {HTMLElement} element the element to check and update
 */
function checkInput(element) {
    if (element.value.length > element.maxLength) element.value = element.value.slice(0, element.maxLength);
    if ((element.max && element.value > element.max) || element.value < 1) element.value = element.value.slice(0, 1);
}

const currentTime = new Date();
const year = currentTime.getFullYear();
const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
const date = currentTime.getDate().toString().padStart(2, '0');

yearVal.placeholder = year;
monthVal.placeholder = month;
dateVal.placeholder = date;

checkApod(year, month, date);

/**
 * Checks the provided date to ensure it is between June 16th, 1995, and the current date
 * @param {number} yearInput the year input
 * @param {number} monthInput the month input
 * @param {number} dateInput the date input
 */
function checkApod(yearInput, monthInput, dateInput) {
    if (new Date(`${monthInput}/${dateInput}/${yearInput} 00:00:00`).getTime() >= new Date('6/16/1995 00:00:00').getTime() && new Date(`${monthInput}/${dateInput}/${yearInput} 00:00:00`).getTime() <= new Date().getTime()) fetchApod(yearInput, monthInput, dateInput);
    else showAlert(`Date out of range! Must be between ${new Date('6/16/1995 00:00:00').toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })} and ${new Date().toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })} (inclusive)`, 'error');
}

/**
 * Fetches the Astronomy Picture of the Day (APOD) for the provided date
 * @param {number} yearInput the year input
 * @param {number} monthInput the month input
 * @param {number} dateInput the date input
 */
function fetchApod(yearInput, monthInput, dateInput) {
    resultElement.innerHTML = 'Pulling data from the cosmos <i class="fa-solid fa-spinner fa-pulse"></i>';

    yearInput = yearInput ? yearInput.toString().slice(-2) : year.toString().slice(-2);
    monthInput = monthInput ? monthInput.toString().padStart(2, '0') : month.toString().padStart(2, '0');
    dateInput = dateInput ? dateInput.toString().padStart(2, '0') : date.toString().padStart(2, '0');

    fetch(`/cors-anywhere?url=https://apod.nasa.gov/apod/ap${yearInput}${monthInput}${dateInput}.html`)
        .then(async (response) => {
            const preHtml = (await response.text()).replace(/\n/g, ' ').replace(/<a(.*?)>/g, '<a$1 target="_blank">');
            const html = stringToHTML(preHtml);

            const apodDate = new Date(`${monthInput}/${dateInput}/${yearInput} 00:00:00`).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            const mediaType = /img src/gi.test(preHtml) ? 'image' : 'video';

            let title;
            try {
                if (html.querySelectorAll('center').length === 2) title = stringToHTML(html.querySelector('center').innerHTML).querySelector('b').innerHTML.trim().replace(/<br>\n Credit:/g, '');
                else title = stringToHTML(html.querySelectorAll('center')[1].innerHTML).querySelector('b').innerHTML.trim().replace(/<br>\n Credit:/g, ''); // prettier-ignore
            } catch (error) {
                title = html.querySelector('title').innerHTML.split(' - ')[1].trim();
            }

            const credit = /Credit.*?<\/center>/gis.test(preHtml) ? preHtml.match(/Credit.*?<\/center>/gis)[0].trim().replace(/ <\/b>/gi, '').replace(/ ?<\/center>/gi, '').replace(/href="lib\/(.*?)"/g, 'href="https://apod.nasa.gov/apod/lib/$1"') : false; // prettier-ignore

            let media;
            if (mediaType === 'video') media = `<div style="position: relative; overflow: hidden; margin: 15px auto; width: 900px; max-width: 90%; padding-top: 40%">${html.querySelector('iframe').outerHTML.replace(/src/g, 'style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; width: 100%; height: 100%" src')}</div>`;
            else {
                const links = html.querySelectorAll('a');
                for (let i = 0; i < links.length; i++) {
                    if (/img/g.test(links[i].innerHTML)) {
                        media = stringToHTML(links[i].outerHTML.replace(/("|')image\//g, '$1https://apod.nasa.gov/apod/image/').replace(/a href=/g, 'a style="display: block; margin: 15px auto; width: 900px; max-width: 90%" href=').replace(/<img/g, '<img style="width: 100%"').replace(/ {2}/g, ' ').replace(/will download the/g, 'will open the')).querySelector('a'); // prettier-ignore
                        break;
                    }
                }
            }

            const explanation = html.body.outerHTML
                .match(/Explanation:.*?Tomorrow|Explanation<\/b>:.*?Tomorrow|Explanation:.*?<hr>/gs)[0]
                .replace(/(\n| {2,3})/g, ' ')
                .replace(/(Explanation: ?<\/b> |Explanation<\/b>: |Explanation: | ?<br> ?<b> ?Tomorrow|<b> Tomorrow|<hr>|<center> |( ?<br \/>)*?$|<br \/><br \/> Tomorrow|<br \/><br \/>Birthday Surprise.*?$)/g, '')
                .replace(/(<p> ?<\/p>| ?<\/?p>)/g, '<br />')
                .replace(/<b> (.*?) <\/b>/g, '$1')
                .replace(/--/g, '–')
                .replace(/href="(?!http)(.*?)"/g, 'href="https://apod.nasa.gov/apod/$1"')
                .replace(/href="\/(.*?)"/g, 'href="https://apod.nasa.gov/$1"')
                .replace(/(\w|>)\/ /g, '$1/')
                .replace(/ \.{3}/g, '...')
                .replace(/<br( \/)>$/g, '')
                .replace(/<br( \/)>$/g, '');

            const result = [
                `Astronomy ${mediaType === 'image' ? 'Picture' : '<strike>Picture</strike> Video'} of the Day for ${apodDate}.<br />`, //
                `<div style="text-align: center; font-size: 30px">${title}</div>`,
                `${mediaType === 'video' ? `${media} ${credit ? `<center>${credit}</center><br />` : ''}` : `${media.outerHTML} ${credit ? `<center>${credit}</center><br />` : ''}`}`,
                `${explanation}`,
            ];

            resultElement.innerHTML = result.join('');
        })
        .catch(() => {
            showAlert('No APOD data found for this date!', 'error');
        });
}
