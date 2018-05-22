set -x
solc --optimize --bin --abi --hashes --allow-paths ./,./erc721 -o build --overwrite ./DrivingDataAssetsBase.sol
