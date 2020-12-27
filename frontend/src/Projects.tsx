import { Avatar, Box, Button, Heading, Paragraph, Select, Text, TextArea, TextInput } from 'grommet';
import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import axios from 'axios';
import { generateAPIURI, NetworkTypes } from '@hacktool/common';
import { useRecoilValue } from 'recoil';
import { currentUserAuthTokenState } from './AppAtoms';
import DebugUserToken from './components/DebugUserToken';
import LoadingFallback from './components/LoadingFallback';
import DebugNetworkError from './components/DebugNetworkError';
import { Add, Close, Github } from 'grommet-icons';


type NewProjectPayload = {
    title: string,
    description: string,
    skills: NetworkTypes.Skill[],
    projectURL?: string | null;
}


type CreateNewProjectModalProps = Readonly<{
    userToken: string;
    setCreateNewProjectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>

function CreateNewProjectModal(props: CreateNewProjectModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [skills, setSkills] = useState<NetworkTypes.Skill[]>([])
    const [skillInput, setSkillInput] = useState<NetworkTypes.Skill>('')

    const mutation = useMutation((newProject: NewProjectPayload) => axios.post(generateAPIURI('/project'), newProject, {
        headers: {
            'Authorization': `Bearer ${props.userToken}`
        }
    }));

    const skillSuggestions = NetworkTypes.skillCollection.map(node => node);

    return (
        <Box width="large" pad="small" margin={{ bottom: "medium" }} background="light-2" align="center" justify="center">
            <Button onClick={() => props.setCreateNewProjectModalOpen(false)} alignSelf="end" icon={<Close />} />

            {mutation.isLoading &&
                <Heading>Submitting Project....</Heading>}

            {mutation.isError ? (<Text size="large" >There was an error with the project submission!</Text>) : (
                <>
                    {mutation.isSuccess ?
                        (<Heading>Thank you for your contribution!</Heading>) : (
                            <>

                                <Heading>Create a new Project</Heading>
                                <Paragraph>Happy Hacking and Making!</Paragraph>
                                <Box fill margin={{ bottom: "small" }}>
                                    <TextInput
                                        placeholder="project title"
                                        value={title}
                                        onChange={event => setTitle(event.target.value)}
                                    />
                                </Box>
                                <TextArea

                                    placeholder="Leave Description Here"
                                    value={description}
                                    onChange={event => setDescription(event.target.value)}
                                />
                                <Box fill margin={{ bottom: "small", top: 'small' }}>
                                    <Select
                                        placeholder="Desired Skills"
                                        options={skillSuggestions}
                                        value={skillInput}
                                        onChange={({ option }) => {
                                            setSkillInput(option)
                                            setSkills([...skills, option])
                                            setSkillInput('')
                                        }}
                                    />
                                </Box>
                                <TextArea
                                    readOnly
                                    value={Array.from(new Set(skills)).join(',')}
                                    onChange={event => setDescription(event.target.value)}
                                />
                                <Button onClick={() => {
                                    mutation.mutate({
                                        description, title, skills: Array.from(new Set(skills)),
                                    })
                                }} color="neutral-3" primary margin={{ top: "small" }} label="Submit" />
                            </>
                        )}
                </>
            )}

        </Box >
    )
}

type ProjectsQueryResponse = Readonly<{
    projects: NetworkTypes.Project[]
}>

function useProjectsQuery(userToken: string) {
    return useQuery<ProjectsQueryResponse, Error>('projectsPage', async () => {
        try {
            const response = await axios.get(generateAPIURI('/project'), {
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

function Projects() {

    const [createNewProjectModalOpen, setCreateNewProjectModalOpen] = useState(false);
    const userToken = useRecoilValue(currentUserAuthTokenState);
    const { isLoading, isError, data } = useProjectsQuery(userToken);

    if (!userToken || userToken.length <= 0) return <DebugUserToken />

    if (isLoading) return <LoadingFallback />

    if (isError) return <DebugNetworkError />

    return (
        <Box style={{ position: 'relative' }} align="center" justify="center">
            <Heading>Look at others hackathon projects</Heading>

            {createNewProjectModalOpen ?
                <CreateNewProjectModal setCreateNewProjectModalOpen={setCreateNewProjectModalOpen} userToken={userToken} /> :
                (<Box margin={{ bottom: 'small' }} width="large">
                    <Button onClick={() => setCreateNewProjectModalOpen(true)} alignSelf="end" primary icon={<Add />} />
                </Box>)}

            <Box overflow='auto' width="large" height="100%" pad="small" gridArea="main" background="light-2" align="center" justify="start">
                {(!data?.projects || data.projects.length <= 0) ? <Heading size="small">No Projects</Heading> : (<>
                    {data.projects.map((project, index) => (
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

        </Box>
    )
}

export default Projects;