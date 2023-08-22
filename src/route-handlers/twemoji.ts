import Canvas from 'canvas';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { logApiRequest } from '../app.js';

/**
 * Sets up the cors-anywhere route.
 * @param fastify The Fastify instance.
 */
export default function (fastify: FastifyInstance) {
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
}
