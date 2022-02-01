pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Key is ERC1155 {

    event KeyCreated(uint256 keyId);

    constructor() ERC1155("") {
    }

    function mint(address receiver) public {
        uint256 tokenId = address_to_int(address(msg.sender));
        _mint(receiver,  tokenId, 1, "");
        emit KeyCreated(tokenId);
    }

    function address_to_int(address a) public pure returns (uint256) {
        return uint256(uint160(a));
    }
}
