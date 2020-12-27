import React from 'react';
import { Box, Button, Heading } from 'grommet';
import { Github } from 'grommet-icons';

function App() {

  function githubLoginHandler() {
    alert('Logging in!')
  }

  return (
    <Box align="center" justify="center">
      <Heading>Welcome to the Hack Tool!</Heading>
      <Button onClick={githubLoginHandler} primary label="Continue with Github" icon={<Github />} />
    </Box>
  );
}

export default App;
