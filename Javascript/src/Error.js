import './App.css';
import * as React from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';

function Error() {

  const [loaded, setLoaded] = React.useState(false);

  function connectWallet() {
    console.log("connected to wallet "+loaded);
    setLoaded(true);
  }

  const text = "Something went wrong... You are not supposed to get here";

  return (
    <div className="App">
      <header >
        <ResponsiveAppBar />
      </header>
      <body className="App-header">
        
          
          <Stack spacing={5} style={{alignItems:'center', verticalAlign: 'top', maxWidth:300 }} alignItems="center" >
            <Button variant="contained" size="large" as={Link} to="/">Go home you're drunk</Button>
            <Typography variant="body1"> {text}</Typography>
          </Stack>
          
      </body>
    </div>
  );
}

export default Error;