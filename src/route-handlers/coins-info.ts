import type { FastifyInstance } from 'fastify';
import { type Coin, type DatabaseCoinDenomination, coinsModel, patchCoinDatabase } from './coins-list.js';

export type FilteredCoin = Omit<Coin, 'obtained' | 'upgrade'>;

/**
 * Sets up all coin related routes.
 * @param fastify The Fastify instance.
 */
export default function setupCoinsInfoRoute(fastify: FastifyInstance) {
    fastify.get('/coins-info', async (request, reply) => {
        let foundCoins = (await coinsModel.find({}).lean()) as DatabaseCoinDenomination[];
        foundCoins = await patchCoinDatabase(foundCoins);

        const filteredCoinInfo = foundCoins
            .map((denomination) => {
                delete denomination._id;
                delete denomination.__v;

                return {
                    ...denomination,
                    designs: denomination.designs.map((design) => {
                        delete design.note;

                        return {
                            ...design,
                            coins: design.coins.map((coin) => {
                                // @ts-expect-error While this is marked as required, it doesn't need to be given to the end user
                                delete coin.id;
                                // @ts-expect-error While this is marked as required, it shouldn't be given to the end user
                                delete coin.obtained;
                                delete coin.upgrade;
                                delete coin.hidden;

                                return coin;
                            }),
                        };
                    }),
                };
            })
            .toSorted((a, b) => a.value - b.value);

        reply.send(JSON.stringify(filteredCoinInfo, null, 2));
    });
}
