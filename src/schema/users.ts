import { int, mysqlEnum, text, mysqlTable, datetime, serial,timestamp, primaryKey, uniqueIndex, varchar, boolean, unique, tinyint, index } from "drizzle-orm/mysql-core";
import { sql, relations, InferModel } from "drizzle-orm";
import { organisations } from "./organisations";
import { projects, projectMemberAccess, kudos, responses} from "./projects";
import { servers, providers } from "./provider";
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod";


export const users = mysqlTable("Users", {
    id: varchar("id", { length: 255 }).primaryKey(),
    // const id = `userId_${createId()}`;
    clerkUserId: varchar("clerkUserId", { length: 255 }),
    // externalId from discord
    providerId: varchar("providerId", { length: 255 }),
    fullName: varchar("fullName", { length: 255 }),
    email: varchar("email", { length: 255 }),
    avatar: varchar("avatarUrl", { length: 255 }),
    deleted: tinyint("deleted").default(0),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
    updatedAt: timestamp("updatedAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`).notNull(),
    lastLogin: timestamp("lastLogin", { mode: 'string', fsp: 3 }),

}, (table) => {
    return {
        clerkUserIdIdx: index("User_clerkUserId_Key").on(table.clerkUserId),
        userIdIdx: index("User_userId_Key").on(table.id),
        providerIdIdx: index("User_providerId_Key").on(table.providerId),
    }
})

export type User = InferModel<typeof users, "select">
export type NewUser = InferModel<typeof users, "insert">
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users, {
    clerkUserId: z.string(),
})

export const usersRelations = relations(users, ({ one, many }) => ({
    UsersOrganisations: many(usersOrganisations),
    ProjectMemberAccess: many(projectMemberAccess),
    kudos: many(kudos),
    sessions: many(sessions),
    responses: many(responses),
    providers: many(providers)
}))

export const sessions = mysqlTable("Sessions", {
    id: varchar("id", { length: 255 }).primaryKey(),
    sessionToken: varchar("sessionToken", { length: 255 }).unique(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expiredAt: timestamp("expiredAt", { mode: 'string', fsp: 3 }),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
    endedAt: timestamp("endedAt", { mode: 'string', fsp: 3 }).notNull(),
    revokedAt: timestamp("revokedAt", { mode: 'string', fsp: 3 }).notNull(),
    removedAt: timestamp("removedAt", { mode: 'string', fsp: 3 }).notNull(),

}, (table) => {
    return {
        userIdIdx: index("Sessions_userId_Key").on(table.userId),
        sessionTokenIdx: index("Sessions_sessionToken_Key").on(table.sessionToken),
    }
})

export type Sessions = InferModel<typeof sessions, "select">
export type NewSessions = InferModel<typeof sessions, "insert">

export const insertSessionsSchema = createInsertSchema(sessions)
export const selectSessionSchema = createSelectSchema(sessions)

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    })
}))

export const usersOrganisations = mysqlTable("UsersOrganisations", {
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    providerId: varchar("providerId", { length: 255 }).notNull(),
    orgId: varchar("orgId", { length: 255 }).notNull(),
    role: mysqlEnum("role", ["basic_member", "admin", "owner"]).default("admin").notNull(),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
    updatedAt: timestamp("updatedAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`).notNull(),
    deleted: tinyint("deleted").default(0),
}, (table) => {
    return {
        usersOrgIdIdx: uniqueIndex("UsersOrganisations_usersOrgId_Key").on(table.id),
        userIdIdx: index("UsersOrganisations_userId_Key").on(table.userId),
        orgIdIdx: index("UsersOrganisations_orgId_Key").on(table.orgId),
        providerIdIdx: index("UsersOrganisations_userOrg_Key").on(table.providerId),
    }
})

export type UsersOrganisations = InferModel<typeof usersOrganisations, "select">
export type NewUsersOrganisations = InferModel<typeof usersOrganisations, "insert">

export const insertUsersOrganisationsSchema = createInsertSchema(usersOrganisations, {
    id: z.string(),
    userId: z.string(),
    providerId: z.string(),
    orgId: z.string(),
    role: z.enum(["basic_member", "admin", "owner"]).optional(),
})

export const selectUsersOrganisationsSchema = createSelectSchema(usersOrganisations, {
    userId: z.string(),
    providerId: z.string().optional(),
    orgId: z.string().optional(),
    role: z.enum(["basic_member", "admin", "owner"]).optional()
})
export const UserOrganisationsRelations = relations(usersOrganisations, ({ one }) => ({
    organisation: one(organisations, {
        fields: [usersOrganisations.orgId],
        // reference the org and user using their id, not clerk id
        references: [organisations.id]
    }),
    user: one(users, {
        fields: [usersOrganisations.userId],
        references: [users.id],
    }),
    provider: one(providers, {
        fields: [usersOrganisations.providerId],
        references: [providers.id],
    })
}))