import Canvas from 'canvas';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import { logApiRequest } from '../app.js';

/**
 * Sets up the cors-anywhere route.
 * @param fastify The Fastify instance.
 */
export default function setupTwemojiRoute(fastify: FastifyInstance) {
    fastify.get('/twemoji/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
        logApiRequest(request);

        const emojiId = request.params.id;
        const containsValidChars = /^[\da-f-]+$/.test(emojiId);

        if (!containsValidChars) return reply.type('image/png').send();

        const response = await fetch(`https://raw.githubusercontent.com/jdecked/twemoji/main/assets/svg/${emojiId}.svg`);
        if (!response.ok) return reply.type('image/png').send();

        const canvas = Canvas.createCanvas(500, 500);
        const image = await Canvas.loadImage(Buffer.from(await response.arrayBuffer()));
        image.height = image.width = 500;
        canvas.getContext('2d').drawImage(image, 0, 0, 500, 500);
        reply.type('image/png').send(canvas.toBuffer());
    });
}
