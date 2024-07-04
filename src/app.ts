import fastifyRateLimit from '@fastify/rate-limit';
import fastifyStatic from '@fastify/static';
import pointOfView from '@fastify/view';
import chalk from 'chalk';
import { consola } from 'consola';
import Fastify, { FastifyError, FastifyRequest } from 'fastify';
import handlebars from 'handlebars';
import mongoose from 'mongoose';
import path from 'node:path';
import { euroImageAmounts, euroVariantImageAmounts, toneIndicators } from './public/data/pages-data.js';
import { allPages, blankProperties } from './public/data/pages.js';
import setupRoutes from './route-handlers/index.js';

// Add Handlebars helper functions
handlebars.registerHelper('isEmpty', handlebars.Utils.isEmpty);
handlebars.registerHelper('iterateEuroCoin', (type: string, options: Handlebars.HelperOptions) => {
    const amount = euroImageAmounts[type] ?? 1;

    let accumulator = '';
    for (let index = 1; index <= amount; ++index) accumulator += options.fn({ code: index === 1 ? '' : `-${index}`, text: amount > 1 ? ` ${index}` : '' });
    return accumulator;
});
handlebars.registerHelper('iterateEuroCoinVariant', (type: string, country: string, options: Handlebars.HelperOptions) => {
    const amount = euroVariantImageAmounts[type][country] ?? 1;

    let accumulator = '';
    for (let index = 1; index <= amount; ++index) accumulator += options.fn({ code: index === 1 ? '' : `-${index}`, text: amount > 1 ? ` ${index}` : '' });
    return accumulator;
});

// Load layouts and static assets
const fastify = Fastify({ trustProxy: true });

await fastify.register(fastifyRateLimit);
fastify.register(pointOfView, { engine: { handlebars }, root: 'src/views/', layout: 'layouts/layout.hbs' });
fastify.register(fastifyStatic, { root: path.join(path.dirname(new URL(import.meta.url).pathname), 'public') });

// Define latest commit info
const commitSha = process.env.RAILWAY_GIT_COMMIT_SHA;
const processedCommitSha = commitSha?.slice(0, 7) ?? 'abcdefg';
const commitMessage = (process.env.RAILWAY_GIT_COMMIT_MESSAGE ?? 'Some commit message!').split('\n\n')[0];
const commitAuthor = process.env.RAILWAY_GIT_AUTHOR ?? 'Someone';

export const commitInfo = { sha: processedCommitSha, message: commitMessage, author: commitAuthor, url: commitSha ? `/commit/${commitSha}` : '' };

// Register pages
fastify.get('/', (request, reply) => reply.view('/index', { ...blankProperties, commitInfo, title: 'Home', pages: allPages, additionalStyles: [{ link: 'index.css' }] }));

fastify.get('/tone-indicators', (request, reply) => reply.send(JSON.stringify(toneIndicators, null, 2)));

setupRoutes(fastify);

// Setup error handlers
fastify.setErrorHandler((error, request, reply) => {
    if (error.statusCode === 429) return reply.status(429).send('Woah there! Stop sending so many requests!');

    consola.error(error);

    reply.status(error.statusCode ?? 500).view('/error.hbs', { ...blankProperties, commitInfo, title: 'Error', message: 'Looks like an error occurred!', status: error.statusCode ?? 500 });
});

fastify.setNotFoundHandler((request, reply) =>
    reply.status(404).view('/error.hbs', { ...blankProperties, commitInfo, title: 'Not Found', message: 'Unable to find the requested page!', status: 404 }),
);

// Start server
const port = process.env.PORT ? Number.parseInt(process.env.PORT) : 3000;

fastify.listen({ port: process.env.PORT ? Number.parseInt(process.env.PORT) : 3000, host: '0.0.0.0' }, (error) => {
    if (error) {
        if ((error as FastifyError).code === 'EADDRINUSE') consola.error(`${chalk.red('[Startup error]:')} Port ${chalk.yellow(port)} is already in use!`);
        else consola.error(error);
        process.exit(1); // eslint-disable-line unicorn/no-process-exit
    }

    consola.success(`${chalk.green('Server is now listening on port')} ${chalk.yellow(port)}${process.env.NODE_ENV === 'production' ? '' : ` (${chalk.blueBright(`http://localhost:${port}`)})`}`);
});

// Custom error/warning handlers
process.on('uncaughtException', (error) => consola.error(error));
process.on('uncaughtExceptionMonitor', (error) => consola.error(error));
process.on('unhandledRejection', (error) => consola.error(error));
process.on('warning', (warning) => consola.warn(warning));

// Connect to database
mongoose.set('strictQuery', true);
await mongoose.connect(process.env.DATABASE_URL!);
consola.success(`${chalk.green('[Database]:')} Successfully connected to the database!`);

/**
 * Logs information about an API request.
 * @param request The request object.
 */
export function logApiRequest(request: FastifyRequest) {
    consola.log(`${chalk.green('[API request]:')} ${chalk.gray(request.method)} ${chalk.yellow(request.url)}`);
}
