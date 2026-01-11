import setupAllPageRoutes from '@route-handlers/all-pages.js';
import setupApodRoute from '@route-handlers/astronomy-picture.js';
import setupCalendarRoutes from '@route-handlers/calendar.js';
import setupCoinsInfoRoute from '@route-handlers/coins-info.js';
import setupCoinsListRoutes from '@route-handlers/coins-list.js';
import setupCorsAnywhereRoute from '@route-handlers/cors-anywhere.js';
import setupForeignCollectionsList from '@route-handlers/foreign-collections-list.js';
import setupIpInfoRoute from '@route-handlers/ip-info.js';
import setupTidesInfoRoute from '@route-handlers/tides-info.js';
import setupTwemojiRoute from '@route-handlers/twemoji.js';
import setupWeatherInfoRoute from '@route-handlers/weather-info.js';
import type { FastifyInstance } from 'fastify';

/**
 * Sets up all routes that have individual handlers.
 * @param fastify The Fastify instance.
 */
export default function setupRoutes(fastify: FastifyInstance) {
    setupAllPageRoutes(fastify);
    setupApodRoute(fastify);
    setupCalendarRoutes(fastify);
    setupCoinsInfoRoute(fastify);
    setupCoinsListRoutes(fastify);
    setupCorsAnywhereRoute(fastify);
    setupForeignCollectionsList(fastify);
    setupIpInfoRoute(fastify);
    setupTidesInfoRoute(fastify);
    setupTwemojiRoute(fastify);
    setupWeatherInfoRoute(fastify);
}
