import { FastifyInstance } from 'fastify';
import { Coin, CoinDenomination, CoinDesign, coinsModel } from './coins-list.js';

export type FilteredCoin = Omit<Coin, 'obtained' | 'upgrade'>;

/**
 * Sets up all coin related routes.
 * @param fastify The Fastify instance.
 */
export default function (fastify: FastifyInstance) {
    fastify.get('/coins-info', async (request, reply) => {
        const foundCoins = (await coinsModel.find({}).lean()) as (CoinDenomination<CoinDesign<Coin>> & { _id?: number; __v?: number })[]; // eslint-disable-line @typescript-eslint/naming-convention

        const filteredCoinInfo = foundCoins
            .map((denomination) => {
                delete denomination._id;
                delete denomination.__v;

                return {
                    ...denomination,
                    coins: denomination.designs.map((design) => ({
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
