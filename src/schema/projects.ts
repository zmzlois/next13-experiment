import { int, mysqlEnum, text, mysqlTable, datetime, serial,timestamp, uniqueIndex, varchar, boolean, tinyint, index,  unique, json } from "drizzle-orm/mysql-core";
import { sql, relations, InferModel } from "drizzle-orm";
import { organisations } from "./organisations";
import { users } from "./users";
import {Timezone, Tuple, toArrayTuple, KudoCategory} from "../../enums"
import { channels, providers } from "./provider";
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod";

const TimezoneValues = toArrayTuple(...Object.keys(Timezone)) as Tuple
export const projects = mysqlTable("Projects", {
    id: varchar("id", { length: 255}).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    cronSchedule: varchar("cronSchedule", { length: 255 }).notNull(),
    channelId: varchar("channelId", { length: 255 }).notNull(),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
    updatedAt: timestamp("updatedAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`).notNull(),
    deleted: tinyint("deleted").default(0),
    active: tinyint("active").default(1),
    creatorId: varchar("creatorId", { length: 255 }).notNull(),
    tier: mysqlEnum("tier", ["FREE", "BASIC", "PRO", "ENTERPRISE"]),
    orgId: varchar("orgId", { length: 255 }).notNull(),
    sendMemeOrNot: tinyint("sendMemeOrNot").default(1),
    greetings: text("greetings"),
    timezone: mysqlEnum("timezone", [...TimezoneValues]),
    followLocalTimezone: tinyint("followLocalTimezone").default(1),
    weekdays: json("weekdays").default({1: "Monday",2: "Tuesday",3: "Wednesday",4: "Thursday",5:"Friday"}),

}, (table) => {
    return {
        creatorIdIdx: index("Project_creatorId").on(table.creatorId),
        projectIdKeyIdx: uniqueIndex("Project_projectId").on(table.id),
        orgIdIdx: index("Project_orgId_Key").on(table.orgId)

    }
})

export type Projects = InferModel<typeof projects, "select">
export type NewProjects = InferModel<typeof projects, "insert">

export const insertProjectsSchema = createInsertSchema(projects)
export const selectProjectsSchema = createSelectSchema(projects)

export const projectRelations = relations(projects, ({ many, one }) => ({
    accesses: many(projectMemberAccess),
    organisation: one(organisations, {
        fields: [projects.orgId],
        references: [organisations.id]
    }),
    creator: one(users, {
        fields: [projects.creatorId],
        references: [users.id]
    }),
    questions: many(questions),
    channel: one(channels, {
        fields: [projects.channelId],
        references: [channels.id]
    })
}) )


export const questions = mysqlTable("Questions", {
    id: varchar("id", { length: 255 }).primaryKey(),
    questions: varchar("questions", { length: 255 }),
    projectId: varchar("projectId", { length: 255 }).notNull(),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
    updatedAt: timestamp("updatedAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`).notNull(),
    deleted: tinyint("deleted").default(0),

}, (table) => {
    return {
        projectIdIdx: index("Questions_projectId_Key").on(table.projectId),
        questionIdKeyIdx: uniqueIndex("Questions_questionId_Key").on(table.id),
    }
})

export type Questions = InferModel<typeof questions, "select">
export type NewQuestions = InferModel<typeof questions, "insert">

export const insertQuestionsSchema = createInsertSchema(questions)
export const selectQuestionsSchema = createSelectSchema(questions)

export const questionsRelations = relations(questions, ({ one, many }) => ({
    project: one(projects, {
        fields: [questions.projectId],
        references: [projects.id],
    }),
    responses: many(responses),
}))

export const responses = mysqlTable("Responses", {
    id: varchar("id", { length: 255 }).primaryKey(),
    questionId: varchar("questionId", { length: 255 }).notNull(),
    respondedUserId: varchar("userId", { length: 255 }).notNull(),
    responseIdfromChannel: varchar("externalResponseId", { length: 512 }).notNull(),
    responseText: text("responseText"),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
    updatedAt: timestamp("updatedAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`).notNull(),
    deleted: tinyint("deleted").default(0),

}, (table) => {
    return {
        questionIdIdx: index("Responses_questionId_Key").on(table.questionId),
        responseIdKeyIdx: uniqueIndex("Responses_responseId_Key").on(table.id),
        userIdKeyIdx: uniqueIndex("Responses_userId_Key").on(table.respondedUserId),
    }
})

export type Responses = InferModel<typeof responses, "select">
export type NewResponses = InferModel<typeof responses, "insert">

export const insertResponsesSchema = createInsertSchema(responses)
export const selectResponsesSchema = createSelectSchema(responses)

export const responsesRelations = relations(responses, ({ one, many }) => ({
    question: one(questions, {
        fields: [responses.questionId],
        references: [questions.id],
    }),
    user: one(users, {
        fields: [responses.respondedUserId],
        references: [users.id],
    }),
    kudos: many(kudos)
}))
export const projectMemberAccess = mysqlTable("ProjectMemberAccess", {
    id: varchar("id", { length: 255 }).primaryKey(),
    projectId: varchar("projectId", { length: 255 }).notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
    ability : mysqlEnum("ability", ["PAUSED", "DELETED", "READ", "WRITE", "ADMIN"]),
    xp: int("xp"),
    // @sanjib-sen: can you help me check if this is the timezone value you would like?
    timezone: mysqlEnum("timezone", [...TimezoneValues]),
    timezoneOffset: int("timezoneOffset"),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
    updatedAt: timestamp("updatedAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`).notNull(),
}, (table) => {
    return {
        projectIdIdx: index("ProjectMemberAccess_projectId_Key").on(table.projectId),
        providerIdIdx: index("ProjectMemberAccess_providerId_Key").on(table.userId),
        memberAccessIdKeyIdx: uniqueIndex("ProjectMemberAccess_memberAccessId_Key").on(table.id),
    }
})

export type ProjectMemberAccess = InferModel<typeof projectMemberAccess, "select">
export type NewProjectMemberAccess = InferModel<typeof projectMemberAccess, "insert">

export const insertProjectMemberAccessSchema = createInsertSchema(projectMemberAccess)
export const selectProjectMemberAccessSchema = createSelectSchema(projectMemberAccess)

export const projectMemberAccessRelations = relations(projectMemberAccess, ({ one }) => ({
    project: one(projects, {
        fields: [projectMemberAccess.projectId],
        references: [projects.id],
    }
),
    user: one(users, {
        fields: [projectMemberAccess.userId],
        references: [users.id]
    })
    }
))

const KudoValues = toArrayTuple(...Object.keys(KudoCategory)) as Tuple
export const kudos = mysqlTable("Kudos", {
    id: varchar("id", { length: 255 }).primaryKey(),
    category: mysqlEnum("category", [...KudoValues]),
    description: text("description"),
    points: int("points"),
    responseId: varchar("responseId", { length: 255 }),
    giverId: varchar("userId", { length: 255 }),
    multiplier: int("multiplier"),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
    updatedAt: timestamp("updatedAt", { mode: 'string', fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`).notNull(),
    deleted: tinyint("deleted").default(0),

}, (table) => {
    return {
        giverIdKeyIdx: uniqueIndex("Kudos_providerId_Key").on(table.giverId),
        responseIdIdx: index("Kudos_responseId_Key").on(table.responseId),
        kudoIdIdx: uniqueIndex("Kudos_kudoId_Key").on(table.id),
    }
})

export type Kudos = InferModel<typeof kudos, "select">
export type NewKudos = InferModel<typeof kudos, "insert">

export const insertKudosSchema = createInsertSchema(kudos)
export const selectKudosSchema = createSelectSchema(kudos)

export const kudosRelations = relations(kudos, ({ one, many }) => ({
    response: one(responses, {
        fields: [kudos.responseId],
        references: [responses.id],
    }),
    giver: one(users, {
        fields: [kudos.giverId],
        references: [users.id],
    })
}))
