import React from 'react';
import { Avatar, Box, Button, Grid, Heading, Paragraph, Text } from 'grommet';
import { useRecoilValue } from 'recoil';
import { currentUserAuthTokenState } from './AppAtoms';
import { Github, Login } from 'grommet-icons';
import DebugSurface from './components/DebugSurface';
import { useQuery } from 'react-query';
import { NetworkTypes, nullthrows } from '@hacktool/common'

// xport type User = Readonly<{
//     name: string;
//     githubURL: string;
//     avatarURL: string;
//     skills: ReadonlyArray<Skill>;
// }>

// export type Project = Readonly<{
//     title: string;
//     description: string;
//     projectURL: string;
//     leader: User;
//     skills: ReadonlyArray<Skill>;
//     members: ReadonlyArray<User>;
// }>

const projects: NetworkTypes.Project[] = [] as NetworkTypes.Project[];

function Dashboard() {

    const userToken = useRecoilValue(currentUserAuthTokenState);


    const { isLoading, isError, data } = useQuery<NetworkTypes.User>('userDashboard', () =>
        fetch(`${process.env.REACT_APP_API_URL}/me`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        }).then(res =>
            res.json()
        )
    )

    if (isLoading) return <Box align="center" justify="center">
        <Heading>Loading...</Heading>
    </Box>

    if (isError) return (
        <DebugSurface>
            <Box align="center" justify="center">
                <Heading color="status-error">An Error Has Occured</Heading>
                <Paragraph>Reach out to the hacktool team if this continues
                after refresh or logging in again
                </Paragraph>
            </Box>
        </DebugSurface>
    )

    if (!userToken || userToken.length <= 0) {
        return (
            <DebugSurface>
                <Box align="center" justify="center">
                    <Heading color="status-error">Token Missing!</Heading>
                    <Paragraph>
                        Your account lacks a User token this is used to verify your identity
                        and grant access to certain app features. You may want to go to the
                        login page and try logging in or reaching out to the hacktool team
                        about this issue.
                </Paragraph>
                    <Button color="status-error" primary href='/' icon={<Login />} label='Take me to the login page' />
                </Box>
            </DebugSurface>
        );
    }

    return (
        <Box align="center" justify="center">
            <Heading>Welcome to the Hack Tool Dashboard!</Heading>
            <Grid>
                <Grid
                    rows={['auto', 'auto']}
                    columns={['auto', 'auto']}
                    gap="small"
                    areas={[
                        { name: 'user', start: [0, 1], end: [1, 1] },
                        { name: 'main', start: [1, 1], end: [1, 1] },
                    ]}
                >
                    <Box width="medium" height="large" pad="small" background="light-5" gridArea="user" align="center" justify="start">
                        <Heading>{data?.name}</Heading>
                        <Avatar src={data?.avatarURL} size="200px" />
                        <Button color="black" margin="small" label="Github" icon={<Github />} href={data?.githubURL} />
                        {(nullthrows(data?.skills.length) > 1) ? <Box direction="row-responsive" wrap>{data?.skills.map((skill, index) => <Text key={index.toString()} size="large" color="gray">{skill},</Text>)}</Box> : <Text size="large" color="gray">No Skills Listed</Text>}
                    </Box>

                    <Box overflow='auto' width="large" height="100%" pad="small" gridArea="main" background="light-2" align="center" justify="start">
                        {(projects.length <= 0) ? <Heading size="small">No Projects</Heading> : (<> {projects.map((project, index) => (
                            <Box key={index.toString()} fill="horizontal" margin={{ bottom: "small" }} background="white" border pad="small">
                                <Avatar border={{
                                    color: '#FFCA58'
                                }} onClick={() => window.open(project.leader.githubURL, '_blank')
                                } src={project.leader.avatarURL} size="65px" />
                                <Heading margin={{
                                    bottom: "small",
                                    top: "small"
                                }}>{project.title}</Heading>
                                <Box direction="row" gap="xxsmall" alignSelf="start">
                                    {project.members.map((member, index) => <Avatar key={index.toString()} onClick={() => window.open(member.githubURL, '_blank')
                                    } src={member.avatarURL} size="35px" />)}
                                </Box>
                                {(nullthrows(project.skills.length) > 1) ? <Box direction="row-responsive" wrap>{project.skills.map((skill, index) => <Text key={index.toString()} size="large" color="gray">{skill},</Text>)}</Box> : <Text size="large" color="gray">No Desired Skills Listed</Text>}
                                <Paragraph fill margin={{ bottom: "small" }}>{project.description}</Paragraph>
                                {project.projectURL ? <Button icon={<Github />} target="__blank" color="#211F1F" primary label="Check Out Project" href={project.projectURL} /> : <Button disabled primary color="gray" label='No Project Repo Yet' />}
                            </Box>
                        ))}</>)}
                    </Box>

                </Grid>

            </Grid>
        </Box>
    );
}

export default Dashboard;
