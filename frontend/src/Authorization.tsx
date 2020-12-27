import React, { useCallback, useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import { currentUserAuthTokenState } from './AppAtoms'
import useURLQuery from './util/useURLQuery';
import nullthrows from './util/nullthrows';
import { Box, Heading } from 'grommet';
import { useHistory } from 'react-router-dom';

function Authorization() {
    const setCurrentToken = useSetRecoilState(currentUserAuthTokenState);
    const query = useURLQuery();
    const tokenDoNotShare = nullthrows(query.get('token_do_not_share'));

    const history = useHistory();

    const storePassedToken = useCallback(() => {
        setCurrentToken(tokenDoNotShare)
    }, [tokenDoNotShare, setCurrentToken]);

    useEffect(() => {
        storePassedToken();
        history.push('/dashboard')
    }, [storePassedToken, history]);


    return (
        <Box>
            <Heading>Loading...</Heading>
        </Box>
    )

}

export default Authorization;