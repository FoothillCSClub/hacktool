import { Box, Heading } from 'grommet';
import React from 'react';


function LoadingFallback() {
    return (
        <Box align="center" justify="center">
            <Heading>Loading...</Heading>
        </Box>
    )
}

export default LoadingFallback;