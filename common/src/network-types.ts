export const skillCollection = ['javascript', 'typescript', 'python'] as const;
export type Skill = typeof skillCollection[number];

export type User = Readonly<{
    name: string;
    githubURL: string;
    avatarURL: string;
    skills: ReadonlyArray<Skill>;
}>

export type Project = Readonly<{
    title: string;
    description: string;
    leader: User;
    projectURL: string;
    skills: ReadonlyArray<Skill>;
    members: ReadonlyArray<User>;
}>
