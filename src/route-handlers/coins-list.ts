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
    diameter: number | null | { value: number | null; startYear: number; endYear?: number }[];
    edge: string | { reeds: number } | { value: string | { reeds: number }; startYear: number; endYear?: number }[];
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

export type DatabaseCoinDenomination = CoinDenomination<CoinDesign<Coin>> & { _id?: number; __v?: number }; // eslint-disable-line @typescript-eslint/naming-convention

export const coinsModel = model('coins-data', new Schema({ name: String, id: String, value: Number, constants: Object, designs: Array }, {}));

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

        let foundCoins = (await coinsModel.find({}).lean()) as DatabaseCoinDenomination[];
        foundCoins = await patchCoinDatabase(foundCoins);

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

        let databaseCoinDenomination = (await coinsModel.findOne({ id: denominationId }).lean()) as DatabaseCoinDenomination | null;
        if (!databaseCoinDenomination) return reply.send(JSON.stringify({ error: 'Invalid coin denomination!' }, null, 2));

        databaseCoinDenomination = await patchCoinDatabaseDenomination(databaseCoinDenomination);

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

        let databaseCoinDenomination = (await coinsModel.findOne({ id: denominationId }).lean()) as CoinDenomination<CoinDesign<Coin>> | null;
        if (!databaseCoinDenomination) return reply.send(JSON.stringify({ error: 'Invalid coin denomination!' }, null, 2));

        databaseCoinDenomination = await patchCoinDatabaseDenomination(databaseCoinDenomination);

        const databaseCoinDesign = databaseCoinDenomination.designs.find((design) => design.id === designId);
        if (!databaseCoinDesign) return reply.send(JSON.stringify({ error: 'Invalid coin design!' }, null, 2));

        databaseCoinDesign.coins.push({ year: coinYear, obtained: false, id: coinId });

        await coinsModel.replaceOne({ id: denominationId }, databaseCoinDenomination);

        reply.send(JSON.stringify({ success: true }, null, 2));
    });
}

/**
 * Patches the coin database to add IDs to all coins.
 * @param coinsData The data to patch.
 * @returns The patched data.
 */
export async function patchCoinDatabase(coinsData: DatabaseCoinDenomination[]) {
    return Promise.all(coinsData.map((denomination) => patchCoinDatabaseDenomination(denomination)));
}

/**
 * Patches the coin database to add IDs to all coins.
 * @param denomination The denomination to patch.
 * @returns The patched denomination.
 */
async function patchCoinDatabaseDenomination(denomination: DatabaseCoinDenomination) {
    if (denomination.designs.every((design) => design.coins.every((coin) => coin.id))) return denomination;

    const newDenomination = { ...denomination };

    newDenomination.designs = denomination.designs.map((design) => ({
        ...design,
        coins: design.coins.map((coin) => {
            if (!coin.id) coin.id = generateUniqueCoinId(design);

            return coin;
        }),
    }));

    await coinsModel.replaceOne({ id: denomination.id }, newDenomination);

    return newDenomination;
}

/**
 * Generates a unique coin ID.
 * @param design The design to generate the ID for.
 * @returns The generated ID.
 */
function generateUniqueCoinId(design: CoinDesign<Coin>) {
    let id: string;

    do id = Math.floor(Math.random() * 9_000_000_000 + 1_000_000_000).toString();
    while (design.coins.some((coin) => coin.id === id));

    return id;
}
