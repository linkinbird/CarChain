pragma solidity ^0.4.20;


interface IERC721Base {
  function totalSupply() external view returns (uint256);

  function exists(bytes32 assetId) external view returns (bool);
  function ownerOf(bytes32 assetId) external view returns (address);

  function takeOwnership(bytes32 assetId) external;
  function balanceOf(address holder) external view returns (uint256);

  function safeTransferFrom(address from, address to, bytes32 assetId) external;
  function safeTransferFrom(address from, address to, bytes32 assetId, bytes userData) external;

  function transferFrom(address from, address to, bytes32 assetId) external;

  function approve(address operator, bytes32 assetId) external;
  function setApprovalForAll(address operator, bool authorized) external;

  function getApprovedAddress(bytes32 assetId) external view returns (address);
  function isApprovedForAll(address operator, address assetOwner) external view returns (bool);

  function isAuthorized(address operator, bytes32 assetId) external view returns (bool);

  event Transfer(
    address indexed from,
    address indexed to,
    bytes32 indexed assetId,
    address operator,
    bytes userData
  );
  event ApprovalForAll(
    address indexed operator,
    address indexed holder,
    bool authorized
  );
  event Approval(
    address indexed owner,
    address indexed operator,
    bytes32 indexed assetId
  );
}
