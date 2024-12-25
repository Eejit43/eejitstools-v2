import type { FastifyInstance, FastifyRequest } from 'fastify';
import { Schema, model } from 'mongoose';

export interface CalendarEvents {
    holidays: { name: string; date: string }[];
    moonPhases: { phase: string; date: string; time: string }[];
}

interface Calendar {
    items: {
        summary: string;
        start: { date: string };
    }[];
}

/**
 * Sets up all calendar related routes.
 * @param fastify The Fastify instance.
 */
export default function setupCalendarRoutes(fastify: FastifyInstance) {
    let calendarEventsCache: string | null = null;

    fastify.get('/calendar-events', async (request, reply) => {
        if (calendarEventsCache) return reply.send(calendarEventsCache);

        const holidays = (
            (await (
                await fetch(
                    `https://www.googleapis.com/calendar/v3/calendars/en.usa%23holiday%40group.v.calendar.google.com/events?key=${process.env.GOOGLE_CALENDAR_API_KEY!}`,
                )
            ).json()) as Calendar
        ).items
            .map((holiday) => ({ name: holiday.summary, date: holiday.start.date }))
            .filter((holiday) => !holiday.name.includes(' (substitute)'))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const moonPhases = (
            (await (
                await fetch(
                    `https://www.googleapis.com/calendar/v3/calendars/ht3jlfaac5lfd6263ulfh4tql8%40group.calendar.google.com/events?key=${process.env.GOOGLE_CALENDAR_API_KEY!}`,
                )
            ).json()) as Calendar
        ).items
            .map((moonPhase) => ({
                phase: /([\w ]+) \d/.exec(moonPhase.summary)![1],
                date: moonPhase.start.date,
                time: /[\w ]+ ([\w:]+)/.exec(moonPhase.summary)![1].replace(/(\d)([ap]m)/, '$1 $2'),
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const result: CalendarEvents = { holidays, moonPhases };

        calendarEventsCache = JSON.stringify(result, null, 2);
        reply.send(calendarEventsCache);
    });

    interface TodoData {
        year: string;
        dates: Record<string, Record<string, Record<string, boolean>>>;
    }

    interface TodoOption {
        title: string;
        id: string;
        frequency: string;
    }

    const todoModel = model('todo', new Schema({ year: String, dates: Object }));
    const todoOptionsModel = model('todo-options', new Schema({ data: Array }));
    let todoOptions: TodoOption[] | null = null;

    fastify.get('/calendar-todo', async (request: FastifyRequest<{ Querystring: { password: string } }>, reply) => {
        if (request.query.password !== process.env.CALENDAR_TODO_PASSWORD)
            return reply.send(JSON.stringify({ error: 'Invalid password!' }, null, 2));
        const data = Object.fromEntries(((await todoModel.find({})) as TodoData[]).map((todo) => [todo.year, todo.dates])); // eslint-disable-line @typescript-eslint/no-unnecessary-type-assertion

        if (!todoOptions) todoOptions = (await todoOptionsModel.findOne({}))!.data;

        reply.send(JSON.stringify({ todo: todoOptions, data }, null, 2));
    });

    fastify.post(
        '/calendar-todo-edit',
        async (
            request: FastifyRequest<{
                Body: { password: string; todo: Record<string, boolean>; year: string; month: string; date: string };
            }>,
            reply,
        ) => {
            const { password, todo } = request.body;
            const year = Number.parseInt(request.body.year);
            const month = Number.parseInt(request.body.month);
            const date = Number.parseInt(request.body.date);

            if (password !== process.env.CALENDAR_TODO_PASSWORD) return reply.send(JSON.stringify({ error: 'Invalid password!' }, null, 2));

            if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(date))
                return reply.send(JSON.stringify({ error: 'A date parameter is NaN!' }, null, 2));
            if (month < 1 || month > 12) return reply.send(JSON.stringify({ error: 'Invalid month parameter!' }, null, 2));
            if (date < 1 || date > 31) return reply.send(JSON.stringify({ error: 'Invalid date parameter!' }, null, 2));

            let yearEntry: TodoData | null = await todoModel.findOne({ year });
            if (!yearEntry) {
                await todoModel.create({ year, dates: {} });
                yearEntry = (await todoModel.findOne({ year }))!;
            }

            if (!('month' in yearEntry.dates)) yearEntry.dates[month] = {};
            yearEntry.dates[month][date] = todo;

            await todoModel.replaceOne({ year }, yearEntry);

            const data = Object.fromEntries(((await todoModel.find({})) as TodoData[]).map((todo) => [todo.year, todo.dates])); // eslint-disable-line @typescript-eslint/no-unnecessary-type-assertion

            if (!todoOptions) todoOptions = (await todoOptionsModel.findOne({}))!.data;

            reply.send(JSON.stringify({ todo: todoOptions, data }, null, 2));
        },
    );
}
