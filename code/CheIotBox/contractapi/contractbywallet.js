const _ = require('lodash');
const Formatter = require('./formatter');
const Utils = require('./utils');
const Encoder = require('./encoder');
const Constants = require('./constants');

const webWallet= require('./libs/web-wallet')
const ethjsabi= require('ethjs-abi')
const server=require ('./libs/server')
const Web3Utils = require('web3-utils');

const SEND_AMOUNT = 0;
const SEND_GASLIMIT = 250000;
const SEND_GASPRICE = 0.0000004;

class ContractByWallet {
    constructor(contractAddress, contractAbi) {
        this.contractAddress =contractAddress;
        this.contractAbi = contractAbi;
        this.parsedAbi = {};
        this.gasLimit=250000;
        this.gasPrice=40;
        this.fee=0.0001;
        this.rawTx =null;
        this.decodeAbi();
    }

    decodeAbi() {
        let abiJson =this.contractAbi;
        for (let i = 0; i < abiJson.length; i++) {
            this.parsedAbi[ abiJson[i]['name'] ]=abiJson[i];
        }
    }

    //setTestNumber
    send(methodName, methodArgs){
        let wallet = webWallet.getWallet()
        let encodedData ;
        if(methodArgs==undefined){
            methodArgs=[];
        }
        console.log("generateSendToContractTx=>", wallet.getAddress(),wallet.getPrivKey(),this.gasLimit, this.gasPrice,this.fee,methodName, methodArgs )
        try {
            encodedData = ethjsabi.encodeMethod(this.parsedAbi[methodName], methodArgs).substr(2);
            console.log("encodedData:",encodedData);
        }catch (e) {
            console.log('send(),ethjsabi.encodeMethod error ',methodName, methodArgs);
            return false
        }
        wallet.generateSendToContractTx(this.contractAddress, encodedData, this.gasLimit, this.gasPrice, this.fee, rawTx => {
            this.rawTx = rawTx;
            this.confirmSend();
        })
    }

    confirmSend() {
        let wallet = webWallet.getWallet()
        wallet.sendRawTx(this.rawTx, txId => {
            console.log('Successful send. You can view at ' + server.currentNode().getTxExplorerUrl(txId));
        })
    }

    async call(methodName, methodArgs) {
        if(methodArgs==undefined){
            methodArgs=[];
        }
        let wallet = webWallet.getWallet()
        let encodedData ;
        console.log("call=>",methodName, methodArgs )
        try {
            encodedData = ethjsabi.encodeMethod(this.parsedAbi[methodName], methodArgs).substr(2);
            console.log("encodedData:",encodedData);
        }catch (e) {
            console.log('send(),ethjsabi.encodeMethod error ',methodName, methodArgs);
            return false
        }
        return new Promise((resolve, reject) =>{
            wallet.callContract(this.contractAddress, encodedData, result => {
                console.log("rsp:",methodName,result);

                let tmp=ethjsabi.decodeMethod(this.parsedAbi[methodName],Utils.appendHexPrefix(result));
                resolve(tmp['0']);
            })
        });


    }

}

module.exports = ContractByWallet;
