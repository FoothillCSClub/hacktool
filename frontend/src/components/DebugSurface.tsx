import { Box, Button, Heading, Paragraph, TextArea, Text } from 'grommet'
import React, { useState } from 'react'
import { Bug, Close } from 'grommet-icons';

import { generateAPIURI } from '@hacktool/common'

type Props = Readonly<{
    children: React.ReactNode;
}>

type DebugFormModalProps = Readonly<{
    setShowDebugModal: React.Dispatch<React.SetStateAction<boolean>>
}>

function DebugFormModal({ setShowDebugModal }: DebugFormModalProps) {

    const [success, setSuccess] = useState(false);
    const [submissionError, setSubmissionError] = useState<null | string>(null);
    const [debugFeedback, setDebugFeedback] = useState('');


    async function submissionHandler() {
        fetch(generateAPIURI('/debug-feedback'), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                feedback: debugFeedback
            }),
        }).then(
            response => {
                if (response.status === 201) {
                    setSuccess(true)
                    // delaying for user experience to feel normal
                    setTimeout(() => setShowDebugModal(false), 3000)
                }
                else if (response.status !== 201) {
                    setSubmissionError('Failed to submit feedback!')
                }
            }
        )
            .catch(_error => setSubmissionError('Failed to submit feedback!'))
    }
    return (
        <Box pad="small" style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 1,
        }} background="light-5">
            <Button onClick={() => setShowDebugModal(false)} alignSelf="end" icon={<Close />} />
            {submissionError ? <Text size="large" >
                There was an error with the feedback submission!
                </Text> : <>
                    {success ? <Heading>Thank you for your feedback!</Heading> : (
                        <>         <Heading>Have Feedback?</Heading>
                            <Paragraph>Bugs, Preferences or Feature Request can be passed here.</Paragraph>
                            <TextArea
                                placeholder="Leave Feedback Here"
                                value={debugFeedback}
                                onChange={event => setDebugFeedback(event.target.value)}
                            />
                            <Button onClick={submissionHandler} color="neutral-3" primary margin={{ top: "small" }} label="Submit" />
                        </>
                    )} </>
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