import logo from './logo.svg';
import './App.css';
import * as React from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import { Link } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import {OppositeContentTimeline} from './OppositeContentTimeline.js';

import { ConnectMetaMask } from './ConnectMetaMask';
import { useSelector, useDispatch } from 'react-redux'
import {
    selectMaskAddress,
    changeMaskAddress
} from './ConnectMetaMaskSlice'
function Home() {
    const maskAddress = useSelector(selectMaskAddress);



  const text1 = "Create a LockBox to store your wealth. Take your first steps towards generational wealth today.";
  const text2 = "View the LockBoxes you currently have keys for. You can deposit into them or unlock them.";


  return (
    <div className="App">
      <header >
        <ResponsiveAppBar />
      </header>
      <body className="App-header">
        { maskAddress ? (
          <div>
            <AppBar position="relative" color="transparent" style={{  minHeight: 200, boxShadow: 'none'}} ></AppBar>
                <Box sx={{ width: '100%' }}>
                    <Grid container rowSpacing={1} style={{alignItems:'center', justifyContent:"center" , verticalAlign: 'top', maxWidth:800 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={6}>
                        <CardMedia
                                    style={{maxWidth:200}}
                                    component="img"
                                    image={require('./static/tc10.png')}
                                    alt="Live from space album cover"
                                />
                        </Grid>
                        <Grid item xs={6}>
                        <Button variant="contained" size="large" as={Link} to="/make">Make a LockBox</Button>
                        <Typography p={2} variant="body1"> {text1}</Typography>
                        </Grid>
                        
                        <Grid item xs={6}>
                        <Button variant="contained" size="large" as={Link} to="/keys">View your Lockbox keys</Button>

                        <Typography p={2} variant="body1"> {text2}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                        <CardMedia
                                    style={{maxWidth:300}}
                                    component="img"
                                    image={require('./static/openchest.png')}
                                    alt="Live from space album cover"
                                />
                        </Grid>
                        <Grid item xs={12}>
                        <OppositeContentTimeline />
                        </Grid>
                    </Grid>
                </Box>
                </div>
                ):(
                <ConnectMetaMask />
        )}
      </body>
    </div>
  );
}

export default Home;