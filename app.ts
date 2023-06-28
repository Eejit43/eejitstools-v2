import fastifyStatic from '@fastify/static';
import pointOfView from '@fastify/view';
import Canvas from 'canvas';
import chalk from 'chalk';
import { consola } from 'consola';
import Fastify from 'fastify';
import fs from 'fs';
import handlebars from 'handlebars';
import mongoose, { model, Schema } from 'mongoose';
import path from 'path';
import { fetchApod } from './apod-fetcher.js';
import coinsData from './data/coins-data.js';
import { blankProperties, pagesParsed, toneIndicators } from './data/pages.js';

// Add Handlebars helper functions
handlebars.registerHelper('isEmpty', handlebars.Utils.isEmpty);

// Copy data and scripts to public folder
const dirname = path.dirname(new URL(import.meta.url).pathname);

if (fs.existsSync(path.join(dirname, 'public', 'data'))) fs.rmSync(path.join(dirname, 'public', 'data'), { recursive: true });

fs.mkdirSync(path.join(dirname, 'public', 'data'));

fs.readdirSync('data')
    .filter((file) => file.endsWith('.js'))
    .forEach((file) => fs.copyFileSync(path.join(dirname, 'data', file), path.join(dirname, 'public', 'data', file)));

fs.readdirSync('public/scripts').forEach((fileOrFolder) => {
    if (fileOrFolder.endsWith('external')) return;

    if (fileOrFolder.endsWith('.js')) fs.rmSync(path.join(dirname, 'public', 'scripts', fileOrFolder));
    else fs.rmSync(path.join(dirname, 'public', 'scripts', fileOrFolder), { recursive: true });
});

fs.mkdirSync(path.join(dirname, 'public', 'scripts', 'pages'));

fs.readdirSync('scripts').forEach((fileOrFolder) => {
    if (fileOrFolder.endsWith('.js')) fs.copyFileSync(path.join(dirname, 'scripts', fileOrFolder), path.join(dirname, 'public', 'scripts', fileOrFolder));
});

fs.readdirSync('scripts/pages').forEach((category) => {
    fs.mkdirSync(path.join(dirname, 'public', 'scripts', 'pages', category));

    fs.readdirSync(path.join(dirname, 'scripts', 'pages', category)).forEach((file) => {
        if (file.endsWith('.js')) fs.copyFileSync(path.join(dirname, 'scripts', 'pages', category, file), path.join(dirname, 'public', 'scripts', 'pages', category, file));
    });
});

// Load layouts and static assets
const fastify = Fastify();

fastify.register(pointOfView, { engine: { handlebars }, root: 'views', includeViewExtension: true, layout: '/layouts/layout' });

fastify.register(fastifyStatic, { root: path.join(dirname, 'public') });

// Register pages
fastify.get('/', (request, reply) => reply.view('/index', { ...blankProperties, title: 'Home', pages: pagesParsed, additionalStyles: [{ link: 'index.css' }] }));

fastify.get('/search', (request, reply) => reply.view('/search', { ...blankProperties, title: 'Search', descriptionParsed: 'Search the site!', additionalScripts: [{ link: '/scripts/search.js', module: true }], additionalStyles: [{ link: 'search.css' }] }));

fastify.get('/coins-login', (request, reply) => reply.send(JSON.stringify({ success: request.query.password === process.env.COINS_PASSWORD }, null, 2)));

const coinsModel = model('coins-data', new Schema({ name: String, id: String, coins: Array }));

fastify.get('/coins-list', async (request, reply) => {
    if (request.query.password !== process.env.COINS_PASSWORD) return reply.send(JSON.stringify({ error: 'Invalid password!' }, null, 2));

    const mergedCoinsData = await Promise.all(
        coinsData.map(async (coinType) => {
            let coinsDatabaseEntry = await coinsModel.findOne({ id: coinType.id });
            if (!coinsDatabaseEntry) {
                coinsDatabaseEntry = coinsModel.create({
                    name: coinType.name,
                    id: coinType.id,
                    coins: coinType.coins?.map((variant) => ({
                        ...variant,
                        coins: variant.coins?.map((coin) => ({ ...coin, id: Math.floor(Math.random() * 9000000000 + 1000000000) }))
                    }))
                });
            }
            return { name: coinsDatabaseEntry.name, id: coinsDatabaseEntry.id, coins: coinsDatabaseEntry.coins };
        })
    );

    reply.send(JSON.stringify(mergedCoinsData, null, 2));
});

fastify.post('/coins-list-edit', async (request, reply) => {
    const { coinTypeId, coinVariantId, coinId, data, password } = request.body;

    if (password !== process.env.COINS_PASSWORD) return reply.send(JSON.stringify({ error: 'Invalid password!' }, null, 2));

    const databaseCoinType = await coinsModel.findOne({ id: coinTypeId });
    if (!databaseCoinType) return reply.send(JSON.stringify({ error: 'Invalid coin type!' }, null, 2));

    databaseCoinType.coins = databaseCoinType.coins.map((coinVariant) => {
        if (coinVariant.id === coinVariantId) {
            return {
                ...coinVariant,

                coins: coinVariant.coins.map((coin) => {
                    if (coin.id === coinId) {
                        Object.entries(data).forEach(([key, value]) => {
                            if (value === null) delete coin[key];
                            else coin[key] = value;
                        });
                    }
                    return coin;
                })
            };
        }
        return coinVariant;
    });

    await coinsModel.replaceOne({ id: coinTypeId }, databaseCoinType);

    reply.send(JSON.stringify({ success: true }, null, 2));
});

let calendarEventsCache = null;

fastify.get('/calendar-events', async (request, reply) => {
    if (calendarEventsCache) return reply.send(calendarEventsCache);

    const holidays = (await (await fetch(`https://www.googleapis.com/calendar/v3/calendars/en.usa%23holiday%40group.v.calendar.google.com/events?key=${process.env.GOOGLE_CALENDAR_API_KEY}`)).json()).items
        .map((holiday) => ({ name: holiday.summary, date: holiday.start.date }))
        .filter((holiday) => !holiday.name.includes(' (substitute)'))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    const moonPhases = (await (await fetch(`https://www.googleapis.com/calendar/v3/calendars/ht3jlfaac5lfd6263ulfh4tql8%40group.calendar.google.com/events?key=${process.env.GOOGLE_CALENDAR_API_KEY}`)).json()).items
        .map((moonPhase) => ({
            phase: moonPhase.summary.match(/([\w ]+) \d/)[1],
            date: moonPhase.start.date,
            time: moonPhase.summary.match(/[\w ]+ ([\d:\w]+)/)[1].replace(/(\d)([ap]m)/, '$1 $2')
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    const result = { holidays, moonPhases };

    calendarEventsCache = JSON.stringify(result, null, 2);
    reply.send(calendarEventsCache);
});

const todoModel = model('todo', new Schema({ year: String, dates: Object }));

const todoOptionsModel = model('todo-options', new Schema({ data: Array }));
let todoOptions;

fastify.get('/calendar-todo', async (request, reply) => {
    if (request.query.password !== process.env.CALENDAR_TODO_PASSWORD) return reply.send(JSON.stringify({ error: 'Invalid password!' }, null, 2));
    const data = Object.fromEntries((await todoModel.find({})).map((todo) => [todo.year, todo.dates]));

    if (!todoOptions) todoOptions = (await todoOptionsModel.findOne({})).data;

    reply.send(JSON.stringify({ todo: todoOptions, data }, null, 2));
});

fastify.post('/calendar-todo-edit', async (request, reply) => {
    const { password, todo } = request.body;
    const year = parseInt(request.body.year);
    const month = parseInt(request.body.month);
    const date = parseInt(request.body.date);

    if (password !== process.env.CALENDAR_TODO_PASSWORD) return reply.send(JSON.stringify({ error: 'Invalid password!' }, null, 2));

    if (isNaN(year) || isNaN(month) || isNaN(date)) return reply.send(JSON.stringify({ error: 'A date parameter is NaN!' }, null, 2));
    if (month < 1 || month > 12) return reply.send(JSON.stringify({ error: 'Invalid month parameter!' }, null, 2));
    if (date < 1 || date > 31) return reply.send(JSON.stringify({ error: 'Invalid date parameter!' }, null, 2));

    let yearEntry = await todoModel.findOne({ year });
    if (!yearEntry) {
        await todoModel.create({ year, dates: {} });
        yearEntry = await todoModel.findOne({ year });
    }

    if (!yearEntry.dates) yearEntry.dates = {};
    if (!yearEntry.dates[month]) yearEntry.dates[month] = {};
    yearEntry.dates[month][date] = todo;

    await todoModel.replaceOne({ year }, yearEntry);

    const data = Object.fromEntries((await todoModel.find({})).map((todo) => [todo.year, todo.dates]));

    if (!todoOptions) todoOptions = (await todoOptionsModel.findOne({})).data;

    reply.send(JSON.stringify({ todo: todoOptions, data }, null, 2));
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

    let url;
    try {
        url = new URL(request.query.url);
    } catch {
        reply.status(400).send('Invalid URL');
    }

    Object.entries(request.query).forEach(([key, value]) => {
        if (key !== 'url') url.searchParams.append(key, value);
    });

    let response;
    try {
        response = await fetch(url.toString());
    } catch {
        reply.status(400).send('Invalid URL');
    }

    if (!response) return;

    if (response.headers.get('content-type').startsWith('image/'))
        reply
            .header('Access-Control-Allow-Origin', '*')
            .type('image/png')
            .status(response.status)
            .send(Buffer.from(await response.arrayBuffer()));
    else
        reply
            .header('Access-Control-Allow-Origin', '*')
            .status(response.status)
            .send(await response.text());
});

// Render each tool/info/fun page
const pagesWithScripts = fs
    .readdirSync('scripts/pages')
    .map((category) =>
        fs
            .readdirSync(`scripts/pages/${category}`)
            .filter((script) => script.endsWith('.js'))
            .map((script) => `${category}/${script.replace(/\.js$/, '')}`)
    )
    .flat();

const pagesWithStyles = fs
    .readdirSync('public/styles/pages')
    .map((category) => fs.readdirSync(`public/styles/pages/${category}`).map((style) => `${category}/${style.replace(/\.css$/, '')}`))
    .flat();

let totalCategories = 0,
    totalPages = 0;

fs.readdirSync('views/pages').forEach((category) => {
    totalCategories++;
    const pages = fs.readdirSync(`views/pages/${category}`).filter((file) => file.endsWith('.hbs'));
    totalPages += pages.length;

    pages.forEach((page) => {
        page = page.replace(/.hbs$/, '');
        const pageInfo = pagesParsed[category]?.[page];
        if (!pageInfo) return consola.log(`${chalk.blue('[Page Auto-Loader]')} ${chalk.red(`Unable to find page information for ${category}/${page}!`)}`);
        fastify.get(pageInfo.link, (request, reply) => {
            reply.view(`pages/${category}/${page}`, { script: pagesWithScripts.includes(`${category}/${page}`), style: pagesWithStyles.includes(`${category}/${page}`), ...pageInfo });
        });
    });
});

consola.log(`${chalk.blue('[Page Auto-Loader]:')} Successfully parsed and auto-loaded ${chalk.yellow(totalPages)} pages in ${chalk.yellow(totalCategories)} categories!`);

// Twemoji images
fastify.get('/twemoji/:id', async (request, reply) => {
    logApiRequest(request);
    const response = await fetch(`https://raw.githubusercontent.com/jdecked/twemoji/main/assets/svg/${request.params.id}.svg`);
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
    consola.error(error);
    reply.status(error.statusCode || 500).view('/error.hbs', { ...blankProperties, title: 'Internal Server Error', message: 'Looks like an error occurred!', status: error.statusCode || 500 });
});

fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).view('/error.hbs', { ...blankProperties, title: 'Not Found', message: 'Unable to find the requested page!', status: 404 });
});

const port = process.env.PORT || 3000;

// Start server
fastify.listen({ port, host: '0.0.0.0' }, (error) => {
    if (error) {
        if (error.code === 'EADDRINUSE') consola.error(`${chalk.red('[Startup error]:')} Port ${chalk.yellow(port)} is already in use!`);
        else consola.error(`${chalk.red('[Startup error]:')} ${error}`);
        process.exit(1);
    }

    consola.success(`${chalk.green('Server is now listening on port')} ${chalk.yellow(port)}${process.env.NODE_ENV !== 'production' ? ` (${chalk.blueBright(`http://localhost:${port}`)})` : ''}`);
});

/**
 * Logs information about an API request
 * @param {import('fastify').FastifyRequest} request the request object
 */
function logApiRequest(request) {
    consola.log(`${chalk.green('[API request]:')} ${chalk.gray(request.method)} ${chalk.yellow(request.url)}`);
}

mongoose.set('strictQuery', true);

await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
consola.success(`${chalk.green('[Database]:')} Successfully connected to the database!`);