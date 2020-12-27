export type Team = Readonly<{
    authorName: string;
    authorGithubHTML: string;
    authorAvatarURL: string;
    description: string;
    skills: ReadonlyArray<string>
    team: ReadonlyArray<{
        name: string;
        githubHTML: string;
        avatarURL: string;
        skills: ReadonlyArray<string>
    }>
}>

export type TeamCollection = ReadonlyArray<Team>;