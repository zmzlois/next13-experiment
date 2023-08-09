import { int, mysqlEnum, text, mysqlTable, datetime, serial,timestamp, uniqueIndex, varchar, boolean, tinyint, index, unique } from "drizzle-orm/mysql-core";
import { sql, relations, InferModel } from "drizzle-orm";
import { organisations } from "./organisations";
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod";

export const subscriptions = mysqlTable("Subscriptions", {
    id: varchar("id", { length: 255 }).primaryKey(),
    stripeId: varchar("stripeId", { length: 255 }).notNull(),
    subscriptionId: varchar("subscriptionId", { length: 255 }).notNull(),
    subscribedAt: timestamp("subscribedAt").notNull(),
    paidUntil: timestamp("paidUntil").notNull(),
    expireAt: timestamp("expireAt").notNull(),
    plan: mysqlEnum("plan", ["FREE", "BASIC", "PRO", "ENTERPRISE"]).notNull(),
}, (table) => {
    return {
        stripeIdKeyIdx: index("Subscription_stripeId_Key").on(table.stripeId),
        subscriptionIdKeyIdx: index("Subscription_subscriptionId_Key").on(table.subscriptionId),
    }
})

export type Subscriptions = InferModel<typeof subscriptions, "select">
export type NewSubscription = InferModel<typeof subscriptions, "insert">

export const insertSubscriptionsSchema = createInsertSchema(subscriptions)
export const selectSubscriptionsSchema = createSelectSchema(subscriptions)

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
    organisation: many(orgSubscriptions),
}))

export const orgSubscriptions = mysqlTable("OrgSubscriptions", {
    id: varchar("id", { length: 255 }).primaryKey(),
    orgId: varchar("orgId", { length: 255 }),
    subscriptionId: varchar("subscriptionId", { length: 255 }).notNull(),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
    updatedAt: timestamp("updatedAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`).notNull(),
}, (table) => {
    return {
        orgIdKeyIdx: index("OrgSubscriptions_orgId_Key").on(table.orgId),
        subscriptionIdKeyIdx: index("OrgSubscriptions_subscriptionId_Key").on(table.subscriptionId),
    }
})



export type OrgSubscriptions = InferModel<typeof orgSubscriptions, "select">
export type NewOrgSubscriptions = InferModel<typeof orgSubscriptions, "insert">

export const insertOrgSubscriptionsSchema = createInsertSchema(orgSubscriptions)
export const selectOrgSubscriptionsSchema = createSelectSchema(orgSubscriptions)

export const orgSubscriptionsRelations = relations(orgSubscriptions, ({ one, many }) => ({
    subscription: one(subscriptions, {
        fields: [orgSubscriptions.subscriptionId],
        references: [subscriptions.id]
    }),
    organisation: one(organisations, {
        fields: [orgSubscriptions.orgId],
        references: [organisations.id]
    })
}))