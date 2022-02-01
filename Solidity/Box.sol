pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract LockBox is ERC1155Holder {

    Key public mintingContract;
    uint256 public timer = 0;
    string public name = "";
    struct asset {
        address assetContractAddress;
        string typeOfAsset;
        uint256 type1155;
        uint256 quantity;

    }
    event EventLog(string toLog);
    event EventIntLog(uint256 toLog);
    event EventAddressLog(address toLog);
    // make key and send to creator of this contract
    constructor (address minter, uint time, string memory nm){
        name = nm;
        timer = block.timestamp + time;
        mintingContract = Key(minter);
        makeKey(address(msg.sender));        
    }


    function addToTimer(uint256 time) public {
        require(mintingContract.balanceOf( address(msg.sender), address_to_int(address(this))) == 1, "user not authorized");
        timer = timer + time;
    }

    // method to unlock with key, needs approval first
    function unlock(uint256[] calldata types, address[] calldata addresses, uint256[] calldata type1155) public {
        require(mintingContract.balanceOf( address(msg.sender), address_to_int(address(this))) == 1, "user not authorized");
        require( block.timestamp > timer, "timer still going");
        require(addresses.length == types.length , "length mismatch");
        require(addresses.length == type1155.length , "length mismatch");
        emit EventLog("starting unlock");
        for(uint256 i = 0; i < addresses.length; i++){
            sendTo(address(msg.sender), types[i], addresses[i], type1155[i]);
        }
        payable(address(msg.sender)).transfer(address(this).balance);
        emit EventLog("finished unlock");

    }

    // method to send token, agnostic of token type
    function sendTo(address recipient, uint256 typeOfToken, address contractAddress, uint256 type1155) internal {
        
        if(typeOfToken == 1155){
            ERC1155 tempContract = ERC1155(contractAddress);
            uint256 balance = tempContract.balanceOf(address(this) , type1155) ;
            if(balance > 0){
                emit EventIntLog(balance);
                emit EventAddressLog(contractAddress);
                
                tempContract.safeTransferFrom(address(this), recipient, type1155 , balance, "");
            }
            else{
                emit EventLog("insufficient balance");
            }
        }
        else if(typeOfToken == 20){
            ERC20 tempContract = ERC20(contractAddress);
            uint256 balance = tempContract.balanceOf(address(this)) ;
            if(balance > 0){
                emit EventIntLog(balance);
                emit EventAddressLog(contractAddress);
                tempContract.transfer( recipient , balance);
            }
            else{
                emit EventLog("insufficient balance");
            }
        }
        else if(typeOfToken == 721){
            ERC721 tempContract = ERC721(contractAddress);
            uint256 balance = tempContract.balanceOf(address(this)) ;
            if(balance > 0){
                emit EventIntLog(balance);
                emit EventAddressLog(contractAddress);
                tempContract.transferFrom(address(this), recipient , balance);
            }
            else{
                emit EventLog("insufficient balance");
            }
        }
        else{
            emit EventLog("unknown token type");

        }
    }

    // method to call minting contract
    function makeKey(address creator) internal {
        mintingContract.mint(creator);
    }
    // method to change address to u256 integer
    function address_to_int(address a) public pure returns (uint256) {
        return uint256(uint160(a));
    }
    // == for strings
    function compare_strings(string memory a, string memory b) internal returns(bool){
        return keccak256(bytes(a)) == keccak256(bytes(b));
    }

    fallback() external payable {}
}
