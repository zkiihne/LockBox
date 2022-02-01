// import React, { useContext } from 'react'
import './App.css';
import { useSelector, useDispatch } from 'react-redux'
import {
    selectMaskAddress,
    changeMaskAddress
} from './ConnectMetaMaskSlice'

import Button from '@mui/material/Button';

export function ConnectMetaMask() {

    const maskAddress = useSelector(selectMaskAddress);
    const dispatch = useDispatch();

    async function MaskClick ()
    {
        console.log("initial address "+ maskAddress);
        
       
        if (typeof window.ethereum !== 'undefined' && maskAddress == null) {
            await window.ethereum
            .request({
                method: 'eth_requestAccounts',
               
            })
            .then((result) => {
                dispatch(changeMaskAddress(result[0]));
                console.log(maskAddress);
            })
            .catch((error) => {
                console.log(error);
            });
            
          }
    }

    return (
        <div >
            <Button variant="contained" size="large" onClick={MaskClick} >Connect to MetaMask</Button>
        </div>
    );
}