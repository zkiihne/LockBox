import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// import Menu from '@mui/material/Menu';
// import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip'
import { Link } from "react-router-dom";



import { useSelector, useDispatch } from 'react-redux'
import {
    selectMaskAddress,
    changeMaskAddress
} from './ConnectMetaMaskSlice'

const pages = ['make', 'keys'];

const ResponsiveAppBar = () => {
    const maskAddress = useSelector(selectMaskAddress);
    const dispatch = useDispatch();


  return (
    <AppBar position="absolute" color="transparent" style={{ background: 'transparent', boxShadow: 'none'}} >
      <Container maxWidth="xl" >
        <Toolbar disableGutters >
        <Button as={Link} to="/" sx={{ my: 2, color: 'white', display: 'block' }} style={{flex: 10}}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, color: 'white' }}
          >
            LockBox
          </Typography>
          </Button>
          <Chip label={maskAddress} onClick={() => {navigator.clipboard.writeText(maskAddress)}} variant="filled" color="primary"/>
                                                
          <Box sx={{ flexGrow: 0
            , display: { xs: 'none', md: 'flex' } }} >
            {pages.map((page) => (
              <Button
                key={page}
                as={Link}
                to={"/" + page}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;