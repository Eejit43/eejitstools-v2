import { logApiRequest } from '@/app.js';
import type { FastifyInstance, FastifyRequest } from 'fastify';

/**
 * Sets up the cors-anywhere route.
 * @param fastify The Fastify instance.
 */
export default function setupCorsAnywhereRoute(fastify: FastifyInstance) {
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

        for (const [key, value] of Object.entries(request.query)) if (key !== 'url') url.searchParams.append(key, value);

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
}
