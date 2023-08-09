import { drizzle, PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";
import { users, usersRelations, insertUserSchema, selectUserSchema, insertSessionsSchema, selectSessionSchema, insertUsersOrganisationsSchema, selectUsersOrganisationsSchema, sessions, sessionsRelations, usersOrganisations, UserOrganisationsRelations } from "./users";
export { users, usersRelations, insertUserSchema, selectUserSchema, insertSessionsSchema, selectSessionSchema, insertUsersOrganisationsSchema, selectUsersOrganisationsSchema, sessions, sessionsRelations, usersOrganisations, UserOrganisationsRelations };
import type { User, NewUser, Sessions, NewSessions, UsersOrganisations, NewUsersOrganisations } from "./users";
export type { User, NewUser, Sessions, NewSessions, UsersOrganisations, NewUsersOrganisations };
import { projects, insertProjectsSchema, selectProjectsSchema, questions, insertQuestionsSchema, selectQuestionsSchema, responses, insertResponsesSchema, selectResponsesSchema, projectMemberAccess, insertProjectMemberAccessSchema, selectProjectMemberAccessSchema, projectRelations, questionsRelations, responsesRelations, projectMemberAccessRelations, kudos, kudosRelations, selectKudosSchema, insertKudosSchema } from "./projects";
export { projects, insertProjectsSchema, selectProjectsSchema, questions, insertQuestionsSchema, selectQuestionsSchema, responses, insertResponsesSchema, selectResponsesSchema, projectMemberAccess, insertProjectMemberAccessSchema, selectProjectMemberAccessSchema, projectRelations, questionsRelations, responsesRelations, projectMemberAccessRelations, kudos, kudosRelations, selectKudosSchema, insertKudosSchema };
import type { Projects, NewProjects, Questions, NewQuestions, Responses, NewResponses, ProjectMemberAccess, NewProjectMemberAccess, Kudos, NewKudos } from "./projects";
export type { Projects, NewProjects, Questions, NewQuestions, Responses, NewResponses, ProjectMemberAccess, NewProjectMemberAccess, Kudos, NewKudos };
import { providers, insertProvidersSchema, selectProvidersSchema, providersRelations, servers, insertServersSchema, selectServersSchema, serversRelations, channels, selectChannelsSchema, insertChannelsSchema, channelsRelations, providersServers, providersServersRelations, selectProvidersServersSchema, insertProvidersServersSchema } from "./provider";
export { providers, insertProvidersSchema, selectProvidersSchema, providersRelations, servers, insertServersSchema, selectServersSchema, serversRelations, channels, selectChannelsSchema, insertChannelsSchema, channelsRelations, providersServers, providersServersRelations, selectProvidersServersSchema, insertProvidersServersSchema };
import type { Providers, NewProviders, Servers, NewServers, Channels, NewChannels, ProvidersServers, NewProvidersServers } from "./provider";
export type { Providers, NewProviders, Servers, NewServers, Channels, NewChannels, ProvidersServers, NewProvidersServers };
import { organisations, insertOrganisationsSchema, selectOrganisationsSchema, organisationsRelations, } from "./organisations";
export { organisations, insertOrganisationsSchema, selectOrganisationsSchema, organisationsRelations, };
import type { Organisations, NewOrganisations } from "./organisations";
export type { Organisations, NewOrganisations };
import { orgSubscriptions, insertOrgSubscriptionsSchema, selectOrgSubscriptionsSchema, subscriptions, insertSubscriptionsSchema, selectSubscriptionsSchema, orgSubscriptionsRelations, subscriptionsRelations } from "./payments";
export { orgSubscriptions, insertOrgSubscriptionsSchema, selectOrgSubscriptionsSchema, subscriptions, insertSubscriptionsSchema, selectSubscriptionsSchema, orgSubscriptionsRelations, subscriptionsRelations };
import type { OrgSubscriptions, NewOrgSubscriptions, Subscriptions, NewSubscription } from "./payments";
export type { OrgSubscriptions, NewOrgSubscriptions, Subscriptions, NewSubscription };
import { eq, ne, gt, gte, lt, lte, isNull, inArray, notInArray, exists, notExists, between, notBetween, like, ilike, notIlike, not, and, or } from "drizzle-orm"
export { eq, ne, gt, gte, lt, lte, isNull, inArray, notInArray, exists, notExists, between, notBetween, like, ilike, notIlike, not, and, or };
import { MySqlSelectQueryBuilder, MySqlInsertBuilder } from "drizzle-orm/mysql-core";
import { createId } from "@paralleldrive/cuid2"
export { createId };

import { connect } from "@planetscale/database";
const connection = connect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
})

export const db = drizzle(connection)

