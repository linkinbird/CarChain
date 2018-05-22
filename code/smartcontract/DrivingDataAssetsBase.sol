/**
    @author : zhangtao
    @github : github.com/changshoumeng
    @date : 2018/05/12
    @info :  基于区块链的车辆数据资产链，
                这里的数据资产举例是 汽车的行驶数据
                 A Vehicle Chain base on Block Chain

            本合约实现是基于ERC721标准

            查看本智能合约的接口，应该查看erc721/IERC721Base.sol 这类的文件
**/

pragma solidity ^0.4.20;

import './erc721/FullAssetRegistry.sol';

contract DrivingDataAssetsBase is FullAssetRegistry{

    function DrivingDataAssetsBase() public{

        _name = "DrivingDataAssetsChain";
        _symbol = "ddac";
        _description = "A Vehicle Chain base on Block Chain";
        _count=0;
        _testnumber=1;
    }

    function takeOwnershipOfDrivingData(string asset)external{
        bytes32 assetId = getDataAssetHash(asset);
        _generate(assetId,msg.sender);
        _update(assetId,asset);
    }

    function  getDataAssetHash(string asset) public pure returns (bytes32){
        return keccak256(asset);
    }

    /*
        快速测试接口，用于验证智能合约的部署或运行没问题
    */
    function setTestNumber(uint256 num)external {
        _testnumber=num;
        emit SetTestNumber(msg.data,num);
    }

    function  getTestNumber() public view returns (uint256){
        return _testnumber;
    }

    event SetTestNumber( bytes  msgdata, uint256  num);
}
