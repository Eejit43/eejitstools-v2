import { FastifyInstance } from 'fastify';
import setupAllPageRoutes from './all-pages.js';
import setupApodRoute from './astronomy-picture.js';
import setupCalendarRoutes from './calendar.js';
import setupCoinsListRoutes from './coins-list.js';
import setupCorsAnywhereRoute from './cors-anywhere.js';
import setupIpInfoRoute from './ip-info.js';
import setupTidesInfoRoute from './tides-info.js';
import setupTwemojiRoute from './twemoji.js';
import setupWeatherInfoRoute from './weather-info.js';

/**
 * Sets up all routes that have individual handlers.
 * @param fastify The Fastify instance.
 */
export default function setupRoutes(fastify: FastifyInstance) {
    setupAllPageRoutes(fastify);
    setupApodRoute(fastify);
    setupCalendarRoutes(fastify);
    setupCoinsListRoutes(fastify);
    setupCorsAnywhereRoute(fastify);
    setupIpInfoRoute(fastify);
    setupTidesInfoRoute(fastify);
    setupTwemojiRoute(fastify);
    setupWeatherInfoRoute(fastify);
}
