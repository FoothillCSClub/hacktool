import { LiteralUnion } from './util-types';

export const skillCollection = ['javascript', 'typescript', 'python'] as const;
export type Skill = LiteralUnion<typeof skillCollection[number]>;

export type MongoID = Readonly<string>;

export type User = Readonly<{
    _id: MongoID;
    name: string;
    githubURL: string;
    avatarURL: string;
    skills: ReadonlyArray<Skill>;
}>

export type Project = Readonly<{
    title: string;
    description: string;
    projectURL: string;
    leader: User;
    leaderID: MongoID;
    skills: ReadonlyArray<Skill>;
    members: ReadonlyArray<User>;
}>
