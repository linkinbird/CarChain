//-------------------------------------------------------
//定义车主的类
//-------------------------------------------------------

class CarOwner {
    constructor(userId, userName,phone,email,account) {
        this.userId = userId;
        this.userName = userName;
        this.phone = phone;
        this.email = email;
        this.account =account;
        this.pwd = "";
        this.accesstoken = "";
        this.logintime=0;
    }

    setAccessToken(accesstoken,userName){
        this.logintime=Date.now();
        this.accesstoken=accesstoken;
        this.userName=userName;
    }
    checkAccessToken(accesstoken){
        return accesstoken==this.accesstoken;
    }

    getUserInfo(){
        return {
                'userName':this.userName,
                'logintime':this.logintime,
        };
    }
}


module.exports = {
    CAROWNER : new CarOwner('','','','',''),
}