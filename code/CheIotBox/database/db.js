var mongoose = require("mongoose");
const MONGODBURL = 'mongodb://10.10.28.14/carbox';

//     this.data.start_time,
//     this.data.end_time,
//     this.data.sessionid);
class MongodbClient {

    constructor(dbUrl) {
        this.dbUrl = dbUrl;
        this.isOpen = 0;

        mongoose.connection.on('connected', function () {
            console.log('Mongoose connection open to %s',this.dbUrl);
            this.isOpen = 1;
        }.bind(this));

        mongoose.connection.on('error', function (err) {
            console.log('Mongoose connection error:%s on %s ',err, this.dbUrl);
            this.isOpen = 0;
        }.bind(this));

        mongoose.connection.on('disconnected', function () {
            console.log('Mongoose connection disconnected on %s', this.dbUrl);
            this.isOpen = 0;
        }.bind(this));

        this.connectServer();

        this.carboxSchema  = new mongoose.Schema({
            start_time:Number,
            end_time:Number,
            sessionid:Number,
            data:String,
        });
    }

    connectServer() {
        mongoose.connect(this.dbUrl);
        console.log("will connect %s",this.dbUrl);
    }

    saveCarboxData( collection,key, encdata){
        if(this.isOpen==0){
            this.connectServer();
            return;
        }
        const table={
            start_time:key.start_time,
            end_time:key.end_time,
            sessionid:key.sessionid,
            data:encdata,
        };

        const Model=mongoose.model(collection, this.carboxSchema);
        const ins = new Model(table);
        ins.save( function (err) {
            if (err){
                console.log("==>saveCarboxData error:%s",err);
            }else{
                console.log("==> saveCarboxData ok",collection.toLowerCase());
            }
        });
    }

    getCarboxData( collection,key,callback){
        console.log("getCarboxData--")
        if(this.isOpen==0){
            this.connectServer();
            return ;
        }

        var fields   = {}; // 待返回的字段
        var options={};
        const Model=mongoose.model(collection, this.carboxSchema);
        var whereStr = key ;

        console.log(whereStr)
        console.log(collection);

        Model.find(whereStr, fields, options,(error, result)=>{
            console.log( error,result,typeof result);

            callback(result);
        });

    }

}


module.exports = {
    MongodbApi : new MongodbClient(MONGODBURL),
}

// mongoose.connect(MONGODBURL,function(err){
//     if(err){
//         console.log('failed to connect %s with error:%s',MONGODBURL,err);
//     }else{
//         console.log('succ to connect %s ',MONGODBURL);
//     }
// });
//
// var Schema = mongoose.Schema;   //  创建模型
// var transactionSchema = new Schema({
//     txid: Number,
//     timestamp: Number,
//     caller: String,
//     txstatus: Number,
//     ymd: Number,
//     srcaddr: String,
//     srcobj: String,
//     tgtaddr: String,
//     tgtobj: String,
//     valuez: Number,
//     state: Number,
//     src1: String,
//     src2: String,
//     src3: String,
//     tgt1: String,
//     tgt2: String,
//     tgt3: String
// });
//
//
// var useraddressbookSchema  = new Schema({
//     account:String,
//     udid:{type:String,index:true,unique: true},
//     address:String,
// });
//
// exports.transactions = mongoose.model('transactions', transactionSchema); //  与users集合关联
// exports.useraddressbook = mongoose.model('useraddressbook', useraddressbookSchema); //  与users集合关联

/*
* db.transactions.ensureIndex({"srcaddr":1,"ymd":-1,"src1":1})
* db.transactions.ensureIndex({"model1":1,"timestamp":-1,"model2":1})
* 192.168.1.104
* tj.eclicks.cn
* */

//
// class Ut {
//     /**
//      * 异步延迟
//      * @param {number} time 延迟的时间,单位毫秒
//      */
//     static sleep(time = 0) {
//         return new Promise((resolve, reject) => {
//             setTimeout(() => {
//                 resolve();
//             }, time);
//         })
//     };
// }

// function main() {
//     var client = new MongodbClient(MONGODBURL);
//     client.connectServer();
//
//
// }
//
// main()