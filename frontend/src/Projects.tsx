import { Avatar, Box, Button, FormField, Heading, Paragraph, Select, Text, TextArea, TextInput } from 'grommet';
import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import axios from 'axios';
import { generateAPIURI, NetworkTypes } from '@hacktool/common';
import { useRecoilValue } from 'recoil';
import { currentUserAuthTokenState } from './AppAtoms';
import DebugUserToken from './components/DebugUserToken';
import LoadingFallback from './components/LoadingFallback';
import DebugNetworkError from './components/DebugNetworkError';
import { Add, Close, Edit, Github, Save } from 'grommet-icons';


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

type ProjectCardProps = Readonly<{
    project: NetworkTypes.Project,
    user: NetworkTypes.User,
    userToken: string;
}>

type UpdateProjectPayload = {
    title: string,
    description: string,
    skills: NetworkTypes.Skill[],
    projectURL?: string | null;
}


function ProjectCard({ project, user, userToken }: ProjectCardProps) {
    const [editMode, setEditMode] = useState(false);
    const [githubRepo, setGithubRepo] = useState(project.projectURL || null);
    const [title, setTitle] = useState(project.title);
    const [description, setDescription] = useState(project.description);
    const skillSuggestions = NetworkTypes.skillCollection.map(node => node);
    const [skills, setSkills] = useState<NetworkTypes.Skill[]>(project.skills as NetworkTypes.Skill[])
    const [skillInput, setSkillInput] = useState<NetworkTypes.Skill>('')

    const mutation = useMutation((updateProjectPayload: UpdateProjectPayload) => axios.put(`${generateAPIURI('/project')}/${project._id}`, updateProjectPayload, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    }));

    const updatePayload = {
        projectURL: githubRepo,
        title,
        description,
        skills
    }

    return (
        <Box fill="horizontal" margin={{ bottom: "small" }} background="white" border pad="small">
            {(project.leaderID === user._id) && (
                <Box margin={{ bottom: "small" }}>
                    <Text>You made this Project</Text>
                </Box>
            )}

            <Avatar
                border={{
                    color: '#FFCA58'
                }} onClick={() => window.open(project.leader.githubURL, '_blank')
                } src={project.leader.avatarURL} size="65px" />


            {mutation.isLoading &&
                <Heading>Submitting Project Update....</Heading>}

            {mutation.isError && (<Text size="large" >There was an error with the project submission!</Text>)}

            {editMode ? <Box fill margin={{
                top: 'small',
                bottom: 'small'
            }}>
                <Button onClick={() => setEditMode(false)} alignSelf="end" icon={<Close />} />

                <FormField label="Title">
                    <TextInput
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} />
                </FormField>
            </Box>
                : <Heading margin={{
                    bottom: "small",
                    top: "small"
                }}>{project.title}</Heading>}

            <Box direction="row" gap="xxsmall" alignSelf="start">
                {project.members.map((member, index) => <Avatar key={index.toString()} onClick={() => window.open(member.githubURL, '_blank')
                } src={member.avatarURL} size="35px" />)}
            </Box>

            {editMode ? (
                <Box fill margin={{ bottom: "small", top: 'small' }}>
                    <Box margin={{ bottom: "small" }}>
                        <Select
                            placeholder="Desired Skills"
                            options={skillSuggestions}
                            value={skillInput}
                            onChange={({ option }) => {
                                if (new Set(skills).has(option)) {
                                    setSkillInput(option)
                                    setSkills([...skills].filter((node) => node !== option))
                                    setSkillInput('')
                                }
                                else {
                                    setSkillInput(option)
                                    setSkills([...skills, option])
                                    setSkillInput('')
                                }
                            }}
                        />
                    </Box>
                    <TextArea
                        readOnly
                        value={Array.from(new Set(skills)).join(',')}
                        onChange={event => setDescription(event.target.value)}
                    />
                </Box>
            ) :
                (<> {(project.skills && project.skills.length > 1) ? <Box direction="row-responsive" wrap>{project.skills.map((skill, index) => <Text key={index.toString()} size="large" color="gray">{skill},</Text>)}</Box> : <Text size="large" color="gray">No Desired Skills Listed</Text>}</>)}



            {editMode ? <Box fill margin={{
                top: 'small',
                bottom: 'small'
            }}>
                <FormField label="Description">
                    <TextArea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                </FormField>
            </Box> : <Paragraph fill margin={{ bottom: "small" }}>{project.description}</Paragraph>}


            {editMode ? <Box fill margin={{
                top: 'small',
                bottom: 'small'
            }}>
                <FormField label="Github Repo">
                    <TextInput
                        value={githubRepo || ''}
                        onChange={(e) => setGithubRepo(e.target.value)} />
                </FormField>
            </Box>
                : <>
                    {project.projectURL
                        ? <Button icon={<Github />} target="__blank" color="#211F1F" primary label="Check Out Project" href={project.projectURL} />
                        : <Button disabled primary color="gray" label='No Project Repo Yet' />}
                </>}


            {(project.leaderID === user._id) && (
                <Box margin={{ top: "small" }}>
                    {editMode ? <Button onClick={() => {
                        mutation.mutate(updatePayload)
                        setEditMode(false)
                    }} icon={<Save />} size="small" label="Save" /> : <Button onClick={() => setEditMode(true)} icon={<Edit />} size="small" label="Edit" />}
                </Box>
            )}
        </Box>
    )
}

type ProjectsQueryResponse = Readonly<{
    projects: NetworkTypes.Project[]
    user: NetworkTypes.User,
}>

function useProjectsQuery(userToken: string) {
    return useQuery<ProjectsQueryResponse, Error>('projectsPage', async () => {
        try {
            const response = await axios.get(generateAPIURI('/project/withUser'), {
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
                        <ProjectCard userToken={userToken} user={data.user} project={project} key={index} />
                    ))}</>)}
            </Box>

        </Box>
    )
}

export default Projects;