import { Box, Button, Heading, Paragraph, TextArea } from 'grommet'
import React, { useState } from 'react'
import { Bug } from 'grommet-icons';


type Props = Readonly<{
    children: React.ReactNode;
}>

type DebugFormModalProps = Readonly<{
    debugFeedback: string;
    setDebugFeedback: React.Dispatch<React.SetStateAction<string>>
}>

function DebugFormModal({ debugFeedback, setDebugFeedback }: DebugFormModalProps) {
    function submissionHandler() {
        alert('Future feedback here');
    }
    return (
        <Box pad="small" style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 1,
        }} background="light-5">
            <Heading>Have Feedback?</Heading>
            <Paragraph>Bugs, Preferences or Feature Request can be passed here.</Paragraph>
            <TextArea
                placeholder="Leave Feedback Here"
                value={debugFeedback}
                onChange={event => setDebugFeedback(event.target.value)}
            />
            <Button onClick={submissionHandler} color="neutral-3" primary margin={{ top: "small" }} label="Submit" />
        </Box>
    )
}

function DebugSurface(props: Props) {
    const [showDebugModal, setShowDebugModal] = useState(false);
    const [debugFeedback, setDebugFeedback] = useState('');
    return (
        <div style={{
            overflow: 'hidden', position: 'relative', height: '97vh', width: '100%', maxHeight: '100vh', maxWidth: '100vw'
        }} >
            {props.children}
            {showDebugModal ? <DebugFormModal setDebugFeedback={setDebugFeedback} debugFeedback={debugFeedback} /> :
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