/* eslint-env node */

import fastifyStatic from '@fastify/static';
import 'dotenv/config';
import ejs from 'ejs';
import Fastify from 'fastify';
import fs from 'fs';
import path from 'path';
import pointOfView from 'point-of-view';
import Request from 'request';
import { allPageInfo, blankProperties } from './public/data/pages.js';

// Load layouts and static assets
const fastify = Fastify();

fastify.register(pointOfView, { engine: { ejs }, root: 'views', layout: '/layouts/layout.ejs' });

const __dirname = path.dirname(new URL(import.meta.url).pathname);

fastify.register(fastifyStatic, { root: path.join(__dirname, 'public') });

// Register pages
fastify.get('/', (request, reply) => {
    reply.view('/index.ejs', {
        title: 'Home',
        pages: Object.keys(allPageInfo).map((key) => {
            return { name: key, ...allPageInfo[key] };
        }),
        ...blankProperties,
    });
});

fastify.get('/search', (request, reply) => {
    reply.view('/search.ejs', { title: 'Search', description: '', page: '', additionalScripts: ['/scripts/search.js'], additionalStyles: [], script: false });
});

fastify.get('/headers', (request, reply) => {
    reply.status(200).send(JSON.stringify(request.headers, null, 2));
});

const pagesInfo = Object.keys(allPageInfo).map((key) => {
    return { title: allPageInfo[key].title, link: allPageInfo[key].link, description: allPageInfo[key].description.replace(/<span.*?>(.*?)<\/span>/g, '$1'), keywords: allPageInfo[key].keywords };
});

fastify.get('/pages', (request, reply) => {
    reply.status(200).send(JSON.stringify(pagesInfo, null, 2));
});

fastify.get('/cors-anywhere', (request, reply) => {
    Request({ url: request.query.url }, (error, response, body) => {
        reply.header('Access-Control-Allow-Origin', '*').send(body);
    });
});

fs.readdirSync('./views/pages').forEach((category) => {
    const pages = fs.readdirSync(`./views/pages/${category}`).filter((file) => file.endsWith('.ejs'));

    pages.forEach((page) => {
        page = page.replace('.ejs', '');
        const pageInfo = allPageInfo[page];
        if (!pageInfo) return console.log(`Unable to find page information: ${category}/${page}`);
        fastify.get(`/${category}/${page}`, (request, reply) => {
            reply.view(`pages/${category}/${page}.ejs`, { ...pageInfo, page });
        });
    });
});

// Setup error handlers
fastify.setErrorHandler((error, request, reply) => {
    console.log(error);
    reply.status(error.statusCode || 500).view('/error.ejs', { title: error.message.length > 50 ? 'Internal Server Error' : error.message, message: error.message, error, ...blankProperties });
});

fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).view('/error.ejs', { title: 'Not Found', message: 'Not Found', error: { status: 404 }, ...blankProperties });
});

// Start server
fastify.listen({ port: process.env.PORT || 3000 }, (error) => {
    if (error) {
        fastify.log.error(error);
        process.exit(1);
    }
    console.log('Server is now listening on http://localhost:3000');
});
