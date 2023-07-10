import { consola } from 'consola';
import { HTMLElement, parse } from 'node-html-parser';

interface ApodEntry {
    success: boolean;
    error?: string;
    source?: string;
    date?: string;
    title?: string;
    credit?: string;
    explanation?: string;
    media?: ApodEntryMedia;
}

export interface FullApodEntry {
    success: boolean;
    error?: string;
    source: string;
    date: string;
    title: string;
    credit: string;
    explanation: string;
    media: ApodEntryMedia;
}

export interface ApodEntryMedia {
    type: 'image' | 'embed';
    src: string;
    highResolution?: string;
    annotated?: string;
    alt?: string;
}

/**
 * Fetches the Astronomy Picture of the Day (APOD) for the provided date
 * @param {string} year the year to fetch
 * @param {string} month the month to fetch
 * @param {string} date the date to fetch
 */
export async function fetchApod(year: string, month: string, date: string): Promise<ApodEntry> {
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
            ?.innerHTML.split(/\s[–-]\s/)[1]
            .trim() as string;

        const credit = html.innerHTML
            .match(/Credit.*?<\/center>/is)?.[0]
            ?.replace(/ <\/b>/gi, '')
            ?.replace(/ ?<\/center>/gi, '')
            ?.trim();

        const media = { type: mediaType } as ApodEntryMedia;

        if (mediaType === 'embed') media.src = ((html.querySelector('iframe') as HTMLElement).getAttribute('src') as string).replace(/\?rel=0$/, '');
        else {
            const imageElement = html.querySelector('a img, button img') as HTMLElement;
            media.src = imageElement.getAttribute('src') as string;
            media.highResolution = imageElement.parentNode.getAttribute('href');
            media.annotated = imageElement.parentNode.getAttribute('onmouseover')?.match(/src=['"](.*?)['"]/)?.[1];
            media.alt = imageElement.getAttribute('alt')?.replace(/ Please see the explanation for more detailed information./i, '');

            if (/will download the/i.test(media.alt as string)) delete media.alt;
            if (media.highResolution === media.src) delete media.highResolution;
        }

        const explanation = html.innerHTML
            .match(/Explanation:.*?Tomorrow|Explanation<\/b>:.*?Tomorrow|Explanation:.*?<hr>/gi)?.[0]
            .replace(/(<p> ?<\/p>| ?<\/?p>)/g, '<br />')
            .replace(/<b> (.*?) <\/b>/g, '$1')
            .replace(/(\w|>)\/ /g, '$1/')
            .replace(/ \.{3}/g, '...')
            .replace(/(Explanation: ?<\/b> |Explanation<\/b>: | Explanation: | ?<br> ?<b> ?Tomorrow|<b> Tomorrow|<hr>|<center> |( ?<br \/>)*?$|<br \/><br \/> Tomorrow|<br \/><br \/>Birthday Surprise.*?$|<br \/> +Your Sky Surprise.*?$|<br \/> +APOD in world languages:.*?$)/gi, '')
            .replace(/<br( \/)?> *$/, '')
            .trim() as string;

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
        consola.error(error);
        return { success: false, error: 'Failed to parse APOD data for this date!', date: apodDate };
    }
}
