import { db, users, eq, createId } from '../schema';
import { publicProcedure, router } from './trpc';
import { z } from 'zod';
import { createHTTPServer } from '@trpc/server/adapters/standalone';

const appRouter = router({
    userList: publicProcedure
        .query(async () => {
            // Retrieve users from a datasource, this is an imaginary database
            const userList = await db.select().from(users).orderBy(users.createdAt);
            return userList;
        }),
    userById: publicProcedure
        .input(z.string())
        .query(async (opts) => {
            const { input } = opts;
            const _user = await db.select().from(users).where(eq(users.id, input));
            return _user;
        }),
    createUser: publicProcedure
        .input(z.object({ fullName: z.string() }))
        .mutation(async (opts) => {
            const { input } = opts;
            const _user = await db.insert(users).values({
                id: createId(),
                fullName: input.fullName,
            }).execute()
            return _user;
        })
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
    router: appRouter,
});
server.listen(3000);