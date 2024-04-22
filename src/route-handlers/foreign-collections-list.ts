import { FastifyInstance, FastifyRequest } from 'fastify';
import { Schema, model } from 'mongoose';

interface ForeignCollectionEntry {
    id: string;
    name: string;
    type: string;
    data: { coins: boolean | null; banknotes: boolean | null; stamps: boolean | null };
}

export type ForeignCollectionsList = ForeignCollectionEntry[];

type DatabaseForeignCollectionsList = { data: ForeignCollectionsList } & { _id?: number; __v?: number }; // eslint-disable-line @typescript-eslint/naming-convention

const foreignCollectionsList = model('foreign-collections-list', new Schema({ data: Array }, {}));

/**
 * Sets up all foreign collection related routes.
 * @param fastify The Fastify instance.
 */
export default function setupForeignCollectionsList(fastify: FastifyInstance) {
    fastify.get('/foreign-collections-list', async (request: FastifyRequest<{ Querystring: { password: string } }>, reply) => {
        if (request.query.password !== process.env.COINS_PASSWORD) return reply.send(JSON.stringify({ error: 'Invalid password!' }, null, 2));

        const foundList = (await foreignCollectionsList.findOne({}).lean()) as DatabaseForeignCollectionsList;

        reply.send(JSON.stringify(foundList.data, null, 2));
    });

    fastify.post('/foreign-collections-list-edit', async (request: FastifyRequest<{ Body: ForeignCollectionEntry & { password: string } }>, reply) => {
        const { name, type, data, password } = request.body;

        if (password !== process.env.COINS_PASSWORD) return reply.send(JSON.stringify({ error: 'Invalid password!' }, null, 2));

        const foundList = (await foreignCollectionsList.findOne({}).lean()) as DatabaseForeignCollectionsList;

        delete foundList._id;
        delete foundList.__v;

        const foundEntry = foundList.data.find((entry) => entry.id === request.body.id);
        if (!foundEntry) return reply.send(JSON.stringify({ error: 'Entry not found!' }, null, 2));

        foundEntry.name = name;
        foundEntry.type = type;
        foundEntry.data = data;

        const sortedData = foundList.data.sort((a, b) => a.name.localeCompare(b.name));

        await foreignCollectionsList.replaceOne({}, { data: sortedData });

        reply.send(JSON.stringify({ success: true, data: sortedData }, null, 2));
    });

    fastify.post('/foreign-collections-list-add-entry', async (request: FastifyRequest<{ Body: ForeignCollectionEntry & { password: string } }>, reply) => {
        const { name, type, data, password } = request.body;

        if (password !== process.env.COINS_PASSWORD) return reply.send(JSON.stringify({ error: 'Invalid password!' }, null, 2));

        const foundList = (await foreignCollectionsList.findOne({}).lean()) as DatabaseForeignCollectionsList;

        delete foundList._id;
        delete foundList.__v;

        const id = generateUniqueEntryId(foundList.data);

        foundList.data.push({ id, name, type, data });

        const sortedData = foundList.data.sort((a, b) => a.name.localeCompare(b.name));

        await foreignCollectionsList.replaceOne({}, { data: sortedData });

        reply.send(JSON.stringify({ success: true, data: sortedData }, null, 2));
    });
}

/**
 * Generates a unique entry ID.
 * @param list The collections list to check ids against.
 */
function generateUniqueEntryId(list: ForeignCollectionsList) {
    let id: string;

    do id = Math.floor(Math.random() * 9_000_000_000 + 1_000_000_000).toString();
    while (list.some((entry) => entry.id === id));

    return id;
}
