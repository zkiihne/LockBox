import { ethers } from "ethers";
import {globals} from "./global.js"
import { ContractFactory } from 'ethers';
import lockabi from "./json/ERC1155.json";
import keyabi from "./json/keyabi.json";
import lockbox_byte_code from "./json/lockboxbyte.json"

import {getBoxContents, detectKeys} from "./Etherscan.js"
const example_key = globals.key_contract_address;

async function setup(){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();

    return {"signer": signer, "signerAddress": signerAddress, "provider": provider}
}

export async function getLockboxBalance(lockboxAddress) {
    return  getBoxContents(lockboxAddress);
}

// time in seconds
export async function makeLockbox(time, name) {
    console.log("timee " + time + " name " + name);
    let nt = parseInt((time - Date.now().valueOf())/1000);
    if (nt < 0) nt = 0;
    console.log("difff " + nt);
    let setupValues = await setup();
    // deploy lockbox contract
    const factory = new ContractFactory(lockabi, lockbox_byte_code, setupValues.signer);
    // If your contract requires constructor args, you can specify them here
    const contract = await factory.deploy(example_key, nt, name);
    // return address of new contract
    return contract.address;
}



export async function getLockboxApproval(lockboxContractAddress) {

    let setupValues = await setup();
    // approve lockbox for transfer
    const keyContract = new ethers.Contract(example_key, keyabi, setupValues.provider );
    const keyContractWithSigner = keyContract.connect(setupValues.signer);
    console.log("setting approval " + lockboxContractAddress + " " + setupValues.signerAddress);
    await keyContractWithSigner.setApprovalForAll(lockboxContractAddress, true);
    return true;
}



export async function liquidateContract( lockboxAddress, assets ){
    console.log("address to unlock " + lockboxAddress);
    // get list of valid assets
    console.log(assets);
    let formattedAssets = formatAssets(assets);
    console.log(formattedAssets)
    // call unlock, passing in assets
    let setupValues = await setup();
    const lockContract = new ethers.Contract(lockboxAddress, lockabi, setupValues.provider );

    const lockContractWithSigner = lockContract.connect(setupValues.signer);
    // send in assets with unlock, these are transfered to wallet then contract selfdestructs
    await lockContractWithSigner.unlock(formattedAssets[0], formattedAssets[1], formattedAssets[2]);

    return assets;
}

function formatAssets(assets){    
    let types = []
    let addresses = []
    let type1155 = []
    assets.forEach(element => {
        switch (element.type) {
            case "ERC20":
                types.push(20);
                addresses.push(element.contractAddress);
                type1155.push(0);
                break;
            case "ERC721":
                types.push(721);
                addresses.push(element.contractAddress);
                type1155.push(0);
                break;
             case "ERC1155":
                types.push(1155);
                addresses.push(element.contractAddress);
                type1155.push(0);
                break;
            default:
                break;
        }
    });
    let formattedAssets = [types, addresses, type1155]
    return formattedAssets;
}


export async function getKeys( maskAddress){
    let keys = await detectKeys(example_key, maskAddress);
    console.log(keys);
    return keys;
}

export async function getLockboxInfo( keyObject){
    // keyObject.contents = await getBoxContents(keyObject.address);
    let promises = [];
    for( const element of keyObject){
       promises.push(getBoxTimestamp(element.address));
    }
    return Promise.all(promises).then((values) =>{
        for(var i = 0; i < keyObject.length; i++){
            keyObject[i].timestamp = convertTimestampToDate(values[i][0]);
            keyObject[i].name = values[i][1];
        }
        return keyObject;
    })
}

async function getBoxTimestamp(lockboxAddress){

    let setupValues = await setup();
    // approve lockbox for transfer
    const lockContract = new ethers.Contract(lockboxAddress, lockabi, setupValues.provider );
    try{
        let timestamp = await lockContract.timer();
        let name = await lockContract.name();
        console.log(timestamp);
        console.log(name);
        return [timestamp, name];
    }
    catch(e){
        console.log(e);
    }
}

function convertTimestampToDate(timestamp){
    let formattedTime = getTimeObject(timestamp)
    console.log(formattedTime)
    return formattedTime;
}

// method to prettify timestamp
function getTimeObject(stamp){
    let now = Date.now();
    let difference = stamp*1000 - now;
    if(difference > 0){
        let years = Math.floor(difference / (1000 * 60 * 60 * 24* 365));
        let days = Math.floor(difference % (1000 * 60 * 60 * 24* 365) / (1000 * 60 * 60 * 24));
        let hours = Math.floor(difference % (1000 * 60 * 60 * 24)  / (1000 * 60 * 60));
        let minutes = Math.floor(difference % (1000 * 60 * 60)  / (1000 * 60));
        let returnString = "";
        returnString += "" + years + "y "
        returnString += "" + days + "d "
        returnString += "" + hours + "h "
        returnString += "" + minutes + "m "
        returnString += ""
        return returnString;
    }
    else{
        return 0;
    }
  }