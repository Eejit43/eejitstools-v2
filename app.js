/* eslint-env node */
/* eslint-disable no-console */

import fastifyStatic from '@fastify/static';
import pointOfView from '@fastify/view';
import Canvas from 'canvas';
import chalk from 'chalk';
import 'dotenv/config';
import ejs from 'ejs';
import Fastify from 'fastify';
import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import { fetchApod } from './apod-fetcher.js';
import coins from './public/data/coins-data.js';
import { blankProperties, pagesParsed, toneIndicators } from './public/data/pages.js';

// Load layouts and static assets
const fastify = Fastify();

fastify.register(pointOfView, { engine: { ejs }, root: 'views', layout: '/layouts/layout.ejs' });

fastify.register(fastifyStatic, { root: path.join(path.dirname(new URL(import.meta.url).pathname), 'public') });

// Register pages
fastify.get('/', (request, reply) => reply.view('/index.ejs', { ...blankProperties, title: 'Home', pages: pagesParsed, additionalStyles: ['index.css'] }));

fastify.get('/search', (request, reply) => reply.view('/search.ejs', { ...blankProperties, title: 'Search', descriptionParsed: 'Search the site!', additionalScripts: [{ link: 'search.js', external: false, module: true }], additionalStyles: ['search.css'] }));

fastify.get('/coins-login', (request, reply) => reply.send(JSON.stringify({ success: request.query.password === process.env.COINS_PASSWORD }, null, 2)));

fastify.get('/coins-list', (request, reply) => {
    if (request.query.password !== process.env.COINS_PASSWORD) return reply.send(JSON.stringify({ error: 'Invalid password!' }, null, 2));
    reply.send(JSON.stringify(coins, null, 2));
});

fastify.get('/tone-indicators', (request, reply) => reply.send(JSON.stringify(toneIndicators, null, 2)));

fastify.get('/headers', (request, reply) => reply.send(JSON.stringify(request.headers, null, 2)));

fastify.get('/pages', (request, reply) =>
    reply.send(
        JSON.stringify(
            Object.values(pagesParsed)
                .map((category) => Object.values(category))
                .flat()
                .map((page) => ({ title: page.title, id: page.id, category: page.category, link: page.link, description: page.descriptionParsed, keywords: page.keywords })),
            null,
            2
        )
    )
);

fastify.get('/cors-anywhere', async (request, reply) => {
    logApiRequest(request);

    if (!request.query.url) reply.status(400).send('No URL provided');

    let response;
    try {
        response = await fetch(request.query.url);
    } catch {
        reply.status(400).send('Invalid URL');
    }

    if (response.headers.get('content-type').startsWith('image/'))
        reply
            .header('Access-Control-Allow-Origin', '*')
            .type('image/png')
            .status(response.status)
            .send(await response.buffer());
    else
        reply
            .header('Access-Control-Allow-Origin', '*')
            .status(response.status)
            .send(await response.text());
});

// Render each tool/info/fun page
const pagesWithScripts = fs
    .readdirSync('public/scripts/pages')
    .map((category) => fs.readdirSync(`public/scripts/pages/${category}`).map((script) => `${category}/${script.replace(/\.js$/, '')}`))
    .flat();

const pagesWithStyles = fs
    .readdirSync('public/styles/pages')
    .map((category) => fs.readdirSync(`public/styles/pages/${category}`).map((style) => `${category}/${style.replace(/\.css$/, '')}`))
    .flat();

let totalCategories = 0,
    totalPages = 0;

fs.readdirSync('./views/pages').forEach((category) => {
    totalCategories++;
    const pages = fs.readdirSync(`./views/pages/${category}`).filter((file) => file.endsWith('.ejs'));
    totalPages += pages.length;

    pages.forEach((page) => {
        page = page.replace(/.ejs$/, '');
        const pageInfo = pagesParsed[category]?.[page];
        if (!pageInfo) return console.log(`${chalk.blue('[Page Auto-Loader]')} ${chalk.red(`Unable to find page information for ${category}/${page}!`)}`);
        fastify.get(pageInfo.link, (request, reply) => {
            reply.view(`pages/${category}/${page}.ejs`, { script: pagesWithScripts.includes(`${category}/${page}`), style: pagesWithStyles.includes(`${category}/${page}`), ...pageInfo });
        });
    });
});

console.log(chalk.blue(`[Page Auto-Loader] Successfully parsed and auto-loaded ${totalPages} pages in ${totalCategories} categories!`));

// Twemoji images
fastify.get('/twemoji/:id', async (request, reply) => {
    logApiRequest(request);
    const response = await fetch(`https://abs.twimg.com/emoji/v2/svg/${request.params.id}.svg`);
    if (!response.ok) return reply.type('image/png').send();

    const canvas = Canvas.createCanvas(500, 500);
    const image = await Canvas.loadImage(await response.buffer());
    image.height = image.width = 500;
    canvas.getContext('2d').drawImage(image, 0, 0, 500, 500);
    reply.type('image/png').send(canvas.toBuffer());
});

// Astronomy Picture of the Day (NASA)
fastify.get('/apod/:year/:month/:day', async (request, reply) => {
    logApiRequest(request);
    const response = await fetchApod(request.params.year, request.params.month, request.params.day);
    reply.send(JSON.stringify(response, null, 2));
});

// Setup error handlers
fastify.setErrorHandler((error, request, reply) => {
    console.log(error);
    reply.status(error.statusCode || 500).view('/error.ejs', { ...blankProperties, title: 'Internal Server Error', message: 'Looks like an error occurred!', status: error.statusCode || 500 });
});

fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).view('/error.ejs', { ...blankProperties, title: 'Not Found', message: 'Unable to find the requested page!', status: 404 });
});

const port = process.env.PORT || 3000;

// Start server
fastify.listen({ port, host: '0.0.0.0' }, (error) => {
    if (error) {
        fastify.log.error(error);
        process.exit(1);
    }
    console.log(chalk.green('Server is now listening on ') + chalk.blueBright(`http://localhost:${port}`));
});

/**
 * Logs information about an API request
 * @param {import('fastify').FastifyRequest} request the request object
 */
function logApiRequest(request) {
    console.log(`${chalk.green('[API request]')} ${chalk.gray(request.method)} ${chalk.yellow(request.url)}`);
}
