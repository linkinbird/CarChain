# CarChain
IoT means so many things,they can't rely on single Architecture.  
CarChain uses big data technology combined with blockchain to provide a decentralized solution for car network

# Client
## IoT & IoC-internet of cars
物联网设备端是主要的数据生产方，比如车机数据，车主手机端APP数据。  
设备初始化时链接网络，从认证手机钱包端获取公钥，并将其产生的数据加密传输到存储网络里。

## User Wallet
自然人用户注册设备钱包，在端侧生成seed，发送公钥给IoT设备来管理认证，也包括其他个人信息数据的授权。  
在服务端请求数据使用时，从钱包设备发起确认

# Currency
代币随着数据的产生而产生，设备共享储存，在消耗代币的同时获得代币，达到平衡  
* 个人用户无成本使用，大额消耗额外支付
* 开发者提供存储和计算获得额外代币
* 服务商使用用户数据也支付代币
  - 最后用户支付使用TP服务时，价值还是在用户和商家间交换

# Network
## Storage Network
KVS (key value storage network)，类似HBase，可以用很低的成本获得大量储存空间。  
数据字典表nameNode存放在主链里面，这样降低储存成本，又保证了数据安全和私密。当出现不一致的时候，要主网络进行判断和修正

## Block Chain
基于POS proof of stake的网络，节约算力以加速交易验证。  
EVM虚拟机可执行服务商代码进行用户数据计算

# Service Provider
## Platform
服务商平台也类似钱包机制，可以注册多个智能合约地址，包括了一个钱包地址，和可以在EVM运行的二进制代码。  
* 如果用户方发起需求，直接支付到该账号，关联上数据在EVM执行
* 如果服务方发起或者双方撮合，可以服务商支付到自己的地址，同时请求用户的数据授权
* 交易确认后在区块链网络里执行

## application
* 轨迹分析
* UBI
* 二手车估值
