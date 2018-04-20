# CarChain
IoT means so many things,they can't rely on single Architecture.  
CarChain uses big data technology combined with blockchain to provide a decentralized solution for car network

# Client
## IoT & IoC-internet of cars
物联网设备端是主要的数据生产方，比如车机数据，车主手机端APP数据。

* 生产方数据采用RSA加密，设备初始化时链接网络，VID是设备的编码
* 从认证手机钱包端获取公钥，并将其产生的数据加密传输到存储网络里
* 数据交易使用ECC加密签名，所以数据权地址用比特币的address
* 数据哈希dHash验证也传到公开网络，以便数据授权的时候验证
```
setup(VID, BTCaddress, RSApubKey,agent)			#远程初始化
  {check ownership
   create transaction with address
   sync with blockchain}
setDup(VID, BTCaddress, RSApubKey)			#克隆多个虚拟地址保护隐私
  {return addresses
   sync with user wallet}
reset(VID, BTCpubKey, BTCaddress, BTCsign,agent)	#远程重置，需要验证上一次的公钥和私钥签名
```
数据上报根据 address+key上报到区块链认证（不重复），value加密后放在KVS集群
* 数据格式可以选择性公开
	- 默认标准一般根据Key和ID的名称可以直接判断，具体编码细节在解码后的value里
	- 自定义标准的建议在put参数里携带format信息
* 代理模式： 品牌方自建代理网络，或者从原本局域网改造
* 订阅通道：由钱包授权的同步订阅通道，可以同时受到用通道公钥加密的数据
  - 通道可以只存在一个，订阅用户用类似IOTA的sideKey解码
* 地址池： 为了加强隐私，同一辆车(VID)可以和用户约定一组地址池
  - 常见选池方式可以用日期+用户共用seed（仅双方知道，不公开）来随机抽样
  - userSeed可以简单的从pubKey或者prvKey变换而来
  - 这样取数据时也可以从数据日期反推出address地址
```
putIotKV(randomFrom(BTCaddresses, date, userSeed), RSApubKey, agentNode, hashFunc, format
		, key= {"SESSION_ID":1, "START_TIME":20160511071428, "END_TIME":20160511094623}
		, value={"len":10,"GPS":[{"lat":31.250885,"lng":121.44662},{"lat":31.251259,"lng":121.4456},{"lat":31.25419,"lng":121.485504},{"lat":31.268875,"lng":121.59015},{"lat":31.29777,"lng":121.61309},{"lat":31.298483,"lng":121.6138},{"lat":31.297743,"lng":121.614525},{"lat":31.194258,"lng":121.74957},{"lat":31.195974,"lng":121.75078},{"lat":31.115866,"lng":121.77829}],"SPEED":"0,23,52,45,51,33,49,49,48,37","VEHICLE_DATA":1,"format"="trip-gps"}
		, dHash="...")

putIotKV(randomFrom(BTCaddresses, date, userSeed), RSApubKey, agentNode, hashFunc, format
		, key= {"CARVIO_ID":1}
		, value={"format":"carvio", "VEHICLE_DATA":1, "datetime":20180310,"loc":{"lat":31.250885,"lng":121.44662},"viotype":"vioparking","price":200,"point":0}
		, dHash="...")
```


## User Wallet
自然人用户注册设备钱包，在端侧生成seed，发送公钥给IoT设备来管理认证(远程setup)  
维护的秘钥包括： 
* ECC的秘钥对
  - 私钥用来签名交易
  - 公钥用来验证收货
  - addresses地址池由公钥哈希取得，是对外的收货地址，可以生成多个
    - address Seed，由公钥或者私钥变化而来
* RSA的秘钥对
	- 私钥用来解码数据
	- 公钥用来发送给IoT设备，加密数据

其他个人信息数据也用类似方式授权，直接从钱包端上传。这里必须上传数据格式，因为钱包端数据类型较多，而且支持手工编辑。
```
putWalKV(BTCaddress, RSApubKey, format="VIN_CODE", hashFunc
		,key={"VEHICLE_DATA":1}, value={"VIN":"LBVNU79049SB81546", dHash)
```
在服务端请求数据使用时，也从钱包设备发起确认。所以有两个管理列表：

1. 设备列表
  - 拥有密钥对的设备，以及对这些设备的设置或重置操作
    - 每个设备会随机多个地址池上报数据，上报地址池和VID对应在钱包端储存
    - 取单个数据时，根据数据生成时间，可以推演出地址池中的具体地址
    - get到的value中一般也有VID信息，解码后可以二次校验
  - 设备当前在线状态，不论是否在线都可以通过address和Key从KVS查询到密文数据段
  - ```
    getKV(deductFrom(BTCaddresses, date, userSeed), RSAprvKey, hashFunc, format="trip-gps"
    , key={"SESSION_ID":1, "START_TIME":20160511071428, "END_TIME":20160511094623}
    , columns=["VEHICLE_DATA", "GPS", "SPEED"])
    ```
  - 也可以拉取批量数据
  - ```
      getKVRange(deductFrom(BTCaddresses, date, userSeed), RSAprvKey, hashFunc, format="trip-gps"
      , start={"SESSION_ID":1, "START_TIME":20160511071428, "END_TIME":20160511094623}
      , end={"SESSION_ID":1, "START_TIME":20160511071428, "END_TIME":"INF_MAX"}
      , columns=["VEHICLE_DATA", "GPS", "SPEED"])
      ```
2. 数据授权列表
  - 数据所有权交易，一般卖方所有权也保留，买方可以二次交易
    - A先按照比特币协议签名和认证pubKey，然后用RSA私钥解码，经过dHashA确认是当时的数据，再用B的RSA公钥加密，授权到B的address
    - ```
      send(BTCaddressA, BTCpubKeyA, BTCsignA, RSAprvKeyA, dHashA, BTCaddressB, RSApubKeyB, resell=TRUE, dup=TRUE)
      ```
  - 数据使用权交易
    - 基于智能合约的撮合交易，原始数据不泄露，EVM返回计算结果

    - 也需要双方的address以及RSA秘钥来加密接收计算结果

    - ```
      SMcontract(BTCaddressA, BTCpubKeyA, BTCsignA, RSAprvKeyA, dHashA, BTCaddressB, RSApubKeyB, smartContract...)
      ```
  - 带金额的数据交易智能合约
    - 协议发起方式比较类似
    - 但是协议执行过程比较复杂，在区块链/交易板块详述

# Currency
没有ICO，代币与数据紧密联系，但也留给社区运作和激励的空间
### 第一阶段 50%代币自动发放
* 每个IoT节点或者初始代币，以支持启动交易
* 代币随着数据的产生而产生，数据生产方按照数据量支付给数据存储和计算方（矿工）
  * 按照数据量或者按照里程量
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
KVS (key value storage network)，类似HBase，可以用很低的成本获得大量储存空间。数据字典表nameNode存放在主链里面，这样降低储存成本，又保证了数据安全和私密。当出现不一致的时候，要主网络进行判断和修正。数据的存储有手续费，但是共享模式下可以减免。

DataNode数据块有几种管理方式：
* HDFS多重备份
	- 部分去中心化，效率高，经济实惠，但抗恶意节点的能力弱
* FileCoin的PoRep and PoSt
	- 完全去中心化的IPFS，但是需要证明者和验证者的冗余工作来保证存储有效

Address作为分块键，数据的读取按照遍历address的数量计费。用户可以快速查找行程列表，而他人遍历成本过高

* 用户通过和设备协商的地址池，可以按天遍历行程
	- 也就是按反推的address地址，遍历每个分块的key
	- 成本只有一次address的费用
* 其他人无法预知address的选取方式，遍历成本会很高
  - 比如要遍历某一天的所有行程，等于要遍历所有address
  - 当地址池足够大，车辆数足够多，这个遍历可能要10亿次循环(1000个地址池，100万辆车)，导致成本过高
  - 即使通过ip等方式关联了这1000个地址池，因为没有日期对应的seed，所以还是要付出1000倍的成本

## Block Chain
### 交易机制
第一阶段是基本的代币生成和转移交易：
* 中央储备给IoT设备充值，无法交易，只能支付手续费
* IoT设备生成数据，put到网络并支付手续费
* 基本应用从网络get数据（做展示）并支付手续费

第二阶段做类似hyperledger的交易撮合，这里涉及到下单，消息通道，状态记录等等问题。为防止交易双方的恶意行为，使用[zkSNARKs](https://media.consensys.net/introduction-to-zksnarks-with-examples-3283b554fc3b)让矿工进行Zero-Knowledge Proofs在不泄露原始数据的情况下，验证数据准确性
1. 交易金额由双方确认，共同签名，以确认交易意愿
  - 数据提供方A，接收方和资金提供方B
  - 启动智能合约，B的资金转移到合约地址下，并根据下面验证流程进行自动分配
2. 输出方A提供原文RSA加密给B，由接收方B通过dHash确认，并签名
  - 如果签名成功，执行资金转移
  - 如果B不承认接收，可能A没给，也可能B收到了不承认，就需要A和矿工C先进行zk proof(RSA应该不需要验证)
  - C创建验证数据对，A计算dHash的prf值，C验证prf
    - 如果C验证失败，说明A没有数据，交易终止，B资金退回
    - 如果C验证成功，说明A确实拥有原文，A再一次传递数据给B
    - 如果B仍然没收到，C投票选择中间节点验证原文，执行资金操作
      - 这里A没有作恶动机，因为资金已经确认，如果要反悔交易应该在数据传递之前反悔
      - 这里B没有作恶动机，因为资金会被强制转移，如果数据通过C中间节点泄露，对B的采购价值有折损，除非B报复性采购并公开数据。但这也有更加简单直接的做法。
3. B把接收的RSA加密数据提交到KVS网络
  - C区块链确保dHash一致
  - B自己会保证密文结果一致，否则该数据他也无法使用

### 共识机制
基于POS proof of stake的网络，也需要进一步上层改造以提升算力和加速交易验证。
* sharding 分组式共识，用于数据上报
	- 在数据上报这种不需要回溯所有历史的事件类型里，Loi Luu的sharding方案是可行的
* IOTA 的DAG 排队式共识，用户数据交易
	- 任然需要每个节点都储存全量交易历史
	- 懒惰节点的处理要再研究，很多车辆会长时间不在线或者网络连接不好

### 执行机制
EVM虚拟机可执行服务商代码进行用户数据计算，效率也需要提升
* sharding 分组执行
* spark 算法分布式

匿名方面可以用secureMPC，最简单的方法就是Circuit Computation，把数据拆分计算然后合并，这样每个单一计算方无法拿到全局数据。同时为了避免作恶，需要Zero Knowledge Proof进行验证

## Agency
代理人节点肩负三个功能：
* 代理数据授权(由用户选择)
* 账本全节点
* KVS共享储存
  * 私有模式只储存代理用户的数据，但是也保证多重备份
  * 共享模式可以储存全网数据，有激励

# Service Provider
## Platform
服务商平台也类似钱包机制，可以注册多个智能合约地址，包括了一个钱包地址，和可以在EVM运行的二进制代码。
* 如果用户方发起需求，直接支付到该账号，关联上数据在EVM执行
* 如果服务方发起或者双方撮合，可以服务商支付到自己的地址，同时请求用户的数据授权
* 交易确认后在区块链网络里执行

## Auditor
用户端的数据，只有用户有全貌，在给服务商提供数据时存在数据完整性的问题，所以需要有审核方。数据交易的ledger经过数据提供方，和数据审核方的二次确认，方可完成
* 轨迹数据是分散在多个address的，所以在服务方使用前，需要核实累计里程
* 违章数据是从交警系统里获得的，可以验证MD5
* 出险和维修数据在保险公司
* 维修保养在4S店，但是个体维修点很可能无法核实

## Application
### Wallet 应用包
钱包端可以直接解码单条数据，所以可以方便的做轨迹展示

### App as A Service
* UBI
* 二手车估值
