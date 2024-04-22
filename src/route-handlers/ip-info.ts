import { FastifyInstance } from 'fastify';

/**
 * Sets up the ip-info route.
 * @param fastify The Fastify instance.
 */
export default function setupIpInfoRoute(fastify: FastifyInstance) {
    fastify.get('/ip-info', async (request, reply) => {
        let { ip } = request;
        if (ip === '127.0.0.1') {
            const cloudflareInformation = await (await fetch('https://www.cloudflare.com/cdn-cgi/trace')).text();
            const parsedInformation = Object.fromEntries(cloudflareInformation.split('\n').map((information) => information.split('=') as [string, string]));

            ip = parsedInformation.ip; // eslint-disable-line prefer-destructuring
        }

        const ipInformation = await (await fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_API_KEY}&ip_address=${ip}`)).text();

        reply.send(ipInformation);
    });
}
