# CarChain
IoT means so many things,they can't rely on single Architecture.
CarChain uses big data technology combined with blockchain to provide a decentralized solution for car network

# Client
## IoT & IoC-internet of cars
物联网设备端是主要的数据生产方，比如车机数据，车主手机端APP数据。
设备初始化时链接网络，从认证手机钱包端获取公钥，并将其产生的数据加密传输到存储网络里。

远程设置
```
setup(VID, address, pubKey,agent)			#远程初始化
reset(VID, prvKey, address, pubKey,agent)		#远程重置，需要验证上一次的秘钥
```
数据上报，直接模式或者代理节点模式（局域网）
```
putKV(VID, address, targetNode, agent, format="trip-gps", hashFunc,
		key= "VID_TRIPGPS_20180301194800",
		value={"len":10,"gps":[{"lat":31.250885,"lng":121.44662},{"lat":31.251259,"lng":121.4456},{"lat":31.25419,"lng":121.485504},{"lat":31.268875,"lng":121.59015},{"lat":31.29777,"lng":121.61309},{"lat":31.298483,"lng":121.6138},{"lat":31.297743,"lng":121.614525},{"lat":31.194258,"lng":121.74957},{"lat":31.195974,"lng":121.75078},{"lat":31.115866,"lng":121.77829}]})

putKV(VID, address, targetNode, agent, format="carvio", hashFunc,
		key= "VID_VIO_20180301194800",
		value={"datetime":20180310,"viotype":"vioparking"}
```


## User Wallet
自然人用户注册设备钱包，在端侧生成seed，发送公钥给IoT设备来管理认证，也包括其他个人信息数据的授权。
在服务端请求数据使用时，从钱包设备发起确认

# Currency
没有ICO，代币与数据紧密联系，但也留给社区运作和激励的空间
### 第一阶段 50%代币
* 每个IoT节点或者初始代币，以支持启动交易
* 代币随着数据的产生而产生，数据生产方按照数据量支付给数据存储和计算方（矿工）
* 中央储备同时将等额的代币发到数据生产方账户，保持客户端账户平衡，而代币逐渐向服务方转移
* 50%额度发完为止

### 第二阶段 大额预取 30%
代理人模式的代理节点，按照贡献算力或者数据，批量获得一定代币，以鼓励大玩家加入
该阶段和第一阶段可同步进行，不冲突

###第三阶段 自由流通 20%
服务商开始大量进场，针对服务商销售代币，以激励服务流通
最终服务商完成服务后，用服务利润覆盖数据采购的代币成本
销售所得代币部分用作开发者社区激励

# Network
## Storage Network
KVS (key value storage network)，类似HBase，可以用很低的成本获得大量储存空间。
数据字典表nameNode存放在主链里面，这样降低储存成本，又保证了数据安全和私密。
当出现不一致的时候，要主网络进行判断和修正

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
