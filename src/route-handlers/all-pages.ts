import chalk from 'chalk';
import consola from 'consola';
import { FastifyInstance } from 'fastify';
import fs from 'node:fs';
import { commitInfo } from '../app.js';
import { allPages } from '../public/data/pages.js';

/**
 * Sets up the cors-anywhere route.
 * @param fastify The Fastify instance.
 */
export default function (fastify: FastifyInstance) {
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
}
