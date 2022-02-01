pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract erc20 is ERC20 {
    constructor() ERC20("simple erc20 token", "SIMP3") {
        _mint(msg.sender, 10);
    }
}

contract erc721 is ERC721 {
    constructor() ERC721("simple erc721 token", "SIMP3NFT") {
        _mint(msg.sender, 1);
    }
}
