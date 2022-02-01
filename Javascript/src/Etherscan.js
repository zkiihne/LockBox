import { BigNumber } from "ethers";
import {globals} from "./global.js"
const api_key = globals.etherscan_api_key;
const chain = "ETH";
const base_call_tatum = "https://api-us-west1.tatum.io/v3/multitoken/transaction/" + chain
const base_call_etherscan = "https://api-ropsten.etherscan.io";
export async function detectKeys(keyAddress, maskAddress) {
    // find all keys associated with an address
    console.log(keyAddress +" " + maskAddress)
    // let base_call = "https://api-ropsten.etherscan.io"
    // let call = base_call + "/api?module=account&action=tokenerc1155tx&contractaddress=" + "0x4C82C05029AC2C61BaCFB841024DE78B7E700A77" + "&address=" +  maskAddress+ "&apikey=" + api_key
    
    // let call = base_call_tatum + chain + "/" + maskAddress + "/" + keyAddress + "?pageSize=50"
    let call = base_call_tatum + "/" + maskAddress + "/" + keyAddress + "?pageSize=50"

    // let call = base_call_tatum + chain + "/" + maskAddress + "/" + keyAddress + "?pageSize=10&offset=0&from=0&to=9999999"
    console.log(call);
    // let call = base_call + "/api?module=account&action=txlist&address=" + maskAddress + "&startblock=0&endblock=99999999&sort=asc&apikey=" + api_key
   
    var keys = [];
    let data = await makeCallTatum(call);
    console.log(data);
    data.forEach(element => {
        let formattedID = formatID(element.tokenId);
        console.log(formattedID)
        formattedID = BigNumber.from(formattedID);
        console.log(formattedID)
        keys.push({"address" : formattedID._hex})
    });

    return keys;
}

async function getBoxEther(lockboxAddress){

    let call = base_call_etherscan + "/api?module=account&action=balance&tag=latest" + "&address=" +  lockboxAddress + "&apikey=" + api_key
    let data = await makeCall(call);
    return ["ETH" ,data];
}

 async function getBoxERC20(lockboxAddress){
   
            let call = base_call_etherscan + "/api?module=account&action=tokentx" + "&address=" +  lockboxAddress + "&apikey=" + api_key
            let data = await makeCall(call);
            return ["ERC20" , data.result];
        
}

 async function getBoxERC721(lockboxAddress){
    
            let call = base_call_etherscan + "/api?module=account&action=tokennfttx" + "&address=" +  lockboxAddress + "&apikey=" + api_key
            let data = await makeCall(call);
            return ["ERC721" , data.result];

}

async function getBoxERC1155(lockboxAddress){

}


function netPosition(transactionList){
    let map = {}
    transactionList.forEach(element => {
        let coin = element.contractAddress;
        if(map[coin] != undefined){
            map[coin].amount += element.amount;
        }
        else{
            map[coin] = element
        }
    });
    var array = [];

    for (const value in map) {
        array.push(map[value]);
    }
    console.log(array);
    return array;
}

export async function getBoxContents2(lockboxAddress) {
    let contents = [];
    // let potentialContents = [getBoxEther, getBoxERC20, getBoxERC721, getBoxERC1155];
    let potentialContents = [getBoxEther, getBoxERC721, getBoxERC20];
    lockboxAddress = "0xEbEdeef778d98695CF427ec0d37AEbe6ee8dE927";
    for( const element of potentialContents){
        element(lockboxAddress).then((data) =>{
            let proccessedTokens = proccessTokens(data, lockboxAddress);
            contents.push(...proccessedTokens);
        })
    }
    contents = netPosition(contents);
    console.log("contents after net " + contents);
    return contents;
}

export async function getBoxContents(lockboxAddress) {
    let contents = [];
    let potentialContents = [getBoxEther, getBoxERC721, getBoxERC20];
    let promises = [];
    // lockboxAddress = "0xEbEdeef778d98695CF427ec0d37AEbe6ee8dE927";
    for( const element of potentialContents){
       promises.push(element(lockboxAddress));
    }
    return Promise.all(promises).then((values) =>{
        values.forEach(element => {
            console.log(element);
            let proccessedTokens = proccessTokens(element, lockboxAddress);
            contents.push(...proccessedTokens);
        });
        contents = netPosition(contents);
        return contents;
    })
}

function proccessTokens(data, fromAddress){
    let type = data[0];
    let initialData = data[1];
    let contents = [];
    if(type == "ETH"){
        console.log(initialData);
        let point = {};
        point.type = type;
        point.contractAddress = "NA";
        point.tokenName = "Ethereum";
        point.tokenSymbol = "ETH";
        point.amount = parseInt(initialData.result)/1000000000000000000.0;
        console.log("ETH amount " + point.amount);
        contents.push(point);
    }
    else{
        initialData.forEach(element => {
            let point = {};
            point.type = type;
            point.contractAddress = element.contractAddress;
            point.tokenName = element.tokenName;
            point.tokenSymbol = element.tokenSymbol;
            if(type == "ERC721"){
                point.tokenID = element.tokenID;
            }

            let amount = 0;
            if(type == "ERC20"){
                amount = element.value;
            }
            else if(type == "ERC721"){
                amount = 1;
            }
            let sign = 1;
            if(element.from == fromAddress){
                sign = -1;
            }
            point.amount = amount*sign;
            contents.push(point);
        });
    }

    return contents;

}

async function makeCallTatum(url){

    const response = await fetch(url, {headers: {'x-api-key': '75f3f279-7248-4b8f-a4b3-3ab29ab3d584', 'x-testnet-type':'ethereum-kovan'}}); 
    let data = await response.json();
    
    return data;
}

async function  makeCall(url){
    console.log("call:" + url);
    const response = await fetch(url); 
    let data = await response.json();
    
    return data;
}

// *.******e+## -> ********* with 0s appended if the original ended in a 0
function formatID(ID){
    ID = ID.slice(0,1) + ID.slice(2);
    var tail = ID.slice(-4);
    ID = ID.slice(0, ID.length - 4);
    tail = tail.slice(2)
    return ID;
}



function dec2hex(i)
{
  var result = "0000";
  if      (i >= 0    && i <= 15)    { result = "000" + i.toString(16); }
  else if (i >= 16   && i <= 255)   { result = "00"  + i.toString(16); }
  else if (i >= 256  && i <= 4095)  { result = "0"   + i.toString(16); }
  else if (i >= 4096 && i <= 65535) { result =         i.toString(16); }
  return result
}