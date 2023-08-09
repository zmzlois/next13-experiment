import { int, mysqlEnum, text, mysqlTable, datetime, serial,timestamp, uniqueIndex, varchar, boolean, tinyint, index, unique } from "drizzle-orm/mysql-core";
import { sql, relations, InferModel } from "drizzle-orm";
import { KudoCategory, Tuple, toArrayTuple } from "../../enums"
import {projectMemberAccess, responses, projects} from "./projects"
import { users, usersOrganisations } from "./users"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

import { z } from "zod";


export const providers = mysqlTable("ProviderAccounts", {
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: varchar("userId", { length: 255 }),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerId: varchar("providerId", { length: 255 }).notNull(),
    deleted: tinyint("deleted").default(0),
    email: varchar("email", { length: 255 }),
    username: varchar("userName", { length: 255 }),
    firstName: varchar("firstName", { length: 255 }),
    lastName: varchar("lastName", { length: 255 }),
    discriminator: varchar("discriminator", { length: 255 }),
    globalName: varchar("globalName", { length: 255 }),
    avatar: varchar("avatarUrl", { length: 255 }),
    bot: tinyint("bot"),
    system: tinyint("system"),
    mfaEnabled: tinyint("mfaEnabled"),
    banner: varchar("banner", { length: 255 }),
    accentColor: int("accentColor"),
    locale: varchar("locale", { length: 255 }), // timezone, @sanjib-sens should this be noNull()?
    verified: tinyint("verified"),
    flags: int("flags"),
    premiumType: int("premiumType"),
    publicFlags: int("publicFlags"),
    refreshToken: varchar("refreshToken", { length: 255 }),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
    updatedAt: timestamp("updatedAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`).notNull(),

}, (table) => {
    return {
        providerIdKeyIdx: uniqueIndex("ProviderAccounts_providerId_Key").on(table.providerId),
        userIdIdx: uniqueIndex("ProviderAccounts_userId_Key").on(table.id),
    }
})

export type Providers = InferModel<typeof providers, "select">
export type NewProviders = InferModel<typeof providers, "insert">

export const insertProvidersSchema = createInsertSchema(providers)
export const selectProvidersSchema = createSelectSchema(providers)

export const providersRelations = relations(providers, ({ one, many }) => ({
        user: one(users, {
            fields: [providers.userId],
            references: [users.id]
        }),
        usersOrganisations: many(usersOrganisations),
        projectMemberAccess: many(projectMemberAccess),
        servers: many(providersServers),
    })
)
export const servers = mysqlTable("Servers", {
    id: varchar("id", { length: 255 }).primaryKey(),
    externalId: varchar("externalId", { length: 255 }),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
    updatedAt: timestamp("updatedAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`).notNull(),
    icon: varchar("icon", { length: 255 }),
    description: text("description"),
    inviteTime: timestamp("inviteTime"),
    kickedTime: timestamp("kickedTime"),
    vanityUrl: varchar("vanityUrl", { length: 255 }),
}, (table) => {
    return {
        externalIdKeyIdx: uniqueIndex("Servers_providerServerId_Key").on(table.externalId),
        serverIdIdx: uniqueIndex("Servers_serverId_Key").on(table.id),
    }
})

export type Servers = InferModel<typeof servers, "select">
export type NewServers = InferModel<typeof servers, "insert">

export const insertServersSchema = createInsertSchema(servers)
export const selectServersSchema = createSelectSchema(servers)

export const serversRelations = relations(servers, ({ one, many }) => ({
    providerAccount: many(providersServers),
    channels: many(channels),
    })
)

export const providersServers = mysqlTable("ProviderServers", {
    id: varchar("id", { length: 255 }).primaryKey(),
    providerId: varchar("providerId", { length: 255 }),
    serverId: varchar("serverId", { length: 255 }),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
}, (table) => {
    return {
        providerIdKeyIdx: index("ProviderServers_providerId_Key").on(table.providerId),
        serverIdIdx: index("ProviderServers_serverId_Key").on(table.serverId),
    }
})

export type ProvidersServers = InferModel<typeof providersServers, "select">
export type NewProvidersServers = InferModel<typeof providersServers, "insert">

export const insertProvidersServersSchema = createInsertSchema(providersServers)
export const selectProvidersServersSchema = createSelectSchema(providersServers)

export const providersServersRelations = relations(providersServers, ({ one }) => ({
    providerAccount: one(providers, {
        fields: [providersServers.providerId],
        references: [providers.id]
    }),
    server: one(servers, {
        fields: [providersServers.serverId],
        references: [servers.id]
    })
}))

export const channels = mysqlTable("Channels", {
    id: varchar("id", { length: 255 }).primaryKey(),
    externalId: varchar("externalId", { length: 255 }),
    serverId: varchar("serverId", { length: 255 }),
    channelLink: varchar("channelLink", { length: 255 }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
    updatedAt: timestamp("updatedAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`).notNull(),
    deleted: tinyint("deleted").default(0),
    projectId: varchar("projectId", { length: 255 }),

}, (table) => {
    return {
        externalIdKeyIdx: uniqueIndex("Channels_channelId_Key").on(table.externalId),
        serverIdKeyIdx: index("Channels_serverId_Key").on(table.serverId),
    }
})

export type Channels = InferModel<typeof channels, "select">
export type NewChannels = InferModel<typeof channels, "insert">

export const insertChannelsSchema = createInsertSchema(channels)
export const selectChannelsSchema = createSelectSchema(channels)

export const channelsRelations = relations(channels, ({ one, many }) => ({
    server: one(servers, {
        fields: [channels.serverId],
        references: [servers.id]
    }),
    project: one(projects, {
        fields: [channels.projectId],
        references: [projects.id]
    })
}))

