/* eslint-env node */
/* eslint-disable no-console */

import fastifyStatic from '@fastify/static';
import pointOfView from '@fastify/view';
import Canvas from 'canvas';
import 'dotenv/config';
import ejs from 'ejs';
import Fastify from 'fastify';
import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import Request from 'request';
import { blankProperties, pagesParsed, pagesParsedValues } from './public/data/pages.js';

// Load layouts and static assets
const fastify = Fastify();

fastify.register(pointOfView, { engine: { ejs }, root: 'views', layout: '/layouts/layout.ejs' });

const __dirname = path.dirname(new URL(import.meta.url).pathname);

fastify.register(fastifyStatic, { root: path.join(__dirname, 'public') });

// Register pages
fastify.get('/', (request, reply) => {
    reply.view('/index.ejs', { title: 'Home', pages: pagesParsedValues, ...blankProperties });
});

fastify.get('/search', (request, reply) => {
    reply.view('/search.ejs', { title: 'Search', descriptionParsed: 'Search the site!', page: '', additionalScripts: [{ link: '/scripts/search.js', module: true }], additionalStyles: [], keywords: [], script: false });
});

fastify.get('/headers', (request, reply) => {
    reply.status(200).send(JSON.stringify(request.headers, null, 2));
});

const shortPagesInfo = pagesParsedValues.map((page) => ({ title: page.title, name: page.name, category: page.category, link: page.link, description: page.descriptionParsed, keywords: page.keywords }));

fastify.get('/pages', (request, reply) => {
    reply.status(200).send(JSON.stringify(shortPagesInfo, null, 2));
});

fastify.get('/cors-anywhere', async (request, reply) => {
    if (!request.query.image) {
        Request({ url: request.query.url }, (error, response, body) => {
            reply.header('Access-Control-Allow-Origin', '*').send(body);
        });
    } else {
        let response = await fetch(request.query.url);

        if (!response.ok) return reply.header('Access-Control-Allow-Origin', '*').type('image/png').send();

        response = await response.buffer();

        reply.header('Access-Control-Allow-Origin', '*').type('image/png').send(response);
    }
});

// Render each tool/info/fun page
fs.readdirSync('./views/pages').forEach((category) => {
    const pages = fs.readdirSync(`./views/pages/${category}`).filter((file) => file.endsWith('.ejs'));

    pages.forEach((page) => {
        page = page.replace('.ejs', '');
        const pageInfo = pagesParsed[page];
        if (!pageInfo) return console.log(`Unable to find page information: ${category}/${page}`);
        fastify.get(`/${category}/${page}`, (request, reply) => {
            reply.view(`pages/${category}/${page}.ejs`, pageInfo);
        });
    });
});

// Twemoji images
fastify.get('/twemoji/:id', async (request, reply) => {
    const response = await fetch(`https://abs.twimg.com/emoji/v2/svg/${request.params.id}.svg`);
    if (!response.ok) return reply.header('Access-Control-Allow-Origin', '*').type('image/png').send();

    const canvas = Canvas.createCanvas(500, 500);
    const image = await Canvas.loadImage(await response.buffer());
    image.height = image.width = 500;
    canvas.getContext('2d').drawImage(image, 0, 0, 500, 500);
    reply.type('image/png').send(canvas.toBuffer());
});

// Setup error handlers
fastify.setErrorHandler((error, request, reply) => {
    console.log(error);
    reply.status(error.statusCode || 500).view('/error.ejs', { title: 'Internal Server Error', message: 'Looks like an error occurred!', status: error.statusCode || 500, ...blankProperties });
});

fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).view('/error.ejs', { title: 'Not Found', message: 'Unable to find the requested page!', status: 404, ...blankProperties });
});

// Start server
fastify.listen({ port: process.env.PORT || 3000 }, (error) => {
    if (error) {
        fastify.log.error(error);
        process.exit(1);
    }
    console.log('Server is now listening on http://localhost:3000');
});
