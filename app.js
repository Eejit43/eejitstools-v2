if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const fs = require('fs');
const createError = require('http-errors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const http = require('http');
const debug = require('debug')('eejitstools:server');
const { allPageInfo } = require('./pages');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3000;

app.set('port', port);

server.listen(port);

server.on('error', (error) => {
    if (error.syscall !== 'listen') throw error;

    switch (error.code) {
        case 'EACCES':
            console.error(`Port ${port} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`Port ${port} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});

server.on('listening', () => {
    debug(`Listening on ${server.address().port}`);
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.set('json spaces', 2);

app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index', { title: 'Home', page: '', additionalScript: '', additionalStyle: '' });
});

app.get('/headers', (req, res) => {
    res.status(200).json(req.headers);
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

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error', { title: err.message, page: '', additionalScript: '', additionalStyle: '' });
});
