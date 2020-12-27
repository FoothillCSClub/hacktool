import { Box, Heading, Paragraph } from 'grommet';
import React from 'react';
import DebugSurface from './DebugSurface';

function DebugNetworkError() {
    return (
        <DebugSurface>
            <Box align="center" justify="center">
                <Heading color="status-error">An Error Has Occured</Heading>
                <Paragraph>Reach out to the hacktool team if this continues
                after refresh or logging in again
            </Paragraph>
            </Box>
        </DebugSurface>
    )
}

export default DebugNetworkError;