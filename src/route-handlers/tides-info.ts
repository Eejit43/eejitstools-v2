import { FastifyInstance, FastifyRequest } from 'fastify';

/**
 * Sets up the tides-info route.
 * @param fastify The Fastify instance.
 */
export default function setupTidesInfoRoute(fastify: FastifyInstance) {
    fastify.get('/tides-info', async (request: FastifyRequest<{ Querystring: { latitude: string; longitude: string } }>, reply) => {
        const { latitude, longitude } = request.query;

        const data = await (
            await fetch(`https://tides.p.rapidapi.com/tides?longitude=${longitude}&latitude=${latitude}&interval=60&duration=10080`, {
                method: 'GET',
                headers: { 'x-rapidapi-host': 'tides.p.rapidapi.com', 'x-rapidapi-key': process.env.RAPID_API_API_KEY! },
            })
        ).text();

        return reply.send(data);
    });
}
