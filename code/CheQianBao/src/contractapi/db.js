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
                console.log("saveCarboxData error:%s",err);
            }else{
                console.log("saveCarboxData ok");
            }
        });
    }


    getCarboxData( collection,key){
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
            console.log( error,result);
        });

    }


}


module.exports = {
    MongodbApi : new MongodbClient(MONGODBURL),
}

// function main() {
//
//     var client =  new MongodbClient(MONGODBURL);
//
// }
//
// main()