import { logApiRequest } from '@/app.js';
import Canvas from 'canvas';
import type { FastifyInstance, FastifyRequest } from 'fastify';

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

        const imageBuffer = Buffer.from(await response.arrayBuffer());

        let svg = imageBuffer.toString('utf8');
        if (!svg.includes('width=')) svg = svg.replace('<svg', '<svg width="500" height="500"');

        const patchedBuffer = Buffer.from(svg);

        const canvas = Canvas.createCanvas(500, 500);
        const context = canvas.getContext('2d');

        const image = await Canvas.loadImage(patchedBuffer);
        context.drawImage(image, 0, 0, 500, 500);

        reply.type('image/png').send(canvas.toBuffer());
    });
}
