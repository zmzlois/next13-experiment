import { mysqlTable, varchar, datetime, text, tinyint, timestamp, uniqueIndex } from "drizzle-orm/mysql-core";
import { sql, relations, InferModel } from "drizzle-orm";
import { usersOrganisations } from "./users";
import { projects } from "./projects";
import { orgSubscriptions, subscriptions } from "./payments";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";

export const organisations = mysqlTable("Organisations", {
    id: varchar("id", { length: 255 }).primaryKey(),
    // const id = `orgId_${createId()}`;
    clerkOrgId: varchar("clerkOrgId", { length: 255 }),
    // const id = clerkOrgId ?? clerkUserId;
    isPersonal: tinyint("isPersonal"),
    avatar: varchar("avatarUrl", { length: 255 }),
    name: varchar("name", { length: 255 }),
    description: text("description"),
    deleted: tinyint("deleted").default(0),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
    updatedAt: timestamp("updatedAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`).notNull(),
}, (table) => {
    return {
        clerkOrgIdIdx: uniqueIndex("Organisation_clerkOrgId_Key").on(table.clerkOrgId),
    }
})

export type Organisations = InferModel<typeof organisations, "select">
export type NewOrganisations = InferModel<typeof organisations, "insert">

export const insertOrganisationsSchema = createInsertSchema(organisations)
export const selectOrganisationsSchema = createSelectSchema(organisations)


export const organisationsRelations = relations(organisations, ({ many }) => ({
    UsersOrganisations: many(usersOrganisations),
    projects: many(projects),
    subscriptions: many(orgSubscriptions),
}))

