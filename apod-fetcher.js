import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

/**
 * @typedef {object} apodEntry Astronomy Picture of the Day (APOD) entry
 * @property {boolean} success whether or not the entry was fetched successfully
 * @property {string} [error] the error message (if success is `false`)
 * @property {string} source the source url of the entry
 * @property {string} date the date of the entry
 * @property {string} title the title of the entry
 * @property {string} [credit] the credit (and possibly copyright) of the entry (full string)
 * @property {string} explanation the explanation of the entry's media
 * @property {apodEntryMedia} media the media of the entry
 */

/**
 * @typedef {object} apodEntryMedia
 * @property {'image'|'embed'} type the media type
 * @property {string} src the media source url
 * @property {string} [highResolution] the high resolution image source url (only, but not always, if media `type` is `image`)
 * @property {string} [annotated] the annotated image source url (only, but not always, if media `type` is `image`)
 * @property {string} [alt] the alternate text for the image (only, but not always, if media `type` is `image`)
 */

/**
 * Fetches the Astronomy Picture of the Day (APOD) for the provided date
 * @param {string} year the year to fetch
 * @param {string} month the month to fetch
 * @param {string} date the date to fetch
 * @returns {Promise<apodEntry>} the APOD data for the provided date
 */
export async function fetchApod(year, month, date) {
    year = year.padStart(2, '0');
    year = year.length === 2 ? year : year.slice(-2);
    month = month.padStart(2, '0');
    date = date.padStart(2, '0');

    const apodDate = new Date(`${month}/${date}/${year} 00:00:00`).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const url = `https://apod.nasa.gov/apod/ap${year}${month}${date}.html`;

    const response = await fetch(`https://eejitstools.com/cors-anywhere?url=${url}`);
    const apodPage = await response.text();
    if (!response.ok) return { success: false, error: 'No APOD data exists for the given date!', date: apodDate };

    try {
        const html = parse(
            apodPage
                .replaceAll('\n', ' ')
                .replace(/ {2,}/g, ' ')
                .replace(/-{2,}/g, '–')
                .replace(/(href|src)=(["']) {1,}/, '$1=$2')
                .replace(/(href|src)=(["'])(?!http|mailto)(.*?)(["'])/gi, '$1=$2https://apod.nasa.gov/apod/$3$4')
                .replace(/(href|src)=(["'])\/(.*?)(["'])/gi, '$1=$2https://apod.nasa.gov/$3$4')
        );
        html.querySelectorAll('a').forEach((element) => element.setAttribute('target', '_blank'));

        const mediaType = html.querySelector('iframe') ? 'embed' : 'image';

        const title = html
            .querySelector('title')
            .innerHTML.split(/\s[–-]\s/)[1]
            .trim();

        const credit = html.innerHTML
            .match(/Credit.*?<\/center>/is)?.[0]
            ?.replace(/ <\/b>/gi, '')
            ?.replace(/ ?<\/center>/gi, '')
            ?.trim();

        const media = {
            type: mediaType
        };

        if (mediaType === 'embed')
            media.src = html
                .querySelector('iframe')
                .getAttribute('src')
                .replace(/\?rel=0$/, '');
        else {
            const imageElement = html.querySelector('a img, button img');
            media.src = imageElement.getAttribute('src');
            media.highResolution = imageElement.parentNode.getAttribute('href');
            media.annotated = imageElement.parentNode.getAttribute('onmouseover')?.match(/src=['"](.*?)['"]/)?.[1];
            media.alt = imageElement.getAttribute('alt')?.replace(/ Please see the explanation for more detailed information./i, '');

            if (/will download the/i.test(media.alt)) delete media.alt;
            if (media.highResolution === media.src) delete media.highResolution;
        }

        const explanation = html.innerHTML
            .match(/Explanation:.*?Tomorrow|Explanation<\/b>:.*?Tomorrow|Explanation:.*?<hr>/gi)[0]
            .replace(/(<p> ?<\/p>| ?<\/?p>)/g, '<br />')
            .replace(/<b> (.*?) <\/b>/g, '$1')
            .replace(/(\w|>)\/ /g, '$1/')
            .replace(/ \.{3}/g, '...')
            .replace(/(Explanation: ?<\/b> |Explanation<\/b>: | Explanation: | ?<br> ?<b> ?Tomorrow|<b> Tomorrow|<hr>|<center> |( ?<br \/>)*?$|<br \/><br \/> Tomorrow|<br \/><br \/>Birthday Surprise.*?$|<br \/> +Your Sky Surprise.*?$|<br \/> +APOD in world languages:.*?$)/gi, '')
            .replace(/<br( \/)?> *$/, '')
            .trim();

        return {
            success: true,
            source: url,
            date: apodDate,
            title,
            credit,
            explanation,
            media
        };
    } catch (error) {
        console.error(error); // eslint-disable-line no-console
        return { success: false, error: 'Failed to parse APOD data for this date!', date: apodDate };
    }
}
