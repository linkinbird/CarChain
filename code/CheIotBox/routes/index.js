var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const validator = require('validator');
const qs = require('qs');

var urlencodedParser = bodyParser.urlencoded({ extended: false })
const Helper = require('../core/Helper.js').Helper;
const CARBOX = require('../core/CarBox.js').CARBOX;
const CAROWNER = require('../core/CarOwner.js').CAROWNER;
const MongodbApi = require('../database/db.js').MongodbApi;


router.get('/', function(req, res, next) {
  const result={"code":0,"msg":"welcome"};
  Helper.rspCliJson( res, result);
  MongodbApi.test();
});

router.get('/status', function(req, res, next) {
    const result={"code":0,
        "msg":"ok",
        'status':CARBOX.queryStatus(),

    };
    Helper.rspCliJson( res, result);
});

router.get('/carinfo', function(req, res, next) {
    const result={"code":0,
        "msg":"ok",
        'data':CARBOX.getCarInfo(),

    };
    Helper.rspCliJson( res, result);
});

router.get('/storeinfo', function(req, res, next) {
    const result={"code":0,
        "msg":"ok",
        'data':CARBOX.getStoreInfo(),

    };
    Helper.rspCliJson( res, result);
});

router.get('/userinfo', function(req, res, next) {
    const result={"code":0,
        "msg":"ok",
        'data':CAROWNER.getUserInfo()
    };
    Helper.rspCliJson( res, result);
});

router.get('/favicon.ico', function(req, res, next) {
    console.log("favicon.ico???")
    const result={"code":0,
        "msg":"ok",
        'data':"who are you"
    };
    Helper.rspCliJson( res, result);
});

router.get('/boxinfo', function(req, res, next) {
    const result={"code":0,
        "msg":"ok",
        'data':CARBOX.getBoxInfo()
    };
    Helper.rspCliJson( res, result);
});

router.get('/collectinfo', function(req, res, next) {
    const result={"code":0,
        "msg":"ok",
        'data':CARBOX.getCollectInfo()
    };
    Helper.rspCliJson( res, result);
});

router.post('/boxconnect', function(req, res) {
    console.log("boxconnect-----------------------------");
    const reqdata=qs.parse( req.body);
    console.log(reqdata);
    const {pin,userName}=reqdata;

    if( undefined==pin || validator.isEmpty(pin) ){
        Helper.rspCliJson( res,  { 'code':1,'msg':'pin is invalid' });
        return ;
    }

    if( undefined==userName || validator.isEmpty(userName) ){
        Helper.rspCliJson( res,  { 'code':1,'msg':'userName is invalid' });
        return ;
    }

    if( ! CARBOX.checkPin( pin )){
        Helper.rspCliJson( res,  { 'code':1,'msg':'checkPin failed' });
        return ;
    }

    const data={
        'carinfo':CARBOX.getCarInfo(),
        'actoken':Helper.allocToken(),
        'status':CARBOX.queryStatus(),
        'boxinfo':CARBOX.getBoxInfo(),
    };
    CAROWNER.setAccessToken(  data.actoken,userName );
    Helper.rspCliJson( res,  { 'code':0,'msg':'checkPin succ','data':data });
});


router.post('/boxinit', function(req, res) {
    console.log("boxinit-----------------------------");
    const reqdata=qs.parse( req.body);
    console.log(reqdata);
    const {actoken,pubkey,seed,addresses}=reqdata;

    if( undefined==actoken || validator.isEmpty(actoken) || ! CAROWNER.checkAccessToken(actoken) ){
        Helper.rspCliJson( res,  { 'code':1,'msg':'actoken is invalid' });
        return ;
    }

    if( undefined==pubkey || validator.isEmpty(pubkey) ){
        Helper.rspCliJson( res,  { 'code':2,'msg':'pubkey is invalid' });
        return ;
    }
    if( undefined==seed || validator.isEmpty(seed) ){
        Helper.rspCliJson( res,  { 'code':2,'msg':'seed is invalid' });
        return ;
    }

    if (undefined == addresses){
        Helper.rspCliJson( res,  { 'code':3,'msg':'addresses is invalid' });
        return;
    }

    CARBOX.setStoreInfo(seed, pubkey, addresses);
    CARBOX.dump2Json();
    console.log( CARBOX.getStoreInfo() );
    Helper.rspCliJson( res,  { 'code':0,'msg':'boxinit ok' });
});


router.post('/boxstart', urlencodedParser, function(req, res) {
    console.log("boxstart-----------------------------");
    console.log(req.body);
    const {actoken}=req.body;

    if( undefined==actoken || validator.isEmpty(actoken) || ! CAROWNER.checkAccessToken(actoken) ){
        Helper.rspCliJson( res,  { 'code':1,'msg':'actoken is invalid' });
        return ;
    }

    if( CARBOX.isStart()){
        Helper.rspCliJson( res,  { 'code':0,'msg':'box has already started!' });
        return;
    }

    if( ! CARBOX.start() ){
        Helper.rspCliJson( res,  { 'code':2,'msg':'boxstart failed;','error':CARBOX.lasterror });
        return;
    }

    Helper.rspCliJson( res,  { 'code':0,'msg':'boxstart ok' });
});


router.post('/boxstop', urlencodedParser, function(req, res) {
    console.log("boxstop-----------------------------");
    console.log(req.body);
    const {actoken}=req.body;
    if( undefined==actoken || validator.isEmpty(actoken) || ! CAROWNER.checkAccessToken(actoken) ){
        Helper.rspCliJson( res,  { 'code':1,'msg':'actoken is invalid' });
        return ;
    }
    CARBOX.stop();
    Helper.rspCliJson( res,  { 'code':0,'msg':'boxstop ok' });
});


// {"storageKey":{"start_time":1526721448,"end_time":1526721453,"sessionid":1}
router.post('/token', function(req, res) {
    console.log("token-----------------------------");
    const reqdata=qs.parse( req.body);
    console.log(reqdata);
    const {start_time,end_time,sessionid,address}=reqdata;
    const storageKey = {start_time,end_time,sessionid};
    const collection = "box"+address;
    MongodbApi.getCarboxData(collection  ,storageKey, assetData=>{
       const result={"code":0,
           "msg":"ok",
           'data':assetData,
       };
       Helper.rspCliJson( res, result);
   })


});


module.exports = router;
