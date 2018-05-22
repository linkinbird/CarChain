const  _ = require('lodash');
const util = require('util');
const Helper = require('./Helper').Helper;
const validator = require('validator');
const NodeRSA = require('node-rsa');
const ContractByWallet = require('../contractapi/ContractByWallet')
const webWallet= require('../contractapi/libs/web-wallet')
const contractAbi=require('../contractapi/contractAbi.json')
console.log(contractAbi)

const MongodbApi = require('../database/db.js').MongodbApi;

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({
        port: 8101, //监听接口
        verifyClient: socketVerify //可选，验证连接函数
    });

function socketVerify(info) {
    console.log("=====socketVerify1=========");
    console.log(info.origin);
    console.log(info.req.t);
    console.log(info.secure);
    console.log("=====socketVerify2=========");
    return true; //否则拒绝
}

wss.broadcast = function broadcast(msg) {
    wss.clients.forEach(function each(client) {
        client.send(msg);
    });
};

wss.on('connection', function(ws) {
    console.log("WebSocketServer accept connection");
    ws.send('Welcome From WebSocketServer');

    ws.on('message', function(jsonStr,flags) {
        console.log("<<<message")
        console.log(jsonStr);
    });
    // 退出聊天
    ws.on('close', function(close) {
        console.log('<<<close')
    });
});



const UNKNOWN_STATUS=0;
const INIT_STATUS=1;
const START_STATUS=2;
const STOP_STATUS=3;
const CARBOX_DUMPFILE='carbox.json';

function statusStr( status ) {
    if(status==UNKNOWN_STATUS){
        return "Not initialized";
    }
    if(status==INIT_STATUS){
        return "Initialized";
    }
    if(status==START_STATUS){
        return "In Service,It's running";
    }
    if(status==STOP_STATUS){
        return "Out of Service,It's stopped";
    }
}



function myintervalfunc( instance ) {

    instance.collectData();
}

//-------------------------------------------------------
//定义车载盒子的类
//-------------------------------------------------------
class CarBox{

    /*
    * @vehicleId 定义一辆车的唯一标识，应该由盒子通过汽车接口读取到
    * */
    constructor(vehicleId,chasisNumber,engineNumber,makerName,manufactuingYear){
        this.setCarInfo( vehicleId,chasisNumber,engineNumber,makerName,manufactuingYear);
        // this.registerNumber="";
        this.seed="";
        this.rsaPubKey="";
        this.addresses=[];
        this.status=INIT_STATUS;
        this.myinterval=null;
        this.pin="123456";
        this.restoreJson();
        this.boxName="ChelunBox";
        this.boxVersion="1";
        this.boxYmd='20180501';
        this.addressCount=1;
        this.lasterror="";
    }

    getLastError(){
        return this.lasterror;
    }


    getBoxInfo(){
        return {
           'boxName':this.boxName,
            'boxVersion':this.boxVersion,
            'boxYmd':this.boxYmd,
            'addressCount':this.addressCount
        };
    }



    dump2Json(){
        const data={
            'carinfo':this.getCarInfo(),
            'storeinfo':this.getStoreInfo(),
            'pin':this.pin,
            'status':this.status,
            'time':Date.now()
        }
        require('fs').writeFileSync( CARBOX_DUMPFILE, JSON.stringify(data) );
    }

    restoreJson(){
        const fs=require('fs');
        if ( ! fs.existsSync(CARBOX_DUMPFILE)){
            console.log("cannot find file:"+CARBOX_DUMPFILE );
            return;
        }

        const jstr=fs.readFileSync( CARBOX_DUMPFILE).toString();
        if(!  validator.isJSON(jstr ) ){
            console.log("invalidjson:"+jstr );
            return;
        }

        let jobj = JSON.parse(jstr);
        if( UNKNOWN_STATUS != jobj['status']){
            jobj['status']=INIT_STATUS;
        }

        const carinfo = jobj.carinfo;
        if(undefined==carinfo  ){
            console.log("carinfo miss;invalidjson:"+jstr );
            return;
        }

        const storeinfo = jobj.storeinfo;
        if(undefined==storeinfo ){
            console.log("storeinfo miss;invalidjson:"+jstr );
            return;
        }

        this.setCarInfo(carinfo.vehicleId,carinfo.chasisNumber,carinfo.engineNumber,carinfo.makerName,carinfo.manufactuingYear);
        this.setStoreInfo(storeinfo.seed,storeinfo.rsaPubKey,storeinfo.addresses);
        this.status=jobj['status'];
        this.pin=jobj['pin'];
        console.log("restoreJson ok");
        console.log(this.getCarInfo());
        console.log(this.getStoreInfo());
    }

    getCarInfo(){
        return {
            'vehicleId':this.vehicleId,
            'chasisNumber': this.chasisNumber,
            "engineNumber":this.engineNumber,
            'makerName':this.makerName,
            'manufactuingYear':this.manufactuingYear,
        };
    }

    setCarInfo(vehicleId,chasisNumber,engineNumber,makerName,manufactuingYear){
        this.vehicleId = vehicleId;
        this.chasisNumber = chasisNumber;
        this.engineNumber = engineNumber;
        this.makerName = makerName;
        this.manufactuingYear=manufactuingYear;
    }

    getStoreInfo(){
        return {
            'rsaPubKey':this.rsaPubKey,
            'addresses': this.addresses
        };
    }

    setStoreInfo(seed,rsaPubKey,addresses){
        this.seed=seed;
        this.rsaPubKey=rsaPubKey;
        this.addresses=addresses;
        if(this.status==UNKNOWN_STATUS){
            this.status=INIT_STATUS;
        }
    }

    isStart(){
        return this.status == START_STATUS;
    }

    start(){
        console.log("start()");
        if( this.isStart() ){
            this.lasterror="has already started";
            return false;
        }

        if( this.seed==undefined || validator.isEmpty( this.seed) ){
            this.lasterror="seed is invalid";
            return false;
        }

        if( ! this.checkAddressesValid( this.addresses )){
            this.lasterror="addresses is invalid";
            return false;
        }

        this.status = START_STATUS;
        this.sessionid=0;
        this.data=null;
        this.collectid=0;
        this.lasterror="";
        this.myinterval=setInterval(myintervalfunc,10000,this);
        return true;
    }

    stop(){
        console.log("stop()");
        if( ! this.isStart() ){
            return ;
        }
        this.lasterror="";
        this.status = STOP_STATUS;
        if(this.myinterval != null){
            clearTimeout(this.myinterval);
            this.myinterval=null;
        }
    }

    collectData() {
        console.log("-------------collectData--------------");
        if (this.data == null) {
            this.data = {
                vin:this.vehicleId,
                sessionid: this.sessionid + 1,
                start_time: Math.round(Date.now() / 1000),
                end_time: 0,
                gps: [],
                format: 'trip-gps',
                speed: [],
            };
            return;
        }
        this.collectid += 1;
        this.data.end_time = Math.round(Date.now() / 1000);
        this.data.gps.push({lat: Helper.mocGps(),lng: Helper.mocGps() });
        this.data.speed.push(Helper.mocSpeed());
        if( this.collectid%1 == 0 ){
            this.reportData();
        }

        if(this.data != null){
            const tmpdata=JSON.stringify( this.data );
            wss.broadcast(tmpdata);
        }

    }

    reportData(){
        console.log( JSON.stringify(this.data) );
        this.saveAndRegister2Chain();
        this.resetCollect();
    }

    resetCollect(){
        this.sessionid=this.data.sessionid;
        this.data=null;
    }

    saveAndRegister2Chain(){
        //通过(vin,ymd,seed)计算出一个(address)
        const ymd = Helper.getYmd(  this.data.start_time * 1000 );
        const longseed=util.format('%s%s%s',this.data.vin ,ymd,this.seed);
        const uintseed=Helper.str2uint(longseed);
        const addressindex=uintseed%this.addressCount;
        const address=this.addresses[addressindex];
        console.log("longseed:%s uintseed:%d addressindex:%d address:%s",longseed,uintseed,addressindex,address);

        //vin唯一标识一辆车，vin的数据被分散到不同的address对应的collection里,即collectionName=address
        // 此刻<start_time,end_time,sessionid>采集的数据,应该存储到刚刚计算出来的collection
        const storageKey={
            'start_time':this.data.start_time,
            'end_time': this.data.end_time,
            'sessionid': this.data.sessionid
        };

        //计算数据的md5
        const datastr = JSON.stringify( this.data );
        const datahash = Helper.str2md5( datastr);

        //使用该设备的公钥加密数据然后做存储
        const rsa = new NodeRSA();
        rsa.importKey( this.rsaPubKey);
        const encValue = rsa.encrypt(datastr, 'base64');
        console.log('encrypted: ', encValue);

        webWallet.restoreFromWif("cTcTUhCHjvbMr7J1kFFUQwhk14TA5LKwrxzAB9CFN8Qq7R198q2W");
        const senderAddress = webWallet.getWallet().getAddress();
        console.log("saveAndRegister2Chain use:",senderAddress)

        const collection = "box"+  senderAddress;
        console.log(collection);
        if ( ! this.putKv(collection,storageKey,encValue)){
            return;
        }

        //存储成功之后，开始上链，
        const asset={
            'storageKey':storageKey,
            'datahash':datahash
        };
        this.registerAsset(address,asset);
    }

    putKv(   collection,key, encValue){
        // const internelkey= util.format('%s-%s-%s',
        //     this.data.start_time,
        //     this.data.end_time,
        //     this.data.sessionid);
        MongodbApi.saveCarboxData( collection,key,encValue);
        console.log("putKv=>collection:%s internelkey:%s,encValue:%s",collection,JSON.stringify(key),encValue);
        return true;
    }

    registerAsset( address, asset){
        console.log("registerAsset=> address:%s asset:%s",address,JSON.stringify(asset ))

        webWallet.restoreFromWif("cTcTUhCHjvbMr7J1kFFUQwhk14TA5LKwrxzAB9CFN8Qq7R198q2W");
        const contractAddress="6af6c3678ec3936f1bb52f6376eaf27fe9f24842";

        const senderAddress = webWallet.getWallet().getAddress();
        console.log("registerAsset use:",senderAddress)
        // const senderHexAddress = Encoder.addressToHexAddress(senderAddress);
        // console.log(senderHexAddress)

        var contract = new ContractByWallet(contractAddress,contractAbi);
        contract.send("takeOwnershipOfDrivingData",[ JSON.stringify(asset) ])
    }

    getCollectInfo(){
        return {
            "status":this.queryStatus(),
            "collectid":this.collectid,
            "sessionid":this.sessionid,
            "data":this.data
        };
    }


    queryStatus(){
        return  statusStr(this.status);
    }

    checkPin(pin){
        return pin==this.pin;
    }

    checkAddressesValid(addresses){
        // if( this.addressCount<0 ||  addresses.length < this.addressCount ){
        //     console.log("checkAddressesValid;failed;addresses.length:%d < addressCount:%d",addresses.length ,this.addressCount);
        //     return false;
        // }
        return true;
    }

}


const DEFAULT_VEHICLEID='00A500DD013701421';
const DEFAULT_CHASISNUMBER=DEFAULT_VEHICLEID;
const DEFAULT_ENGINENUMBER='701421';
const DEFAULT_MAKERNAME='BENCHI';
const DEFAULT_MANUFACTUINGYEAR='2017';

module.exports = {
    CARBOX : new CarBox(DEFAULT_VEHICLEID,DEFAULT_CHASISNUMBER,DEFAULT_ENGINENUMBER,DEFAULT_MAKERNAME,DEFAULT_MANUFACTUINGYEAR),
}


async  function  main() {

    // webWallet.restoreFromWif("cQxknbfVX5kEqC8ZEZbUCrmzU2iQz2bigeQc7UhmoSPskm8LBRkC");
    // const contractAddress="51667f06e7b72272d6721967e4afe6508dd45553";
    // const senderAddress = webWallet.getWallet().getAddress();
    // // const senderHexAddress = Encoder.addressToHexAddress(senderAddress);
    // // console.log(senderHexAddress)
    //
    // var c = new ContractByWallet(contractAddress,contractAbi);
    // var r = await  c.call("getTestNumber")
    // console.log(r.toNumber())
    var CARBOX=new CarBox(DEFAULT_VEHICLEID,DEFAULT_CHASISNUMBER,DEFAULT_ENGINENUMBER,DEFAULT_MAKERNAME,DEFAULT_MANUFACTUINGYEAR);
    CARBOX.start();


}

// main()