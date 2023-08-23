import { FastifyInstance } from 'fastify';
import { Schema, model } from 'mongoose';
import { Coin, ParsedCoinType, coinsData } from '../public/data/coins-data.js';

/**
 * Sets up all coin related routes.
 * @param fastify The Fastify instance.
 */
export default function (fastify: FastifyInstance) {
    const coinsModel = model('coins-data', new Schema({ name: String, id: String, coins: Array }));

    fastify.get('/coins-login', (request, reply) => reply.send(JSON.stringify({ success: (request.query as { password: string }).password === process.env.COINS_PASSWORD }, null, 2)));

    fastify.get('/coins-list', async (request, reply) => {
        if ((request.query as { password: string }).password !== process.env.COINS_PASSWORD) return reply.send(JSON.stringify({ error: 'Invalid password!' }, null, 2));

        const mergedCoinsData = await Promise.all(
            coinsData.map(async (coinType) => {
                let coinsDatabaseEntry = (await coinsModel.findOne({ id: coinType.id })) as ParsedCoinType | null;
                if (!coinsDatabaseEntry)
                    coinsDatabaseEntry = coinsModel.create({
                        name: coinType.name,
                        id: coinType.id,
                        coins: coinType.coins?.map((variant) => ({
                            ...variant,
                            coins: variant.coins?.map((coin) => ({ ...coin, id: Math.floor(Math.random() * 9_000_000_000 + 1_000_000_000) })),
                        })),
                    }) as unknown as ParsedCoinType;

                return { name: coinsDatabaseEntry.name, id: coinsDatabaseEntry.id, coins: coinsDatabaseEntry.coins };
            }),
        );

        reply.send(JSON.stringify(mergedCoinsData, null, 2));
    });

    fastify.post('/coins-list-edit', async (request, reply) => {
        const { coinTypeId, coinVariantId, coinId, data, password } = request.body as { coinTypeId: string; coinVariantId: string; coinId: string; data: Partial<Coin>; password: string };

        if (password !== process.env.COINS_PASSWORD) return reply.send(JSON.stringify({ error: 'Invalid password!' }, null, 2));

        const databaseCoinType = (await coinsModel.findOne({ id: coinTypeId })) as ParsedCoinType | null;
        if (!databaseCoinType) return reply.send(JSON.stringify({ error: 'Invalid coin type!' }, null, 2));

        databaseCoinType.coins = databaseCoinType.coins.map((coinVariant) => {
            if (coinVariant.id === coinVariantId)
                return {
                    ...coinVariant,
                    coins: coinVariant.coins.map((coin) => {
                        if (coin.id === coinId)
                            for (const [key, value] of Object.entries(data))
                                if (value === null) delete coin[key as keyof Coin];
                                else coin[key as keyof Coin] = value as never;

                        return coin;
                    }),
                };

            return coinVariant;
        });

        await coinsModel.replaceOne({ id: coinTypeId }, databaseCoinType);

        reply.send(JSON.stringify({ success: true }, null, 2));
    });

    fastify.post('/coins-list-add-coin', async (request, reply) => {
        const { coinTypeId, coinVariantId, coinYear, coinId, password } = request.body as { coinTypeId: string; coinVariantId: string; coinYear: string; coinId: string; password: string };

        if (password !== process.env.COINS_PASSWORD) return reply.send(JSON.stringify({ error: 'Invalid password!' }, null, 2));

        const databaseCoinType = (await coinsModel.findOne({ id: coinTypeId })) as ParsedCoinType | null;
        if (!databaseCoinType) return reply.send(JSON.stringify({ error: 'Invalid coin type!' }, null, 2));

        const databaseCoinVariant = databaseCoinType.coins.find((variant) => variant.id === coinVariantId);
        if (!databaseCoinVariant) return reply.send(JSON.stringify({ error: 'Invalid coin variant!' }, null, 2));

        databaseCoinVariant.coins.push({ year: coinYear, obtained: false, id: coinId });

        await coinsModel.replaceOne({ id: coinTypeId }, databaseCoinType);

        reply.send(JSON.stringify({ success: true }, null, 2));
    });
}
