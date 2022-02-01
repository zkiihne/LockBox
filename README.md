# LockBox

This is the code for my LockBox site. I made it in order to practice web3 and Solidity. It consists of contracts on the ETH network as well as a React based site. 

The site is not yet deployed. Imagines of a locally run version can be found here:

https://imgur.com/a/xvn675P 

What is LockBox?

LockBox is a trustless system of keeping your assets locked away. When you create a LockBox you are given the Key token. Only the holder of this token can unlock the contract and receive the funds within. In addition boxes have a timer feature, meaning they cannot be unlocked for a certain time period, just like a trust fund.

Why should you use LockBox?

LockBoxs are a powerful tool to facilitate a variety of trustless exchanges, from trust funds and inheritence to escrow. Their smart contract nature allows for immutable and reliable exchanges, both now and forever.

How do I use LockBox?

First go to the LockBox Make page, add a name and how long you want it to be locked for, click create, confirm in metamask. After this your address will be displayed and you can send to the address of your LockBox. Your LockBoxes are located on the Keys page, to view their contents or to open them.

How does the Key work?

Each Key is an ERC1155 token with a token ID equal to the ID of the contract creating it. The Lockbox which created it then reads the holder of this key+id and will only open for them.


