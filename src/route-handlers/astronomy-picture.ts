import consola from 'consola';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import { parse } from 'node-html-parser';
import { logApiRequest } from '../app.js';

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
 * Sets up the cors-anywhere route.
 * @param fastify The Fastify instance.
 */
export default function setupApodRoute(fastify: FastifyInstance) {
    fastify.get(
        '/astronomy-picture/:year/:month/:date',
        async (request: FastifyRequest<{ Params: { year: string; month: string; date: string } }>, reply) => {
            logApiRequest(request);

            let result: ApodEntry;

            let { year, month, date } = request.params;

            year = year.padStart(2, '0');
            year = year.length === 2 ? year : year.slice(-2);
            month = month.padStart(2, '0');
            date = date.padStart(2, '0');

            const apodDate = new Date(`${month}/${date}/${year} 00:00:00`).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            const url = `https://apod.nasa.gov/apod/ap${year}${month}${date}.html`;

            const response = await fetch(`https://eejitstools.com/cors-anywhere?url=${url}`);
            const apodPage = await response.text();
            if (!response.ok) return { success: false, error: 'No APOD data exists for the given date!', date: apodDate };

            try {
                const html = parse(
                    apodPage
                        .replaceAll('\n', ' ')
                        .replaceAll(/ {2,}/g, ' ')
                        .replaceAll(/-{2,}/g, '–')
                        .replace(/(href|src)=(["']) +/, '$1=$2')
                        .replaceAll(/(href|src)=(["'])(?!http|mailto)(.*?)(["'])/gi, '$1=$2https://apod.nasa.gov/apod/$3$4')
                        .replaceAll(/(href|src)=(["'])\/(.*?)(["'])/gi, '$1=$2https://apod.nasa.gov/$3$4'),
                );
                for (const element of html.querySelectorAll('a')) element.setAttribute('target', '_blank');

                const mediaType = html.querySelector('iframe') ? 'embed' : 'image';

                const title = html
                    .querySelector('title')
                    ?.innerHTML.split(/\s[–-]\s/)[1]
                    .trim();

                const credit = /credit.*?<\/center>/is
                    .exec(html.innerHTML)?.[0]
                    ?.replace(/ <\/b>/gi, '')
                    ?.replace(/ ?<\/center>/gi, '')
                    ?.trim();

                const media = { type: mediaType } as ApodEntryMedia;

                if (mediaType === 'embed')
                    media.src = html
                        .querySelector('iframe')!
                        .getAttribute('src')!
                        .replace(/\?rel=0$/, '');
                else {
                    const imageElement = html.querySelector('a img, button img')!;
                    media.src = imageElement.getAttribute('src')!;
                    media.highResolution = imageElement.parentNode.getAttribute('href');
                    media.annotated = imageElement.parentNode.getAttribute('onmouseover')?.match(/src=["'](.*?)["']/)?.[1];
                    media.alt = imageElement
                        .getAttribute('alt')
                        ?.replace(/ please see the explanation for more detailed information./i, '');

                    if (/will download the/i.test(media.alt!)) delete media.alt;
                    if (media.highResolution === media.src) delete media.highResolution;
                }

                const explanation = html.innerHTML
                    .match(/explanation(<\/b>)?:.*?tomorrow(?!,)|explanation:.*?<hr>/gi)?.[0]
                    .replaceAll(/(<p> ?<\/p>| ?<\/?p>)/g, '<br />')
                    .replaceAll(/<b> (.*?) <\/b>/g, '$1')
                    .replaceAll(/(\w|>)\/ /g, '$1/')
                    .replaceAll(/ \.{3}/g, '...')
                    .replaceAll(
                        /(explanation: ?<\/b> |explanation<\/b>: | explanation: | ?<br> ?<b> ?tomorrow|<b> tomorrow|<hr>|<center> |( ?<br \/>)*?$|<br \/><br \/> tomorrow|<br \/><br \/>birthday surprise.*?$|<br \/> +your sky surprise.*?$|<br \/> +apod in world languages:.*?$)/gi,
                        '',
                    )
                    .replace(/<br( \/)?> *$/, '')
                    .trim();

                result = {
                    success: true,
                    source: url,
                    date: apodDate,
                    title,
                    credit,
                    explanation,
                    media,
                };
            } catch (error) {
                consola.error(error);
                result = { success: false, error: 'Failed to parse APOD data for this date!', date: apodDate };
            }

            reply.send(JSON.stringify(result, null, 2));
        },
    );
}
