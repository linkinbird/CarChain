const fnv = require('fnv-plus')
const util = require('util');
const moment = require('moment');
moment.locale('zh-cn');
const  crypto = require('crypto');
const NodeRSA = require('node-rsa');


class Helper{
    // static strhash(s) {
    //     return fnv.hash( this.trim_all_space(s), 32).str()
    // }

    static randomWord(randomFlag, min, max){
        var str = "",
            range = min,
            arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        // 随机产生
        if(randomFlag){
            range = Math.round(Math.random() * (max-min)) + min;
        }
        let pos=0;
        for(let i=0; i<range; i++){
            pos = Math.round(Math.random() * (arr.length-1));
            str += arr[pos];
        }
        return str;
    }

    static allocToken(){
        const a = this.randomWord(false,16,16,16);
        return a;
    }

    static rspCliJson( res, result){
        if( ! res){
            return;
        }
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Access-Control-Allow-Origin':'*'});
        const r=JSON.stringify(result);
        res.end(r);
        console.log(r);
    }

    static mocGps() {
        var max=180;
        var min=10;
        var a=Math.random() * (max-min) + min;
        return a;
    }

    static mocSpeed() {
        var max=180;
        var min=10;
        var a=Math.random() * (max-min) + min;
        return  Math.round( a);
    }

    static getYmd( tm){
        // var formatDate = moment(12345678977).format('YYYY-MM-DD HH:mm:ss'); /*格式化时间*/
        if(tm==0){
            return  moment( Date.now() ).format('YYYYMMDD'); /*格式化时间*/
        }else{
            return  moment( tm ).format('YYYYMMDD'); /*格式化时间*/
        }

    }






    static str2uint(str){
        return require('string-hash')(str);
    }

    static str2md5(str){
        let md5 = crypto.createHash('md5');
        return  md5.update('a').digest('hex');
    }

}


module.exports = {
    Helper,
}


// function main() {
//     const a = Helper.str2uint("1133333333333333333333331")
//     console.log(a);
// }
//
// main()