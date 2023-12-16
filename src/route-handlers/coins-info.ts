import { FastifyInstance } from 'fastify';
import { Coin, DatabaseCoinDenomination, coinsModel, patchCoinDatabase } from './coins-list.js';

export type FilteredCoin = Omit<Coin, 'obtained' | 'upgrade'>;

/**
 * Sets up all coin related routes.
 * @param fastify The Fastify instance.
 */
export default function (fastify: FastifyInstance) {
    fastify.get('/coins-info', async (request, reply) => {
        let foundCoins = (await coinsModel.find({}).lean()) as DatabaseCoinDenomination[];
        foundCoins = await patchCoinDatabase(foundCoins);

        const filteredCoinInfo = foundCoins
            .map((denomination) => {
                delete denomination._id;
                delete denomination.__v;

                return {
                    ...denomination,
                    designs: denomination.designs.map((design) => ({
                        ...design,
                        coins: design.coins?.map((coin) => {
                            // @ts-expect-error While this is marked as required, it doesn't need to be given to the end user
                            delete coin.id;
                            // @ts-expect-error While these is marked as required, they shouldn't be given to the end user
                            delete coin.obtained;
                            delete coin.upgrade;

                            return coin;
                        }),
                    })),
                };
            })
            .sort((a, b) => a.value - b.value);

        reply.send(JSON.stringify(filteredCoinInfo, null, 2));
    });
}
