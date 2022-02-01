import './App.css';
import * as React from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { ConnectMetaMask } from './ConnectMetaMask';
import FormControl from '@mui/material/FormControl';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import { useSelector, useDispatch } from 'react-redux'
import { createStyles, WithStyles, withStyles } from '@material-ui/core';
import {
    selectMaskAddress,
} from './ConnectMetaMaskSlice'
import AppBar from '@mui/material/AppBar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { getLockboxBalance, getLockboxApproval, makeLockbox } from './EtherMethods';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Chip from '@mui/material/Chip';



var currContractAddress = null; 
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function Make() {

  const maskAddress = useSelector(selectMaskAddress);
  const dispatch = useDispatch();
  const example_box = "0x98b6Cdf3BA43BBc78291ca761996A834ED113a99";

  const [activeStep, setActiveStep] = React.useState(1);
  const [open, setOpen] = React.useState(false);
  var [lockboxAddress, setLockboxAddress] = React.useState(false);


  const [years, setYears] = React.useState(0);
  const [days, setDays] = React.useState(0);
  const [hours, setHours] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [unlocktimemilli, setUnlocktimemilli] = React.useState(0);
  const [name, setName] = React.useState("");
  const [unlockdate, setUnlockdate] = React.useState(Date(Date.now()).toString());
    const HandleNext = async () => {
    if(activeStep == 1){
        console.log("!!! CALL CREATE")
        try{
          currContractAddress = await makeLockbox( unlocktimemilli, name);
          setLockboxAddress(currContractAddress);// getLockboxBalance(lockboxAddress);
          console.log(currContractAddress)
          setActiveStep(prevActiveStep => prevActiveStep + 1);
        }
        catch (error){
          alert(error);
        }
        
    }

    else{
        console.log("!!! OPEN POPUP TO DEPOSIT")
        console.log(lockboxAddress)
        handleClickOpen();
    }
  };

  function addTimes(id, amount){
    let now = new Date();
    if(id === "years"){
      let pamount = parseInt(amount);
      if(amount == ""){
        pamount = 0;
      }
      now.setFullYear(now.getFullYear() + years + pamount ); 
    }
    else{
      now.setFullYear(now.getFullYear() + years); 
    }

    if(id === "days"){
      let pamount = parseInt(amount);
      if(amount == ""){
        pamount = 0;
      }
      now.setDate(now.getDate() + days + pamount); 
    }
    else{
      now.setDate(now.getDate() + days); 
    }
    if(id === "hours"){
      let pamount = parseInt(amount);
      if(amount == ""){
        pamount = 0;
      }
      now.setHours(now.getHours() + hours + pamount); 
    }
    else{
      now.setHours(now.getHours() + hours); 
    }
    if(id === "minutes"){
      let pamount = parseInt(amount);
      if(amount == ""){
        pamount = 0;
      }
      now.setMinutes(now.getMinutes() + minutes + pamount); 
    }
    else{
      now.setMinutes(now.getMinutes() + minutes); 
    }
    
    
    setUnlocktimemilli(now.getTime());
    setUnlockdate(now.toString());
  }

  const handleClickOpen = () => {
    console.log("open")
    setOpen(true);
  };

  const handleClose = () => {
    console.log("close")
    setOpen(false);
  };

  const handleChange = (id, amount) => {
    console.log(id + " " + amount);
    if(id === "years"){
      if(amount == ""){
        setYears(0);
      }
      else {
        setYears(parseInt(amount));
      }
    }
    else if(id === "days"){
      if(amount == ""){
        setDays(0);
      }
      else {
        setDays(parseInt(amount));
      }
    }
    else if(id === "hours"){
      if(amount == ""){
        setHours(0);
      }
      else {
        setHours(parseInt(amount));
      }
    }
    else if(id === "minutes"){
      if(amount == ""){
        setMinutes(0);
      }
      else {
        setMinutes(parseInt(amount));
      }
    }
    else if(id === "name"){
      if(amount == ""){
        setName("");
      }
      else {
        setName(amount);
      }
    }
    console.log(years + " " + days + " " + hours + " " + minutes + " " )
    addTimes(id, amount);
  };


  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const steps = [
    'Create',
    'Deposit',
  ]; 

  const styles = createStyles({
    notchedOutline: { borderColor: 'white !important' },
});


  return (
    <div className="App">
      <header >
        <ResponsiveAppBar />
      </header>
      <body className="App-header">
        { maskAddress ? (
          <div>
            <AppBar position="relative" color="transparent" style={{  minHeight: 100, boxShadow: 'none'}} ></AppBar>
          <Stack spacing={5} style={{alignItems:'center', verticalAlign: 'top', maxWidth:700}} alignItems="center" >
              <Card elevation={3} variant="outlined" style={{backgroundColor: "inherit",borderColor: "white"}} >
                            <CardHeader
                                style={{color:"white", subColor:"white"}}
                                title="Create a simple LockBox"
                                subheader={
                                    <div>
                                <Typography p={2} color="white">
                                    The key will be automatically added to your wallet upon deployment. Add to the contents by going to Keys and selecting your newly created LockBox.
                                </Typography>
                                </div>}
                            />
                            <div><Stack spacing={5} style={{alignItems:'center', verticalAlign: 'top', maxWidth:700}} alignItems="center" >
                            <FormControl >
                                <InputLabel sx={{color:"white"}} htmlFor="component-outlined">Name*</InputLabel>
                                  <OutlinedInput
                                     sx={{color:"white"}}
                                    id="component-outlined"                                    
                                    label="years"
                                    onChange={(e) =>{handleChange("name" ,e.target.value )}}
                                  />
                                    </FormControl>
                              <FormControl >
                                <InputLabel sx={{color:"white"}} htmlFor="component-outlined">Years</InputLabel>
                                  <OutlinedInput
                                     sx={{color:"white"}}
                                    id="component-outlined"                                    
                                    label="years"
                                    onChange={(e) =>{handleChange("years" ,e.target.value )}}
                                  />
                                    </FormControl>
                                <FormControl >
                                <InputLabel sx={{color:"white"}} htmlFor="component-outlined">Days</InputLabel>
                                  <OutlinedInput
                                    
                                    sx={{color:"white", }}
                                    id="component-outlined"                                    
                                    label="Name"
                                    onChange={(e) =>{handleChange("days" ,e.target.value )}}
                                  />
                                    </FormControl>
                                  <FormControl >
                                <InputLabel sx={{color:"white"}} htmlFor="component-outlined">Hours</InputLabel>
                                  <OutlinedInput
                                    sx={{color:"white"}}
                                    
                                    id="component-outlined"                                    
                                    label="Name"
                                    onChange={(e) =>{handleChange("hours" ,e.target.value )}}
                                  />
                                    </FormControl>
                                    <FormControl >
                                  {/* <InputLabel sx={{color:"white"}} htmlFor="component-outlined">Minutes</InputLabel>
                                  <OutlinedInput
                                     sx={{color:"white"}}
                                    id="component-outlined"                                    
                                    label="Name"
                                    onChange={(e) =>{handleChange("minutes" ,e.target.value )}}
                                  /> */}
                              </FormControl>
                              <Typography p={0} color="white">
                                    Total Time: {years} years {days} days {hours} hours
                                </Typography>
                                <Typography p={0} color="white">
                                    The box will be unlockable on:
                                </Typography>
                                <Typography p={0} color="white">
                                    {unlockdate}
                                </Typography>
                              </Stack>
                              </div>
                            <Box sx={{ display: 'flex', m:2}}>
                                <CardMedia
                                    style={{maxWidth:100}}
                                    component="img"
                                    image={require('./static/tc10.png')}
                                    alt="Live from space album cover"
                                />
                            
                                <CardContent sx={{ flex: '1 0 auto' }}>
                                <Stepper activeStep={activeStep-1} alternativeLabel>
                                        {steps.map((label, index) => 
                                        {
                                        console.log(activeStep)
                                        if(index===activeStep-1){
                                            return (
                                                <Step key={label}>
                                                    <StepLabel></StepLabel>
                                                    <Button variant="contained" onClick={HandleNext}>{label}</Button>
                                                </Step>
                                            )
                                        }
                                        else{
                                            return (
                                                <Step key={label}>
                                                    <StepLabel></StepLabel>
                                                    <Button variant="contained" disabled >{label}</Button>
                                                </Step>
                                            )
                                        }
                                        }
                                        )}
                                    </Stepper>
                                    <div>
                                    <Dialog
                                          open={open}
                                          TransitionComponent={Transition}
                                          
                                          onClose={handleClose}
                                        >
                                          <DialogTitle>{"Deposit into your LockBox by sending to the below address"}</DialogTitle>
                                          <DialogContent >
                                            <DialogContentText id="alert-dialog-slide-description" sx={{ textAlign:"center" }}>
                                              You can check what is in your LockBox and send more tokens to it at anytime, under the Keys tab. Please allow 5 mintues for the transaction to be confirmed and indexed.
                                            </DialogContentText>
                                            <Box   pt={3}>
                                              <DialogTitle sx={{ textAlign:"center" }}>
                                                Your Address:
                                              </DialogTitle>
                                            </Box>
                                            <Box   pt={1} sx={{
                                                  display: 'flex',
                                                  m: 2,
                                                  flexDirection: 'column',
                                                  m: 'auto',
                                                  width: 'fit-content',
                                                }}>
                                              <Chip label={lockboxAddress} value={lockboxAddress} onClick={(e) => {navigator.clipboard.writeText(e.target.value)}} variant="filled" color="primary"/>
                                                
                                            </Box>
                                          </DialogContent>
                                          <DialogActions>
                                            <Button onClick={handleClose}>Close</Button>
                                          </DialogActions>
                                    </Dialog>
                                    </div>
                                </CardContent>
                            
                            </Box>
                    
                    </Card>
        
          </Stack>
          </div>
        ):(
            <ConnectMetaMask />
        )}
      </body>
    </div>
  );
}

export default Make;