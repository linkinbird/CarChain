pragma solidity ^0.4.20;

interface ERC165 {
  function supportsInterface(bytes4 interfaceID) external view returns (bool);
}
