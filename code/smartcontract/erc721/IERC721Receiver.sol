pragma solidity ^0.4.20;

interface IERC721Receiver {
  function onERC721Received(
    address _oldOwner,
    bytes32 _tokenId,
    bytes   _userData
  ) external returns (bytes4);
}
