import React, {Component} from 'react';
import {Grid, TextField, Button, List, ListItem, ListItemText, Select, MenuItem} from 'material-ui';
import {Card,CardContent,CardHeader,Typography} from 'material-ui';

import NodeRSA from 'node-rsa';

import Websocket from 'react-websocket';


import {networks, generateMnemonic} from "qtumjs-wallet";
import axios from 'axios';
import qs from 'qs';

const PUBKEY_FORMAT = 'pkcs8-public-pem';
const PRIVKEY_FORMAT = 'pkcs1-private-pem';
const PUBKEY_PEM = 'pubkey.pem';
const PRIVKEY_PEM = 'privkey.pem'
const DEFAULT_MNEMONIC = 'buffalo enact wife entry clinic cattle advance coil canoe name unique twist';


class DataAssetForm extends Component {

    constructor() {
        super();
        this.state = {
            boxUrl: 'http://10.10.28.213:8202/',
            pin: '123456',
            car: null,
            error: false,
            carinfo:null,
            actoken:'',
            status:'',
            lasttip:'',
            monitdata:'',

        };
        this.changeBoxUrl = this.changeBoxUrl.bind(this);
        this.changePin = this.changePin.bind(this);


    }

    handleWSData(data) {

        this.setState({monitdata:data});

    }

    changeBoxUrl(event) {
        this.setState({
            boxUrl: event.target.value
        });
    }

    changePin(event) {
        this.setState({
            pin: event.target.value
        });
    }




    boxstart(event) {
        event.preventDefault();

        const url = this.state.boxUrl + 'boxstart';
        const param={
            "actoken":this.state.actoken,

        }

        axios.post(url, qs.stringify(param) ).then( response => {
            const rspdata=response.data;
            console.log('rspdata :%s',JSON.stringify(rspdata));
            if(rspdata.code != 0){
                alert( rspdata.msg);
                return;
            }

            this.setState({lasttip: '设备启动成功'});


        }).catch(function (error) {
            console.log(error);
        });

    }

    boxstop(event) {
        event.preventDefault();

        const url = this.state.boxUrl + 'boxstop';
        const param={
            "actoken":this.state.actoken,

        }

        axios.post(url, qs.stringify(param) ).then( response => {
            const rspdata=response.data;
            console.log('rspdata :%s',JSON.stringify(rspdata));
            if(rspdata.code != 0){
                alert( rspdata.msg);
                return;
            }

            this.setState({lasttip: '设备停止成功'});


        }).catch(function (error) {
            console.log(error);
        });
    }

    lasttipForm(){

        return (
            <div>
                <Typography  color="textSecondary">
                    <b>{this.state.lasttip}</b>
                </Typography>
                <div>
                    Count:

                    <Websocket url='ws://10.10.28.213:8101'
                               onMessage={this.handleWSData.bind(this)}/>
                </div>
            </div>
        );
    }



    carinfoForm(){

        if (this.state.carinfo != null) {
            return (
                <div>
                    <Card>
                        <CardContent>

                            <Typography variant="headline" component="h2">
                                设备信息
                            </Typography>
                            <Typography component="p">
                                vehicleId:{ this.state.carinfo.vehicleId}<br />
                                chasisNumber:{ this.state.carinfo.chasisNumber}<br />
                                engineNumber:{ this.state.carinfo.engineNumber}<br />
                                makerName:{ this.state.carinfo.makerName}<br />
                                manufactuingYear:{ this.state.carinfo.manufactuingYear}<br />
                                status:{ this.state.status}<br />
                                actoken:{ this.state.actoken}<br />
                            </Typography>
                        </CardContent>

                    </Card>
                </div>
            );
        }else{
            return (<div><br/><br/><b>没有连接到设备</b></div>);
        }
    }



    carForm() {
        return (
            <form>
                <Grid container spacing={8}>
                    <Grid item xs={6}>

                    </Grid>
                    <Grid item xs={6}>

                        <Button onClick={this.boxinit} variant="raised" color="secondary" >
                            我到
                        </Button>
                        -

                        <Button onClick={this.boxstart} variant="raised" color="secondary" >
                            启动设备
                        </Button>
                        -
                        <Button onClick={this.boxstop} variant="raised" color="secondary" >
                            关闭设备
                        </Button>
                    </Grid>
                </Grid>
            </form>
        );
    }



    render() {
        return (
            <div>
                <h2>链上数据资产管理</h2>

                {this.carForm()}

            </div>
        );
    }
}

export default DataAssetForm;