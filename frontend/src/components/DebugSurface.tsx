import { Box, Button, Heading, Paragraph, TextArea, Text } from 'grommet'
import React, { useState } from 'react'
import { Bug, Close } from 'grommet-icons';

import { generateAPIURI } from '@hacktool/common'
import axios from 'axios';
import { useMutation } from 'react-query';

type Props = Readonly<{
    children: React.ReactNode;
}>

type DebugFormModalProps = Readonly<{
    setShowDebugModal: React.Dispatch<React.SetStateAction<boolean>>
}>

type Feedback = Readonly<{
    feedback: string;
}>

function DebugFormModal({ setShowDebugModal }: DebugFormModalProps) {
    const [debugFeedback, setDebugFeedback] = useState('');
    const mutation = useMutation((newFeedback: Feedback) => axios.post(generateAPIURI('/debug-feedback'), newFeedback))

    return (
        <Box pad="small" style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 1,
        }} background="light-5">
            <Button onClick={() => setShowDebugModal(false)} alignSelf="end" icon={<Close />} />
            {
                mutation.isLoading &&
                (<Text size="large" >
                    Uploading Feedback....
                </Text>)
            }
            {mutation.isError ?
                (<Text size="large" >
                    There was an error with the feedback submission!
                </Text>)
                : (
                    <>
                        {mutation.isSuccess ?
                            (<Heading>Thank you for your feedback!</Heading>) : (
                                <>         <Heading>Have Feedback?</Heading>
                                    <Paragraph>Bugs, Preferences or Feature Request can be passed here.</Paragraph>
                                    <TextArea
                                        placeholder="Leave Feedback Here"
                                        value={debugFeedback}
                                        onChange={event => setDebugFeedback(event.target.value)}
                                    />
                                    <Button onClick={() => {
                                        mutation.mutate({ feedback: debugFeedback })
                                    }} color="neutral-3" primary margin={{ top: "small" }} label="Submit" />
                                </>
                            )
                        }
                    </>
                )
            }
        </Box >
    )
}

function DebugSurface(props: Props) {
    const [showDebugModal, setShowDebugModal] = useState(false);
    return (
        <div style={{
            overflow: 'hidden', position: 'relative', height: '97vh', width: '100%', maxHeight: '100vh', maxWidth: '100vw'
        }} >
            {props.children}
            {showDebugModal ? <DebugFormModal setShowDebugModal={setShowDebugModal} /> :
                <Button style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    zIndex: 1,
                }} onClick={() => setShowDebugModal(true)} size="small" primary color="status-unknown" icon={<Bug />} />}
        </div>
    )
}

export default DebugSurface;