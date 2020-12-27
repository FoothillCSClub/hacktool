const skillCollection = ["javascript", "typescript", 'python'] as const;
type Skill = typeof skillCollection[number]; // 'a'|'b'|'c';

export type User = Readonly<{
    name: string
    githubHTML: string
    avatarURL: string
    skills: ReadonlyArray<Skill>
}>

export type Project = Readonly<{
    title: string;
    description: string;
    leader: User;
    projectURL: string;
    members: ReadonlyArray<User>;
}>