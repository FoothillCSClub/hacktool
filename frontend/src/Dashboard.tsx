import React from 'react';
import { Avatar, Box, Button, Grid, Heading, Paragraph, Text } from 'grommet';
import { useRecoilValue } from 'recoil';
import { currentUserAuthTokenState } from './AppAtoms';
import { Github } from 'grommet-icons';
import { useQuery } from 'react-query';
import { generateAPIURI, NetworkTypes } from '@hacktool/common'
import { useHistory } from 'react-router-dom';
import DebugUserToken from './components/DebugUserToken';
import LoadingFallback from './components/LoadingFallback';
import DebugNetworkError from './components/DebugNetworkError';
import axios from 'axios';

type DashboardQueryResponse = Readonly<{
    user: NetworkTypes.User,
    projects: NetworkTypes.Project[]
}>

function useDashboardQuery(userToken: string) {
    return useQuery<DashboardQueryResponse, Error>('userDashboard', async () => {
        try {
            const response = await axios.get(generateAPIURI('/me/dashboard'), {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error);
        }
    })
}

function Dashboard() {

    const userToken = useRecoilValue(currentUserAuthTokenState);
    const history = useHistory();

    function handleLogout() {
        history.push('/?type=NULLIFY');
    }

    const { isLoading, isError, data } = useDashboardQuery(userToken);

    if (!userToken || userToken.length <= 0) return <DebugUserToken />

    if (isLoading) return <LoadingFallback />

    if (isError) return <DebugNetworkError />

    return (
        <Box align="center" justify="center">

            <Heading>Welcome to the Hack Tool Dashboard!</Heading>
            <Box direction="row" gap="xsmall">
                <Button primary href='/projects' label='Look at other projects' />
                <Button onClick={handleLogout} label='Logout' />
            </Box>
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
                        <Heading>{data?.user?.name}</Heading>
                        <Avatar src={data?.user?.avatarURL} size="200px" />
                        <Button color="black" margin="small" label="Github" icon={<Github />} href={data?.user?.githubURL} />

                        {(data?.user?.skills && data.user?.skills.length > 1)
                            ? <Box direction="row-responsive" wrap>{data.user?.skills.map((skill, index) => <Text key={index.toString()} size="large" color="gray">{skill},</Text>)}</Box>
                            : <Text size="large" color="gray">No Skills Listed</Text>}
                    </Box>

                    <Box overflow='auto' width="large" height="100%" pad="small" gridArea="main" background="light-2" align="center" justify="start">
                        {(!data?.projects || data.projects.length <= 0) ? <Heading size="small">No Projects</Heading> : (<> {data.projects.map((project, index) => (
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
                                {(project.skills && project.skills.length > 1) ? <Box direction="row-responsive" wrap>{project.skills.map((skill, index) => <Text key={index.toString()} size="large" color="gray">{skill},</Text>)}</Box> : <Text size="large" color="gray">No Desired Skills Listed</Text>}
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
