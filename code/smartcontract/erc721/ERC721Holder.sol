pragma solidity ^0.4.20;


import './IERC721Receiver.sol';

contract ERC721Holder is IERC721Receiver {
  function onERC721Received(address /* oldOwner */, bytes32 /* tokenId */, bytes /* data */) external returns (bytes4) {
    return bytes4(0xf0b9e5ba);
  }
}
