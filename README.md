# CarChain
IoT means so many things,they can't rely on single Architecture.  
CarChain uses big data technology combined with blockchain to provide a decentralized solution for car network

# Client
## IoT & IoC-internet of cars
物联网设备端是主要的数据生产方，比如车机数据，车主手机端APP数据。  
设备初始化时链接网络，从认证手机钱包端获取公钥，并将其产生的数据加密传输到存储网络里。

远程设置，VID是设备的编码，绑定后自动生成address是区块链中的地址，可以1对多，加强隐私
```
setup(VID, address, pubKey,agent)			#远程初始化
  {check ownership
   create transaction with address
   sync with blockchain}
setDup(VID, pubKey)					#克隆多个虚拟地址保护隐私
  {return addresses
   sync with user wallet}
reset(VID, prvKey, address, pubKey,agent)		#远程重置，需要验证上一次的秘钥
```
数据上报，直接模式或者代理节点模式（局域网），key上报到区块链交易（address+key不重复），value加密后放在KVS集群。公开参数可以不包含format，通过key的ID名称判断数据类目，具体编码形式在value里，这样安全性高，但也可以包含format，易于管理
```
putIotKV(randomFrom(addresses), address, pubKey, targetNode, agent, hashFunc
		, key= {"SESSION_ID":1, "START_TIME":20160511071428, "END_TIME":20160511094623}
		, value={"len":10,"GPS":[{"lat":31.250885,"lng":121.44662},{"lat":31.251259,"lng":121.4456},{"lat":31.25419,"lng":121.485504},{"lat":31.268875,"lng":121.59015},{"lat":31.29777,"lng":121.61309},{"lat":31.298483,"lng":121.6138},{"lat":31.297743,"lng":121.614525},{"lat":31.194258,"lng":121.74957},{"lat":31.195974,"lng":121.75078},{"lat":31.115866,"lng":121.77829}],"SPEED":"0,23,52,45,51,33,49,49,48,37","VEHICLE_DATA":1,"format"="trip-gps"})

putIotKV(randomFrom(addresses), address, pubKey, targetNode, agent, hashFunc
		, key= {"CARVIO_ID":1}
		, value={"format":"carvio", "VEHICLE_DATA":1, "datetime":20180310,"loc":{"lat":31.250885,"lng":121.44662},"viotype":"vioparking","price":200,"point":0})
```


## User Wallet
自然人用户注册设备钱包，在端侧生成seed，发送公钥给IoT设备来管理认证(远程setup)  
其他个人信息数据也用类似方式授权，直接从钱包端上传。这里必须上传数据格式，因为钱包端数据类型较多，而且支持手工编辑。
```
putWalKV(address, pubKey, format="VIN_CODE", hashFunc
		,key={"VEHICLE_DATA":1}, value={"VIN":"LBVNU79049SB81546")
```
在服务端请求数据使用时，也从钱包设备发起确认。所以有两个管理列表：

1. 设备列表
  - 拥有密钥对的设备，以及对这些设备的设置或重置操作
    - 每个设备会随机多个地址上报数据，上报地址和VID的对应在钱包端储存
    - get到的value中一般也有VID信息，解码后可以二次校验
  - 设备当前在线状态，不论是否在线都可以通过address和Key从KVS查询到密文数据段
  - ```
    getKV(address, prvKey, hashFunc, format="trip-gps"
    , key={"SESSION_ID":1, "START_TIME":20160511071428, "END_TIME":20160511094623}
    , columns=["VEHICLE_DATA", "GPS", "SPEED"])
    ```
    - 也可以拉取批量数据
    - ```
      getKVRange(addresses, prvKey, hashFunc, format="trip-gps"
      , start={"SESSION_ID":1, "START_TIME":20160511071428, "END_TIME":20160511094623}
      , end={"SESSION_ID":1, "START_TIME":20160511071428, "END_TIME":"INF_MAX"}
      , columns=["VEHICLE_DATA", "GPS", "SPEED"])
      ```
2. 数据授权列表
  - 数据所有权交易，一般卖方所有权也保留，买方可以二次交易
    - ```
      send(addressA, prvKey, addressB, pubKey,resell=TRUE, dup=TRUE)
      ```
  - 数据使用权交易
    - 基于智能合约的撮合交易，原始数据不泄露，EVM返回计算结果
    - ```
      SMcontract(addressA, prvKey, pubKeyA, addressB, pubKeyB, smartContract...)
      ```



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

### 第三阶段 自由流通 20%
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

## Application
### Wallet 应用包
钱包端可以直接解码单条数据，所以可以方便的做轨迹展示

### App as A Service
* UBI
* 二手车估值
