import { FastifyInstance, FastifyRequest } from 'fastify';

/**
 * Sets up the weather-info route.
 * @param fastify The Fastify instance.
 */
export default function (fastify: FastifyInstance) {
    fastify.get('/weather-info', async (request: FastifyRequest<{ Querystring: { latitude: string; longitude: string } }>, reply) => {
        const { latitude, longitude } = request.query;

        const data = await (await fetch(`https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${process.env.WEATHERBIT_API_KEY}&include=alerts&units=I`)).text();

        return reply.send(data);
    });
}
