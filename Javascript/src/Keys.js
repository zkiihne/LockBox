import './App.css';
import * as React from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Chip from '@mui/material/Chip';
import { ConnectMetaMask } from './ConnectMetaMask';
import { useSelector, useDispatch } from 'react-redux'
import {
    selectMaskAddress,
    changeMaskAddress
} from './ConnectMetaMaskSlice'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import {getKeys, getLockboxInfo, getLockboxBalance, liquidateContract} from "./EtherMethods.js";
import BasicTable from './BasicTable';

import {getBoxContents} from   "./Etherscan.js"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Keys() {
  // const example_key = "0x3546720F7e46DCA9114872E3b428bf5B456F2D43";

  const maskAddress = useSelector(selectMaskAddress);
  const dispatch = useDispatch();
  const [boxes, setBoxes] = React.useState([]);
  const [opencontents, setOpencontents] = React.useState(null);
  const [opendeposit, setOpendeposit] = React.useState(null);
  const [openaddtime, setOpenaddtime] = React.useState(null);
  const [unlock, setUnlock] = React.useState(null);
  const [rows, setRows] = React.useState([]);
  const [contents, setContents] = React.useState([]);
  


  function createData(name, symbol, quantity, type, address) {
    return { name, symbol, quantity, type, address };
  }
 
  
  async function unlockClick(lockboxAddress){
      console.log("!!! Ininiate unlock");
      await getBoxContents(lockboxAddress).then((result) => {
        console.log(result);
        let rows = [];
        result.forEach(element => {
          rows.push(createData(element.tokenName, element.tokenSymbol, element.amount, element.type, element.contractAddress));
        });
        setRows(rows);
        setContents(result);
        setUnlock(lockboxAddress);
      })
      

  }

  async function unlockBoxClick(lockboxAddress){
    console.log("!!! Ininiate unlock" + lockboxAddress);
    liquidateContract(lockboxAddress, contents);
}

  function depositClick(lockboxAddress){
    console.log("!!! open deposit popup");
    setOpendeposit(lockboxAddress);
    }

    async function contentsClick(lockboxAddress){
        
        console.log("!!! open contents popup " + lockboxAddress);
        
        await getBoxContents(lockboxAddress).then((result) => {
          console.log(result);
          let rows = [];
          result.forEach(element => {
            rows.push(createData(element.tokenName, element.tokenSymbol, element.amount, element.type, element.contractAddress));
          });
          setRows(rows);
          setContents(result);
          setOpencontents(lockboxAddress);
        })
        

    }
    

    const handleClose = () => {
      console.log("close")
      setOpencontents(null);
      setOpendeposit(null);
      setUnlock(false);
      setOpenaddtime(false);
    };

    React.useEffect(async () => {
      console.log(maskAddress);
      let keys = await getKeys( maskAddress);
      console.log(keys);
      keys = await getLockboxInfo(keys);
      setBoxes(keys)
    }, [maskAddress]);

    function componentDidUpdate() {
      console.log("updated!!!!");
    }

  return (
    
    <div className="App">
      <header >
        <ResponsiveAppBar />
      </header>
      <body className="App-header">
        { maskAddress ? (
          <div>
            <AppBar position="relative" color="transparent" style={{  minHeight: 100, boxShadow: 'none'}} ></AppBar>
          <Stack spacing={1} style={{alignItems:'center', verticalAlign: 'top', maxWidth:700,}} alignItems="center" >
                                    <Typography  color="white" fontSize="42px">
                                        Your Boxes
                                    </Typography>
                    {boxes.map((contract) => (
                        <Card   variant="outlined" style={{ minWidth: '40vw', backgroundColor: "inherit",borderColor: "white"}} >
                                
                                <Typography  color="white" fontSize="32px">
                                        {contract.name}
                                    </Typography>
                                <Chip style={{width:"80%", fontSize:"20px"}} size="large" label={contract.address} onClick={() => {navigator.clipboard.writeText(contract.address)}} variant="filled" color="primary"/>

                                <CardHeader
                                    style={{color:"white", subColor:"white"}}
                                    subheader={
                                        <div>
                                          
                                    <Typography  color="white">
                                        {"Time Remaining: " + contract.timestamp}
                                    </Typography>
                                    
                                    </div>}
                                />
                                <Box sx={{ display: 'flex', m:2, }}>
                                    <CardMedia
                                        style={{maxWidth:100, maxHeight:100}}
                                        component="img"
                                        image={require('./static/tc10.png')}
                                        alt="Live from space album cover"
                                    />
                                
                                    <CardContent sx={{ flex: '1 0 auto', }} >

                                    <Box sx={{ display: 'flex',   justifyContent: 'space-evenly', }}>
                                        <Button variant="contained" value={contract.address} onClick={(e)=>{contentsClick(e.target.value)}}>Contents</Button>
                                        <Button variant="contained" value={contract.address} onClick={(e)=>{depositClick(e.target.value)}}>Deposit</Button>
                                        <Button variant="contained" value={contract.address} onClick={(e)=>{depositClick(e.target.value)}}>Add time</Button>
                                        <Button variant="contained" disabled={contract.timestamp != 0} value={contract.address} onClick={(e)=>{unlockClick(e.target.value)}} >Unlock</Button>
                                    </Box>
                                    
                                      <Dialog
                                            open={contract.address == opencontents }
                                            TransitionComponent={Transition}
                                            maxWidth="lg"
                                            onClose={handleClose}
                                          >
                                            
                                            <DialogTitle sx={{ textAlign:"center" }}>{"LockBox Contents"}</DialogTitle>
                                            <DialogContent >
                                                
                                                <DialogContentText id="alert-dialog-slide-description" sx={{ textAlign:"center" }}>
                                                  LockBox Address
                                                </DialogContentText>
                                                <Box   pt={1} sx={{
                                                      display: 'flex',
                                                      m: 2,
                                                      flexDirection: 'column',
                                                      m: 'auto',
                                                      width: 'fit-content',
                                                    }}>
                                                  <Chip label={contract.address} onClick={() => {navigator.clipboard.writeText(contract.address)}} variant="filled" color="primary"/>
                                                </Box>
                                                <Box   pt={3}>
                                                  <BasicTable rows={rows}/>
                                                </Box>
                                            </DialogContent>
                                            <DialogActions>
                                              <Button onClick={handleClose}>Close</Button>
                                            </DialogActions>
                                      </Dialog>
                                    <div>
                                      <Dialog
                                            open={contract.address == opendeposit }
                                            TransitionComponent={Transition}
                                            
                                            onClose={handleClose}
                                          >
                                            <DialogTitle>{"Deposit into your LockBox by sending to the below address"}</DialogTitle>
                                            <DialogContent >
                                              <DialogContentText id="alert-dialog-slide-description" sx={{ textAlign:"center" }}>
                                                You can check what is in your LockBox and send more tokens to it at anytime, under the Keys tab.
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
                                                <Chip label={contract.address} onClick={() => {navigator.clipboard.writeText(contract.address)}} variant="filled" color="primary"/>
                                                
                                              </Box>
                                            </DialogContent>
                                            <DialogActions>
                                              <Button onClick={handleClose}>Close</Button>
                                            </DialogActions>
                                      </Dialog>
                                    </div>
                                    <Dialog
                                            open={contract.address == openaddtime }
                                            TransitionComponent={Transition}
                                            
                                            onClose={handleClose}
                                          >
                                            <DialogTitle sx={{ textAlign:"center" }}>{"Add time to the lock"}</DialogTitle>
                                            <DialogContent >
                                              <DialogContentText id="alert-dialog-slide-description" sx={{ textAlign:"center" }}>
                                                You can add time to your lock below. Keep in mind that adding time is not reversible!
                                              </DialogContentText>
                                              <Box   pt={3}>
                                                <DialogTitle sx={{ textAlign:"center" }}>
                                                  Current time until unlock:
                                                </DialogTitle>
                                                
                                              </Box>
                                              <Box   pt={1} sx={{
                                                    display: 'flex',
                                                    m: 2,
                                                    flexDirection: 'column',
                                                    m: 'auto',
                                                    width: 'fit-content',
                                                  }}>
                                                <Chip label={contract.address} onClick={() => {navigator.clipboard.writeText(contract.address)}} variant="filled" color="primary"/>
                                              </Box>
                                              <Box   pt={3}>
                                                <DialogTitle sx={{ textAlign:"center" }}>
                                                  Current address:
                                                </DialogTitle>
                                                
                                              </Box>
                                              <Box   pt={1} sx={{
                                                    display: 'flex',
                                                    m: 2,
                                                    flexDirection: 'column',
                                                    m: 'auto',
                                                    width: 'fit-content',
                                                  }}>
                                                <Chip label={contract.address} variant="filled" color="primary"/>
                                              </Box>
                                            </DialogContent>
                                            <DialogActions>
                                              <Button onClick={handleClose}>Close</Button>
                                            </DialogActions>
                                      </Dialog>
                                    <div>
                                      <Dialog
                                            open={contract.address == unlock}
                                            TransitionComponent={Transition}
                                            
                                            onClose={handleClose}
                                          >
                                            <DialogTitle align="center">{"Unlock your Lockbox"}</DialogTitle>
                                            <DialogContent >
                                              <DialogContentText id="alert-dialog-slide-description" sx={{ textAlign:"center" }}>
                                                You will be asked to confirm the transaction in your metamask
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
                                                <Chip label={contract.address} value={contract.address} onClick={(e) => {navigator.clipboard.writeText(e.target.value)}} variant="filled" color="primary"/>
                                                
                                              </Box>
                                              <Box    pt={1} sx={{
                                                    display: 'flex',
                                                    m: 2,
                                                    flexDirection: 'column',
                                                    m: 'auto',
                                                    width: 'fit-content',
                                                  }}>
                                              <Button variant="contained" value={contract.address} onClick={(e)=>{unlockBoxClick(e.target.value)}}>Unlock</Button>
                                              </Box>
                                              <Box   pt={3}>
                                                  <BasicTable rows={rows}/>
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
                    )
                    )}
                    
          
          </Stack>
          </div>
        ):(
            <ConnectMetaMask />
        )}
      </body>
    </div>
  );
}

export default Keys;