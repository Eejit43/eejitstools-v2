import fastifyRateLimit from '@fastify/rate-limit';
import fastifyStatic from '@fastify/static';
import pointOfView from '@fastify/view';
import Canvas from 'canvas';
import chalk from 'chalk';
import { consola } from 'consola';
import Fastify, { FastifyError, FastifyRequest } from 'fastify';
import handlebars from 'handlebars';
import mongoose, { Schema, model } from 'mongoose';
import fs from 'node:fs';
import path from 'node:path';
import { fetchApod } from './apod-fetcher.js';
import { Coin, ParsedCoinType, coinsData } from './public/data/coins-data.js';
import { allPages, blankProperties, toneIndicators } from './public/data/pages.js';

// Add Handlebars helper functions
handlebars.registerHelper('isEmpty', handlebars.Utils.isEmpty);

// Load layouts and static assets
const fastify = Fastify();

await fastify.register(fastifyRateLimit.default);

fastify.register(pointOfView, { engine: { handlebars }, root: 'src/views/', layout: 'layouts/layout.hbs' });

const dirname = path.dirname(new URL(import.meta.url).pathname);

fastify.register(fastifyStatic, { root: path.join(dirname, 'public') });

// Define latest commit info
const commitSha = process.env.RAILWAY_GIT_COMMIT_SHA?.slice(0, 7);
const commitMessage = process.env.RAILWAY_GIT_COMMIT_MESSAGE;
const commitAuthor = process.env.RAILWAY_GIT_AUTHOR;

const commitInfo = commitSha ? { sha: commitSha, message: commitMessage, author: commitAuthor } : null;

// Register pages
fastify.get('/', (request, reply) => reply.view('/index', { ...blankProperties, commitInfo, title: 'Home', pages: allPages, additionalStyles: [{ link: 'index.css' }] }));

fastify.get('/search', (request, reply) =>
    reply.view('/search', {
        ...blankProperties,
        commitInfo,
        title: 'Search',
        descriptionParsed: 'Search the site!',
        additionalScripts: [{ link: '/scripts/search.js', module: true }],
        additionalStyles: [{ link: 'search.css' }],
    }),
);

fastify.get('/coins-login', (request, reply) => reply.send(JSON.stringify({ success: (request.query as { password: string }).password === process.env.COINS_PASSWORD }, null, 2)));

const coinsModel = model('coins-data', new Schema({ name: String, id: String, coins: Array }));

fastify.get('/coins-list', async (request, reply) => {
    if ((request.query as { password: string }).password !== process.env.COINS_PASSWORD) return reply.send(JSON.stringify({ error: 'Invalid password!' }, null, 2));

    const mergedCoinsData = await Promise.all(
        coinsData.map(async (coinType) => {
            let coinsDatabaseEntry = (await coinsModel.findOne({ id: coinType.id })) as ParsedCoinType | null;
            if (!coinsDatabaseEntry)
                coinsDatabaseEntry = coinsModel.create({
                    name: coinType.name,
                    id: coinType.id,
                    coins: coinType.coins?.map((variant) => ({
                        ...variant,
                        coins: variant.coins?.map((coin) => ({ ...coin, id: Math.floor(Math.random() * 9_000_000_000 + 1_000_000_000) })),
                    })),
                }) as unknown as ParsedCoinType;

            return { name: coinsDatabaseEntry.name, id: coinsDatabaseEntry.id, coins: coinsDatabaseEntry.coins };
        }),
    );

    reply.send(JSON.stringify(mergedCoinsData, null, 2));
});

fastify.post('/coins-list-edit', async (request, reply) => {
    const { coinTypeId, coinVariantId, coinId, data, password } = request.body as { coinTypeId: string; coinVariantId: string; coinId: string; data: Partial<Coin>; password: string };

    if (password !== process.env.COINS_PASSWORD) return reply.send(JSON.stringify({ error: 'Invalid password!' }, null, 2));

    const databaseCoinType = (await coinsModel.findOne({ id: coinTypeId })) as ParsedCoinType | null;
    if (!databaseCoinType) return reply.send(JSON.stringify({ error: 'Invalid coin type!' }, null, 2));

    databaseCoinType.coins = databaseCoinType.coins.map((coinVariant) => {
        if (coinVariant.id === coinVariantId)
            return {
                ...coinVariant,
                coins: coinVariant.coins.map((coin) => {
                    if (coin.id === Number.parseInt(coinId))
                        for (const [key, value] of Object.entries(data))
                            if (value === null) delete coin[key as keyof Coin];
                            else coin[key as keyof Coin] = value as never;

                    return coin;
                }),
            };

        return coinVariant;
    });

    await coinsModel.replaceOne({ id: coinTypeId }, databaseCoinType);

    reply.send(JSON.stringify({ success: true }, null, 2));
});

fastify.post('/coins-list-add-coin', async (request, reply) => {
    const { coinTypeId, coinVariantId, coinYear, coinId, password } = request.body as { coinTypeId: string; coinVariantId: string; coinYear: string; coinId: number; password: string };

    if (password !== process.env.COINS_PASSWORD) return reply.send(JSON.stringify({ error: 'Invalid password!' }, null, 2));

    const databaseCoinType = (await coinsModel.findOne({ id: coinTypeId })) as ParsedCoinType | null;
    if (!databaseCoinType) return reply.send(JSON.stringify({ error: 'Invalid coin type!' }, null, 2));

    const databaseCoinVariant = databaseCoinType.coins.find((variant) => variant.id === coinVariantId);
    if (!databaseCoinVariant) return reply.send(JSON.stringify({ error: 'Invalid coin variant!' }, null, 2));

    databaseCoinVariant.coins.push({ year: coinYear, obtained: false, id: coinId });

    await coinsModel.replaceOne({ id: coinTypeId }, databaseCoinType);

    reply.send(JSON.stringify({ success: true }, null, 2));
});

let calendarEventsCache: string | null = null;

export interface CalendarEvents {
    holidays: { name: string; date: string }[];
    moonPhases: { phase: string; date: string; time: string }[];
}

interface Calendar {
    items: {
        summary: string;
        start: { date: string };
    }[];
}

fastify.get('/calendar-events', async (request, reply) => {
    if (calendarEventsCache) return reply.send(calendarEventsCache);

    const holidays = (
        (await (await fetch(`https://www.googleapis.com/calendar/v3/calendars/en.usa%23holiday%40group.v.calendar.google.com/events?key=${process.env.GOOGLE_CALENDAR_API_KEY!}`)).json()) as Calendar
    ).items
        .map((holiday) => ({ name: holiday.summary, date: holiday.start.date }))
        .filter((holiday) => !holiday.name.includes(' (substitute)'))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const moonPhases = (
        (await (
            await fetch(`https://www.googleapis.com/calendar/v3/calendars/ht3jlfaac5lfd6263ulfh4tql8%40group.calendar.google.com/events?key=${process.env.GOOGLE_CALENDAR_API_KEY!}`)
        ).json()) as Calendar
    ).items
        .map((moonPhase) => ({
            phase: moonPhase.summary.match(/([\w ]+) \d/)![1],
            date: moonPhase.start.date,
            time: moonPhase.summary.match(/[\w ]+ ([\w:]+)/)![1].replace(/(\d)([ap]m)/, '$1 $2'),
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const result: CalendarEvents = { holidays, moonPhases };

    calendarEventsCache = JSON.stringify(result, null, 2);
    reply.send(calendarEventsCache);
});

interface TodoData {
    year: string;
    dates: Record<string, Record<string, Record<string, boolean>>>;
}

interface TodoOption {
    title: string;
    id: string;
    frequency: string;
}

const todoModel = model('todo', new Schema({ year: String, dates: Object }));
const todoOptionsModel = model('todo-options', new Schema({ data: Array }));
let todoOptions: TodoOption[] | null = null;

// eslint-disable-next-line @typescript-eslint/naming-convention
fastify.get('/calendar-todo', async (request: FastifyRequest<{ Querystring: { password: string } }>, reply) => {
    if (request.query.password !== process.env.CALENDAR_TODO_PASSWORD) return reply.send(JSON.stringify({ error: 'Invalid password!' }, null, 2));
    const data = Object.fromEntries(((await todoModel.find({})) as TodoData[]).map((todo) => [todo.year, todo.dates]));

    if (!todoOptions) todoOptions = (await todoOptionsModel.findOne({}))!.data;

    reply.send(JSON.stringify({ todo: todoOptions, data }, null, 2));
});

// eslint-disable-next-line @typescript-eslint/naming-convention
fastify.post('/calendar-todo-edit', async (request: FastifyRequest<{ Body: { password: string; todo: Record<string, boolean>; year: string; month: string; date: string } }>, reply) => {
    const { password, todo } = request.body;
    const year = Number.parseInt(request.body.year);
    const month = Number.parseInt(request.body.month);
    const date = Number.parseInt(request.body.date);

    if (password !== process.env.CALENDAR_TODO_PASSWORD) return reply.send(JSON.stringify({ error: 'Invalid password!' }, null, 2));

    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(date)) return reply.send(JSON.stringify({ error: 'A date parameter is NaN!' }, null, 2));
    if (month < 1 || month > 12) return reply.send(JSON.stringify({ error: 'Invalid month parameter!' }, null, 2));
    if (date < 1 || date > 31) return reply.send(JSON.stringify({ error: 'Invalid date parameter!' }, null, 2));

    let yearEntry: TodoData | null = await todoModel.findOne({ year });
    if (!yearEntry) {
        await todoModel.create({ year, dates: {} });
        yearEntry = (await todoModel.findOne({ year }))!;
    }

    if (!yearEntry.dates) yearEntry.dates = {};
    if (!yearEntry.dates[month]) yearEntry.dates[month] = {};
    yearEntry.dates[month][date] = todo;

    await todoModel.replaceOne({ year }, yearEntry);

    const data = Object.fromEntries(((await todoModel.find({})) as TodoData[]).map((todo) => [todo.year, todo.dates]));

    if (!todoOptions) todoOptions = (await todoOptionsModel.findOne({}))!.data;

    reply.send(JSON.stringify({ todo: todoOptions, data }, null, 2));
});

fastify.get('/tone-indicators', (request, reply) => reply.send(JSON.stringify(toneIndicators, null, 2)));

fastify.get('/headers', (request, reply) => reply.send(JSON.stringify(request.headers, null, 2)));

fastify.get('/pages', (request, reply) =>
    reply.send(
        JSON.stringify(
            Object.values(allPages)
                .flatMap((category) => Object.values(category))
                .map((page) => ({ title: page.title, id: page.id, category: page.category, link: page.link, description: page.descriptionParsed, keywords: page.keywords })),
            null,
            2,
        ),
    ),
);

// eslint-disable-next-line @typescript-eslint/naming-convention
fastify.get('/cors-anywhere', async (request: FastifyRequest<{ Querystring: { url: string } }>, reply) => {
    logApiRequest(request);

    if (!request.query.url) reply.status(400).send('No URL provided');

    let url: URL | null = null;
    try {
        url = new URL(request.query.url);
    } catch {
        reply.status(400).send('Invalid URL');
    }

    if (!url) return;

    for (const [key, value] of Object.entries(request.query)) if (key !== 'url') url!.searchParams.append(key, value);

    let response;
    try {
        response = await fetch(url.toString());
    } catch {
        reply.status(400).send('Invalid URL');
    }

    if (!response) return;

    if (response.headers.get('content-type')!.startsWith('image/'))
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
const pagesWithScripts = new Set(
    fs.readdirSync('src/public/scripts/pages').flatMap((category) =>
        fs
            .readdirSync(`src/public/scripts/pages/${category}`)
            .filter((script) => script.endsWith('.ts'))
            .map((script) => `${category}/${script.replace(/\.ts$/, '')}`),
    ),
);

const pagesWithStyles = new Set(
    fs.readdirSync('src/public/styles/pages').flatMap((category) => fs.readdirSync(`src/public/styles/pages/${category}`).map((style) => `${category}/${style.replace(/\.css$/, '')}`)),
);

let totalCategories = 0,
    totalPages = 0;

for (const category of fs.readdirSync('src/views/pages')) {
    totalCategories++;
    const pages = fs.readdirSync(`src/views/pages/${category}`).filter((file) => file.endsWith('.hbs'));
    totalPages += pages.length;

    for (let page of pages) {
        page = page.replace(/.hbs$/, '');
        const pageInfo = allPages[category]?.[page];
        if (!pageInfo) {
            consola.log(`${chalk.blue('[Page Auto-Loader]')} ${chalk.red(`Unable to find page information for ${category}/${page}!`)}`);
            continue;
        }
        fastify.get(pageInfo.link, (request, reply) => {
            reply.view(`pages/${category}/${page}`, { commitInfo, ...pageInfo, script: pagesWithScripts.has(`${category}/${page}`), style: pagesWithStyles.has(`${category}/${page}`) });
        });
    }
}

consola.log(`${chalk.blue('[Page Auto-Loader]:')} Successfully parsed and auto-loaded ${chalk.yellow(totalPages)} pages in ${chalk.yellow(totalCategories)} categories!`);

// Twemoji images
// eslint-disable-next-line @typescript-eslint/naming-convention
fastify.get('/twemoji/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
    logApiRequest(request);
    const response = await fetch(`https://raw.githubusercontent.com/jdecked/twemoji/main/assets/svg/${request.params.id}.svg`);
    if (!response.ok) return reply.type('image/png').send();

    const canvas = Canvas.createCanvas(500, 500);
    const image = await Canvas.loadImage(Buffer.from(await response.arrayBuffer()));
    image.height = image.width = 500;
    canvas.getContext('2d').drawImage(image, 0, 0, 500, 500);
    reply.type('image/png').send(canvas.toBuffer());
});

// Astronomy Picture of the Day (NASA)
// eslint-disable-next-line @typescript-eslint/naming-convention
fastify.get('/apod/:year/:month/:day', async (request: FastifyRequest<{ Params: { year: string; month: string; day: string } }>, reply) => {
    logApiRequest(request);
    const response = await fetchApod(request.params.year, request.params.month, request.params.day);
    reply.send(JSON.stringify(response, null, 2));
});

// Setup error handlers
fastify.setErrorHandler((error, request, reply) => {
    if (error.statusCode === 429) return reply.status(429).send('Woah there! Stop sending so many requests!');
    consola.error(error);
    reply
        .status(error.statusCode ?? 500)
        .view('/error.hbs', { ...blankProperties, commitInfo, title: 'Internal Server Error', message: 'Looks like an error occurred!', status: error.statusCode ?? 500 });
});

fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).view('/error.hbs', { ...blankProperties, commitInfo, title: 'Not Found', message: 'Unable to find the requested page!', status: 404 });
});

const port = process.env.PORT ? Number.parseInt(process.env.PORT) : 3000;

// Start server
fastify.listen({ port, host: '0.0.0.0' }, (error) => {
    if (error) {
        if ((error as FastifyError).code === 'EADDRINUSE') consola.error(`${chalk.red('[Startup error]:')} Port ${chalk.yellow(port)} is already in use!`);
        else consola.error(error);
        process.exit(1); // eslint-disable-line unicorn/no-process-exit
    }

    consola.success(`${chalk.green('Server is now listening on port')} ${chalk.yellow(port)}${process.env.NODE_ENV === 'production' ? '' : ` (${chalk.blueBright(`http://localhost:${port}`)})`}`);
});

/**
 * Logs information about an API request.
 * @param request The request object.
 */
function logApiRequest(request: FastifyRequest) {
    consola.log(`${chalk.green('[API request]:')} ${chalk.gray(request.method)} ${chalk.yellow(request.url)}`);
}

// Custom error/warning handlers
process.on('uncaughtException', (error) => consola.error(error));
process.on('uncaughtExceptionMonitor', (error) => consola.error(error));
process.on('unhandledRejection', (error) => consola.error(error));
process.on('warning', (warning) => consola.warn(warning));

// Setup database connection
mongoose.set('strictQuery', true);

await mongoose.connect(process.env.DATABASE_URL!);
consola.success(`${chalk.green('[Database]:')} Successfully connected to the database!`);