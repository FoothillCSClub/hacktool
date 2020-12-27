import React, { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'

import { nullthrows } from '@hacktool/common';

import { currentUserAuthTokenState } from './AppAtoms'
import useURLQuery from './util/useURLQuery';
import { Box, Heading } from 'grommet';
import { useHistory } from 'react-router-dom';

function Authorization() {
    const setCurrentToken = useSetRecoilState(currentUserAuthTokenState);
    const query = useURLQuery();
    const tokenDoNotShare = nullthrows(query.get('token_do_not_share'));

    const history = useHistory();

    useEffect(() => {
        setCurrentToken(tokenDoNotShare)
        history.push('/dashboard')
    }, [history, setCurrentToken, tokenDoNotShare])

    return (
        <Box>
            <Heading>Loading...</Heading>
        </Box>
    )

}

export default Authorization;