import { FastifyInstance, FastifyRequest } from 'fastify';
import { Schema, model } from 'mongoose';

export interface CoinType<CoinVariant> {
    name: string;
    id: string;
    value: number;
    coins: CoinVariant[];
}

export interface CoinComposition {
    type: string;
    value: number;
}

export interface CoinVariant<Coin> {
    name: string;
    id: string;
    note?: string;
    years?: string;
    active?: true;
    composition: { amounts: CoinComposition[] } | { amounts: CoinComposition[]; startDate: number; endDate: number }[];
    mass: number | { value: number; startDate: number; endDate: number }[];
    diameter: number;
    thickness: number;
    numistaEntry: number | number[];
    wikipediaArticle: string;
    coins: Coin[];
}

export interface Coin {
    id: string;
    year: string;
    mintMark?: string;
    mintage?: number;
    mintageForAllVarieties?: boolean;
    specification?: string;
    image?: string;
    comparison?: string;
    obtained: boolean;
    upgrade?: boolean;
}

export const coinsModel = model('coins-data', new Schema({ name: String, id: String, coins: Array }));

/**
 * Sets up all coin related routes.
 * @param fastify The Fastify instance.
 */
export default function (fastify: FastifyInstance) {
    fastify.get('/coins-login', (request: FastifyRequest<{ Querystring: { password: string } }>, reply) =>
        reply.send(JSON.stringify({ success: request.query.password === process.env.COINS_PASSWORD }, null, 2)),
    );

    fastify.get('/coins-list', async (request: FastifyRequest<{ Querystring: { password: string } }>, reply) => {
        if (request.query.password !== process.env.COINS_PASSWORD) return reply.send(JSON.stringify({ error: 'Invalid password!' }, null, 2));

        const foundCoins = (await coinsModel.find({}).lean()) as (CoinType<CoinVariant<Coin>> & { _id?: number; __v?: number })[]; // eslint-disable-line @typescript-eslint/naming-convention

        const sortedCoinInfo = foundCoins
            .map((type) => {
                delete type._id;
                delete type.__v;

                return type;
            })
            .sort((a, b) => a.value - b.value);

        reply.send(JSON.stringify(sortedCoinInfo, null, 2));
    });

    fastify.post('/coins-list-edit', async (request: FastifyRequest<{ Body: { coinTypeId: string; coinVariantId: string; coinId: string; data: Partial<Coin>; password: string } }>, reply) => {
        const { coinTypeId, coinVariantId, coinId, data, password } = request.body;

        if (password !== process.env.COINS_PASSWORD) return reply.send(JSON.stringify({ error: 'Invalid password!' }, null, 2));

        const databaseCoinType = (await coinsModel.findOne({ id: coinTypeId })) as CoinType<CoinVariant<Coin>> | null;
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

        await coinsModel.replaceOne({ id: coinTypeId }, { name: databaseCoinType.name, id: databaseCoinType.id, coins: databaseCoinType.coins });

        reply.send(JSON.stringify({ success: true }, null, 2));
    });

    fastify.post('/coins-list-add-coin', async (request: FastifyRequest<{ Body: { coinTypeId: string; coinVariantId: string; coinYear: string; coinId: string; password: string } }>, reply) => {
        const { coinTypeId, coinVariantId, coinYear, coinId, password } = request.body;

        if (password !== process.env.COINS_PASSWORD) return reply.send(JSON.stringify({ error: 'Invalid password!' }, null, 2));

        const databaseCoinType = (await coinsModel.findOne({ id: coinTypeId })) as CoinType<CoinVariant<Coin>> | null;
        if (!databaseCoinType) return reply.send(JSON.stringify({ error: 'Invalid coin type!' }, null, 2));

        const databaseCoinVariant = databaseCoinType.coins.find((variant) => variant.id === coinVariantId);
        if (!databaseCoinVariant) return reply.send(JSON.stringify({ error: 'Invalid coin variant!' }, null, 2));

        databaseCoinVariant.coins.push({ year: coinYear, obtained: false, id: coinId });

        await coinsModel.replaceOne({ id: coinTypeId }, databaseCoinType);

        reply.send(JSON.stringify({ success: true }, null, 2));
    });
}
