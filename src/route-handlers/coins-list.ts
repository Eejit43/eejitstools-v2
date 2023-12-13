import { FastifyInstance, FastifyRequest } from 'fastify';
import { Schema, model } from 'mongoose';

export interface CoinDenomination<CoinDesign> {
    name: string;
    id: string;
    value: number;
    constants?: Omit<CoinDesign, 'name' | 'id' | 'note' | 'years' | 'active' | 'coins'>;
    designs: CoinDesign[];
}

export interface CoinComposition {
    type: string;
    value: number;
}

export interface CoinDesign<Coin> {
    name: string;
    id: string;
    hiddenInList?: true;
    note?: string;
    years?: string;
    active?: true;
    composition: { amounts: CoinComposition[] } | { amounts: CoinComposition[]; startYear: number; endYear?: number }[];
    mass: number | null | { value: number | null; startYear: number; endYear?: number }[];
    diameter: number;
    edge: string | { reeds: number };
    numistaEntry: number | number[] | false;
    wikipediaArticle: string | string[];
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

export const coinsModel = model('coins-data', new Schema({ name: String, id: String, value: Number, constants: Object, coins: Array }, {}));

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

        const foundCoins = (await coinsModel.find({}).lean()) as (CoinDenomination<CoinDesign<Coin>> & { _id?: number; __v?: number })[]; // eslint-disable-line @typescript-eslint/naming-convention

        const sortedCoinInfo = foundCoins
            .map((denomination) => {
                delete denomination._id;
                delete denomination.__v;

                return denomination;
            })
            .sort((a, b) => a.value - b.value);

        reply.send(JSON.stringify(sortedCoinInfo, null, 2));
    });

    fastify.post('/coins-list-edit', async (request: FastifyRequest<{ Body: { denominationId: string; designId: string; coinId: string; data: Partial<Coin>; password: string } }>, reply) => {
        const { denominationId, designId, coinId, data, password } = request.body;

        if (password !== process.env.COINS_PASSWORD) return reply.send(JSON.stringify({ error: 'Invalid password!' }, null, 2));

        const databaseCoinDenomination = (await coinsModel.findOne({ id: denominationId }).lean()) as (CoinDenomination<CoinDesign<Coin>> & { _id?: number; __v?: number }) | null; // eslint-disable-line @typescript-eslint/naming-convention
        if (!databaseCoinDenomination) return reply.send(JSON.stringify({ error: 'Invalid coin denomination!' }, null, 2));

        delete databaseCoinDenomination._id;
        delete databaseCoinDenomination.__v;

        databaseCoinDenomination.designs = databaseCoinDenomination.designs.map((design) => {
            if (design.id === designId)
                return {
                    ...design,
                    coins: design.coins.map((coin) => {
                        if (coin.id === coinId)
                            for (const [key, value] of Object.entries(data))
                                if (value === null) delete coin[key as keyof Coin];
                                else coin[key as keyof Coin] = value as never;

                        return coin;
                    }),
                };

            return design;
        });

        await coinsModel.replaceOne({ id: denominationId }, databaseCoinDenomination);

        reply.send(JSON.stringify({ success: true }, null, 2));
    });

    fastify.post('/coins-list-add-coin', async (request: FastifyRequest<{ Body: { denominationId: string; designId: string; coinYear: string; coinId: string; password: string } }>, reply) => {
        const { denominationId, designId, coinYear, coinId, password } = request.body;

        if (password !== process.env.COINS_PASSWORD) return reply.send(JSON.stringify({ error: 'Invalid password!' }, null, 2));

        const databaseCoinDenomination = (await coinsModel.findOne({ id: denominationId })) as CoinDenomination<CoinDesign<Coin>> | null;
        if (!databaseCoinDenomination) return reply.send(JSON.stringify({ error: 'Invalid coin denomination!' }, null, 2));

        const databaseCoinDesign = databaseCoinDenomination.designs.find((design) => design.id === designId);
        if (!databaseCoinDesign) return reply.send(JSON.stringify({ error: 'Invalid coin design!' }, null, 2));

        databaseCoinDesign.coins.push({ year: coinYear, obtained: false, id: coinId });

        await coinsModel.replaceOne({ id: denominationId }, databaseCoinDenomination);

        reply.send(JSON.stringify({ success: true }, null, 2));
    });
}
