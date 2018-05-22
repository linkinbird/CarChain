pragma solidity ^0.4.20;


import './IERC721Metadata.sol';
import './AssetRegistryStorage.sol';

contract ERC721Metadata is AssetRegistryStorage, IERC721Metadata {
  function name() external view returns (string) {
    return _name;
  }
  function symbol() external view returns (string) {
    return _symbol;
  }
  function description() external view returns (string) {
    return _description;
  }
  function tokenMetadata(bytes32 assetId) external view returns (string) {
    return _assetData[assetId];
  }
  function _update(bytes32 assetId, string data) internal {
    _assetData[assetId] = data;
  }
}
