/* eslint-env node */

import debug from 'debug';
import 'dotenv/config';
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import fs from 'fs';
import http from 'http';
import createError from 'http-errors';
import path from 'path';
import request from 'request';
import { allPageInfo, blankProperties } from './public/data/pages.js';

const log = debug('eejitstools:server');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3000;

const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.set('port', port);

server.listen(port);

server.on('error', (error) => {
    if (error.syscall !== 'listen') throw error;

    switch (error.code) {
        case 'EACCES':
            console.error(`Port ${port} requires elevated privileges!`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`Port ${port} is already in use!`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});

server.on('listening', () => {
    log(`Listening on ${server.address().port}`);
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.set('json spaces', 2);

app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home',
        pages: Object.keys(allPageInfo).map((key) => {
            return { name: key, ...allPageInfo[key] };
        }),
        ...blankProperties,
    });
});

app.get('/headers', (req, res) => {
    res.status(200).json(req.headers);
});

app.get('/pages', (req, res) => {
    res.status(200).json(
        Object.keys(allPageInfo).map((key) => {
            return { title: allPageInfo[key].title, link: allPageInfo[key].link, description: allPageInfo[key].description.replace(/<span.*?>(.*?)<\/span>/g, '$1'), keywords: allPageInfo[key].keywords };
        })
    );
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/cors-anywhere', (req, res) => {
    request({ url: req.query.url }, (error, response, body) => {
        res.send(body);
    });
});

fs.readdirSync('./views/pages').forEach((category) => {
    const pages = fs.readdirSync(`./views/pages/${category}`).filter((file) => file.endsWith('.ejs'));

    pages.forEach((page) => {
        page = page.replace('.ejs', '');
        const pageInfo = allPageInfo[page];
        if (!pageInfo) return console.log(`Unable to find page information: ${category}/${page}`);
        app.get(`/${category}/${page}`, (req, res) => {
            res.render(`pages/${category}/${page}`, { ...pageInfo, page });
        });
    });
});

app.use((req, res, next) => {
    next(createError(404));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    if (!/NotFoundError: Not Found/.test(err)) console.log(err);

    res.status(err.status || 500);
    res.render('error', { title: err.message.length > 50 ? 'Error' : err.message, message: err.message, error: err, ...blankProperties });
});
