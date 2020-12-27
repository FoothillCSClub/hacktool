import React from 'react';
import { Box, Button, Heading, Paragraph } from 'grommet';
import { useRecoilValue } from 'recoil';
import { currentUserAuthTokenState } from './AppAtoms';
import { Login } from 'grommet-icons';
import DebugSurface from './components/DebugSurface';

function Dashboard() {

    const userToken = useRecoilValue(currentUserAuthTokenState);

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
        </Box>
    );
}

export default Dashboard;
