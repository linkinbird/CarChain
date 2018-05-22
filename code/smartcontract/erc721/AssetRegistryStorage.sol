pragma solidity ^0.4.20;


contract AssetRegistryStorage {

  string internal _name;
  string internal _symbol;
  string internal _description;
  uint256 internal _testnumber;

  /**
   * Stores the total count of assets managed by this registry
   */
  uint256 internal _count;

  /**
   * Stores an array of assets owned by a given account
   */
  mapping(address => bytes32[]) internal _assetsOf;

  /**
   * Stores the current holder of an asset
   */
  mapping(bytes32 => address) internal _holderOf;

  /**
   * Stores the index of an asset in the `_assetsOf` array of its holder
   *   <asset,index>
   */
  mapping(bytes32 => uint256) internal _indexOfAsset;

  /**
   * Stores the data associated with an asset
   */
  mapping(bytes32 => string) internal _assetData;

  /**
   * For a given account, for a given operator, store whether that operator is
   * allowed to transfer and modify assets on behalf of them.
   */
  mapping(address => mapping(address => bool)) internal _operators;

  /**
   * Approval array
   */
  mapping(bytes32 => address) internal _approval;
}
