import React, { useCallback, useEffect } from 'react';
import { Box, Button, Heading } from 'grommet';
import { Github } from 'grommet-icons';
import { useRecoilValue } from 'recoil';
import { currentUserAuthTokenState } from './AppAtoms';
import { useHistory } from 'react-router-dom';

function App() {

  const currentToken = useRecoilValue(currentUserAuthTokenState);
  const history = useHistory();

  const checkForToken = useCallback(() => {
    if (currentToken && currentToken.length >= 1) {
      history.push('/dashboard');
    }
  }, [currentToken, history])

  useEffect(() => {
    checkForToken();
  }, [checkForToken])

  function githubLoginHandler() {
    window.location.replace(`${process.env.REACT_APP_API_URL}/github/login`)
  }

  return (
    <Box align="center" justify="center">
      <Heading>Welcome to the Hack Tool!</Heading>
      <Button onClick={githubLoginHandler} primary label="Continue with Github" icon={<Github />} />
    </Box>
  );
}

export default App;
