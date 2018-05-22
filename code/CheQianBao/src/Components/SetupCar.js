import React, {Component} from 'react';
import {Grid, TextField, Button, List, ListItem, ListItemText, Select, MenuItem} from 'material-ui';
import {ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails} from 'material-ui';
import {Card, CardContent, CardHeader, Typography} from 'material-ui';
import PropTypes from 'prop-types'
import {Chip} from 'material-ui';
import {withStyles} from 'material-ui/styles';
import Paper from 'material-ui/Paper';

import NodeRSA from 'node-rsa';
import Websocket from 'react-websocket';
import axios from 'axios';
import qs from 'qs';

const PUBKEY_FORMAT = 'pkcs8-public-pem';
const PRIVKEY_FORMAT = 'pkcs1-private-pem';
const PUBKEY_PEM = 'pubkey.pem';
const PRIVKEY_PEM = 'privkey.pem'
const DEFAULT_MNEMONIC = 'buffalo enact wife entry clinic cattle advance coil canoe name unique twist';

const Encoder = require('../contractapi/encoder');
const ContractByWallet = require('../contractapi/contractbywallet.js')
const webWallet = require('../contractapi/libs/web-wallet')
const contractAbi = require('../contractapi/contractAbi.json')
const _ = require('lodash');


webWallet.restoreFromWif("cTcTUhCHjvbMr7J1kFFUQwhk14TA5LKwrxzAB9CFN8Qq7R198q2W");
const contractAddress = "6af6c3678ec3936f1bb52f6376eaf27fe9f24842";


const senderAddress = webWallet.getWallet().getAddress();
const senderHexAddress = Encoder.addressToHexAddress(senderAddress);
var contract = new ContractByWallet(contractAddress, contractAbi);
var walletList = webWallet.restoreFromMobile(DEFAULT_MNEMONIC);
var car = null;

const DEFAULT_RSAPRIVKEY = `
-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQCs5i1KCqUE8Wu+2Zwj0M8D/ugKQKlNNN70eK7jYM1gQF4WZnxj
XalwJo5a/fAEnPuZ80c1N01ANBhDXV5LW2nX7XpGL+JacDuCDvJOgOkfLk9K01Lg
k6H2TSehNn/wVpvH0DAFSVOsauWsHah0iu1Yi4rVWlU8bzERuL/CKPUTlwIDAQAB
AoGAO0ZeWHf1wxARZEiuYwj/L9uAKaOpZzKtDRsiuglB37Gxj/RqyJYftLdDLqbI
VoyLJWhmDTR8Y3p4pv+niCY6zp8pUTkwXUt+bCjql2pO0nRCl3lamVYFZ8817wgp
gYe1S7NpmrUJPyBu0qDz5VledFuQ15BnoOfuWd7IVYuMHYECQQDpwvIPHBCcmUR7
HSij/k3593yAEfLhYY2ew3gpAEuDBKyzG25WTmWN4esHojAhOnN9x8QgzT0aXruA
lascpC2nAkEAvVj7aKE09FxJEfSXbYy9Y685PzjgYY0L+QZW7H7Zi0ZOeDeosZ6j
UVkJmZLME/kENGWOLgJ9lOjsA7obMmYIkQJAGhH4xwCdRam+PnDBEJETBza3ttzJ
lqM3lSY9p2z1/vWtgQglJRD3OHyipqZK8dm/+Z4m3HWnQ+KezLdkbvxMbwJBAKhU
MLzlg4Qxfqw9u1kio0O5hLUVxTQ0Bg7OefwpERDl4eCx6oBtPVeWRhiHDnI7EGfc
WLfCcw4su5TcoEz/tGECQQCnY3B2ObQY08XmU/T7CXp73qyz0GGh77/25mj3ITR+
VT7sjAxfMRhN/9e99bK202PoWU3EleHrC3HybGDwxA+x
-----END RSA PRIVATE KEY-----
`;

const DEFAULT_RSAPUBKEY = `
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCs5i1KCqUE8Wu+2Zwj0M8D/ugK
QKlNNN70eK7jYM1gQF4WZnxjXalwJo5a/fAEnPuZ80c1N01ANBhDXV5LW2nX7XpG
L+JacDuCDvJOgOkfLk9K01Lgk6H2TSehNn/wVpvH0DAFSVOsauWsHah0iu1Yi4rV
WlU8bzERuL/CKPUTlwIDAQAB
-----END PUBLIC KEY-----
`;

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },

    formControl: {
        margin: theme.spacing.unit * 3,
    },
});


class SetupCar extends Component {

    constructor() {
        super();
        this.initCarInfo();
        this.state = {
            boxUrl: 'http://10.10.28.213:8202/',
            pin: '123456',
            mnemonic: DEFAULT_MNEMONIC,
            car: null,
            error: false,
            carinfo: null,
            actoken: '',
            status: '',
            lasttip: '',
            monitdata: '',
            tokenList: [],
            tokenAsset: {},
            single: null,
            currentWalletAddress: car['addresses'][0],
            currentToken: null,
            currentEncData: null,
            currentPlainData: null,

            transaction: {fromAddress: "", toAddress: "", toRsaPubKey: "", token: ""}
        };
        this.changeBoxUrl = this.changeBoxUrl.bind(this);
        this.changePin = this.changePin.bind(this);
        this.changeMnemonic = this.changeMnemonic.bind(this);

        this.boxconnect = this.boxconnect.bind(this);
        this.boxinit = this.boxinit.bind(this);
        this.boxstart = this.boxstart.bind(this);
        this.boxstop = this.boxstop.bind(this);
        this.handleWSData = this.handleWSData.bind(this);

        this.assetList = this.assetList.bind(this);
        this.boxstatus = this.boxstatus.bind(this);
        this.handleAssetRestoreClick = this.handleAssetRestoreClick.bind(this);

        this.transferOwnership = this.transferOwnership.bind(this);
        this.handleNewMnimoicClick = this.handleNewMnimoicClick.bind(this);
        this.handleRandomRecvClick = this.handleRandomRecvClick.bind(this);

        this.updateTransactionDetails = this.updateTransactionDetails.bind(this);


    }

    initCarInfo() {
        console.log("initCarInfo...")
        var key = new NodeRSA({b: 1024});
        car = {};
        // car['privkey'] = key.exportKey(PRIVKEY_FORMAT);
        // car['pubkey'] = key.exportKey(PUBKEY_FORMAT);
        car['privkey'] = DEFAULT_RSAPRIVKEY;
        car['pubkey'] = DEFAULT_RSAPUBKEY;
        car['seed'] = DEFAULT_MNEMONIC;
        car['addresses'] = []
        for (let wallet of walletList) {
            let senderAddress = wallet.wallet.getAddress();
            car['addresses'].push(senderAddress);
        }
        console.log(car)

    }


    handleWSData(data) {

        this.setState({monitdata: data});

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


    changeMnemonic(event) {
        this.setState({
            mnemonic: event.target.value
        });
    }

    boxstatus() {
        const url = this.state.boxUrl + 'status';
        axios.get(url)
            .then(response => {
                const rspdata = response.data;
                console.log(rspdata);
                this.setState({status: rspdata.status});

            })
            .catch(function (error) {
                console.log(error)
            })
    }


    boxconnect(event) {
        event.preventDefault();
        this.setState({lasttip: '正在连接设备...'});
        this.setState({carinfo: null});

        const url = this.state.boxUrl + 'boxconnect';
        const param = {userName: 'zhangtao', pin: this.state.pin};

        axios.post(url, qs.stringify(param)).then(response => {
            const rspdata = response.data;
            console.log('rspdata :%s', JSON.stringify(rspdata));
            if (rspdata.code != 0) {
                this.setState({lasttip: '连接失败:' + rspdata.msg});
                return;
            }
            this.setState({carinfo: rspdata.data.carinfo});
            this.setState({actoken: rspdata.data.actoken});
            this.setState({status: rspdata.data.status});
            this.setState({lasttip: '成功连接到设备'});
        }).catch(function (error) {
            console.log(error);
            this.setState({lasttip: '连接设备出现错误:' + error});
        });


    }


    boxinit(event) {
        event.preventDefault();
        this.setState({lasttip: '正在初始化设备...'});

        console.log("boxinit---------")
        console.log(car);

        const url = this.state.boxUrl + 'boxinit';
        const param = {
            "actoken": this.state.actoken,
            "pubkey": car['pubkey'],
            "addresses": car['addresses'],
            "routefunc": 0,
            "seed": car['seed']
        }

        axios.post(url, qs.stringify(param)).then(response => {
            const rspdata = response.data;
            console.log('rspdata :%s', JSON.stringify(rspdata));
            if (rspdata.code != 0) {
                alert(rspdata.msg);
                return;
            }

            this.setState({lasttip: '设备初始化成功'});

        }).catch(function (error) {
            console.log(error);
        });


    }

    boxstart(event) {
        event.preventDefault();

        const url = this.state.boxUrl + 'boxstart';
        const param = {
            "actoken": this.state.actoken,
        }

        axios.post(url, qs.stringify(param)).then(response => {
            this.boxstatus();
            const rspdata = response.data;
            console.log('rspdata :%s', JSON.stringify(rspdata));
            if (rspdata.code != 0) {
                this.setState({lasttip: '设备启动失败：' + rspdata.msg});
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
        const param = {
            "actoken": this.state.actoken,
        }

        axios.post(url, qs.stringify(param)).then(response => {
            this.boxstatus();
            const rspdata = response.data;
            console.log('rspdata :%s', JSON.stringify(rspdata));
            if (rspdata.code != 0) {
                this.setState({lasttip: '设备停止失败：' + rspdata.msg});
                return;
            }
            this.setState({lasttip: '设备停止成功'});
        }).catch(function (error) {
            console.log(error);
        });
    }

    assetList() {
        console.log("get assetList from currentWalletAddress:", this.state.currentWalletAddress);
        this.setState({tokenList: []});
        this.setState({tokenAsset: {}});
        contract.call("tokensOf", [senderHexAddress], (tokenList) => {
            console.log(tokenList);
            this.setState({tokenList: tokenList});
        })

    }

    lasttipForm() {
        return (
            <div>
                <Typography color="textSecondary">
                    <b>{this.state.lasttip}</b>
                </Typography>
            </div>);
    }

    monitinfoForm() {
        return (
            <div>
                <Card>
                    <CardContent>
                        <Typography variant="headline" component="h2">
                            设备监控
                        </Typography>
                        <Typography component="p">
                            <Websocket url='ws://10.10.28.213:8101' onMessage={this.handleWSData.bind(this)}/>
                            {this.state.monitdata}
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        );
    }


    carinfoForm() {
        if (this.state.carinfo != null) {
            return (
                <div>
                    <Card>
                        <CardContent>
                            <Typography variant="headline" component="h2">
                                设备信息(status:{this.state.status})
                            </Typography>
                            <Typography component="p">
                                vehicleId:{this.state.carinfo.vehicleId}<br/>
                                chasisNumber:{this.state.carinfo.chasisNumber}<br/>
                                engineNumber:{this.state.carinfo.engineNumber}<br/>
                                makerName:{this.state.carinfo.makerName}<br/>
                                manufactuingYear:{this.state.carinfo.manufactuingYear}<br/>
                                actoken:{this.state.actoken}<br/>
                            </Typography>
                        </CardContent>
                    </Card>
                </div>
            );
        } else {
            return (<div><br/><br/><b>没有连接到设备</b></div>);
        }
    }


    carForm() {
        const {classes} = this.props;
        return (
            <form className={classes.formControl}>
                <Grid container align="left">
                    <Grid item xs={12} sm={6}>
                        <TextField

                            id="boxUrl"
                            label="设备地址"
                            onChange={this.changeBoxUrl}
                            value={this.state.boxUrl}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="pwd"
                            label="匹配PIN"
                            onChange={this.changePin}
                            value={this.state.pin}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Chip label="生成密语" onClick={this.handleNewMnimoicClick}/>
                        <TextField
                            fullWidth
                            id="seed"
                            label="账户密语"
                            onChange={this.changeMnemonic}
                            value={this.state.mnemonic}
                            required
                        />

                    </Grid>

                    <Grid item xs={12}>
                        <Button onClick={this.boxconnect} variant="raised" color="primary">连接设备</Button>
                        <span> </span>
                        <Button onClick={this.boxinit} variant="raised" color="secondary">初始设备</Button>
                        <span> </span>
                        <Button onClick={this.boxstart} variant="raised" color="primary">启动设备</Button>
                        <span> </span>
                        <Button onClick={this.boxstop} variant="raised" color="secondary">关闭设备</Button>

                    </Grid>
                </Grid>
            </form>
        );
    }

    handleTokenToggle = value => () => {
        var tokenAsset = this.state.tokenAsset;
        this.setState({currentToken: value});

        var transaction = this.state.transaction;
        transaction['token'] =value;
        transaction['fromAddress'] =this.state.currentWalletAddress;
        this.setState({transaction: transaction});

        if (undefined == tokenAsset[value]) {
            contract.call("tokenMetadata", [value], (result) => {
                console.log(result);
                tokenAsset[value] = result;
                this.setState({tokenAsset: tokenAsset});

                this.gettokendata(result);
            });
        } else {
            console.log("NOTHING")
            this.gettokendata(tokenAsset[value]);
        }
    };

    gettokendata(assetId) {

        this.setState({currentEncData: null})
        this.setState({currentPlainData: null})


        const assetObj = JSON.parse(assetId);
        const url = this.state.boxUrl + 'token';
        const param = assetObj.storageKey;
        if (param == undefined) {
            console.log("invalid assetid:" + assetId);
            return;
        }

        param["address"] = senderAddress;//this.state.currentWalletAddress;
        console.log(param);
        axios.post(url, qs.stringify(param)).then(response => {
            console.log("===>")
            const rspdata = response.data;
            // console.log('rspdata :%s',JSON.stringify(rspdata));
            if (rspdata.code != 0) {
                //this.setState({lasttip: '设备启动失败：'+rspdata.msg});
                return;
            }

            const record = rspdata.data[0];
            console.log(record.data)

            this.setState({currentEncData: record.data})

            //this.setState({lasttip: '设备启动成功'});
        }).catch(function (error) {
            console.log(error);
        });

    }


    handleAddressToggle = value => () => {

        console.log("handleAddressToggle:", value)

        this.setState({currentWalletAddress: value});

        var transaction = this.state.transaction;
        transaction['fromAddress'] =this.state.currentWalletAddress;
        this.setState({transaction: transaction});
    };


    tokenListForm() {
        return (
            <div>
                <ExpansionPanel>
                    <ExpansionPanelSummary>
                        <ListItem onClick={this.assetList}><b>资产列表</b></ListItem>


                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <List>
                            {
                                this.state.tokenList.map((token, index) => {
                                    return (
                                        <ListItem
                                            dense
                                            button
                                            onClick={this.handleTokenToggle(token)}
                                            key={token}
                                        >
                                            <ListItemText>{index}:{token}</ListItemText>
                                        </ListItem>
                                    )
                                })
                            }
                        </List>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        );


    }


    grantListForm() {
        return (
            <div>
                <ExpansionPanel>
                    <ExpansionPanelSummary>
                        <ListItem onClick={this.assetList}><b>授权列表</b></ListItem>

                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <List>

                        </List>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        );


    }


    addressListForm() {
        return (
            <div>
                <ExpansionPanel>
                    <ExpansionPanelSummary>
                        <ListItem><b>钱包地址</b>
                            <Typography component="h2" color="primary">{this.state.currentWalletAddress}</Typography>
                        </ListItem>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <List dense>
                            {
                                car != null ?
                                    car.addresses.map((address, index) => {
                                        return (
                                            <ListItem dense button onClick={this.handleAddressToggle(address)}>
                                                <Typography component="p">{index}:{address}</Typography>
                                            </ListItem>)
                                    })
                                    : "设备还没初始化"
                            }
                        </List>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        );
    }

    handleChange = name => value => {
        this.setState({
            [name]: value,
        });
    };


    handleAssetRestoreClick() {

        var key = new NodeRSA();
        key.importKey(DEFAULT_RSAPRIVKEY);
        var decrypted = key.decrypt(this.state.currentEncData, 'utf8');
        console.log('decrypted: ', decrypted);
        // alert("handleAssetRestoreClick"+decrypted);
        this.setState({currentPlainData: decrypted})

    }

    handleNewMnimoicClick() {
        const mnemonic = webWallet.generateMnemonic();

        this.setState({
            mnemonic: mnemonic
        });

        console.log("handleNewMnimoicClick:" + mnemonic)
    }


    handleRandomRecvClick() {

        var transaction = this.state.transaction;
        var a = Math.floor(Math.random()*10);

        var address = car.addresses[a];
        transaction['toAddress'] =address;
        transaction['toRsaPubKey'] =DEFAULT_RSAPUBKEY;
        this.setState({transaction: transaction});

    }


    tokenDetailForm() {
        return (
            <div>
                <Card>
                    <CardContent>
                        <Typography component="p" color="primary" align="left"><b>资产ID:</b>{this.state.currentToken}
                        </Typography>
                        <Typography component="p" align="left">
                            <b>链上地址:</b> {this.state.currentWalletAddress}
                        </Typography>
                        <Typography component="p" align="left">
                            <b>资产KEY:</b> {this.state.tokenAsset[this.state.currentToken] == undefined ? "" : this.state.tokenAsset[this.state.currentToken]}
                        </Typography>
                        <Typography component="p" align="left">
                            <b>资产密文:</b> {this.state.currentEncData}
                        </Typography>
                        <Typography component="p" align="left">
                            <Chip label="解密" onClick={this.handleAssetRestoreClick}/>
                            {this.state.currentPlainData}
                        </Typography>

                    </CardContent>
                </Card>
            </div>
        );
    }

    transferOwnership(event) {
        event.preventDefault();
        alert( JSON.stringify( this.state.transaction))

    }

    updateTransactionDetails(event) {
        var id = event.target.id;
        var transaction = this.state.transaction;
        transaction[id] = event.target.value;
        this.setState({transaction: transaction});
        console.log("updateTransactionDetails:", id, transaction[id]);
    }

    ownershipForm() {
        const {classes} = this.props;
        return (
            <div>
                <form onSubmit={this.transferOwnership} className={classes.formControl}>
                    <Grid container>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                fullWidth
                                id="fromAddress"
                                label="发送地址"
                                onChange={this.updateTransactionDetails}
                                value={this.state.transaction.fromAddress}
                                required/>
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <TextField
                                fullWidth
                                id="token"
                                label="token"
                                onChange={this.updateTransactionDetails}
                                value={this.state.transaction.token}
                                required/>
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <TextField
                                fullWidth
                                id="toAddress"
                                label="接收地址"
                                onChange={this.updateTransactionDetails}
                                value={this.state.transaction.toAddress}
                                required/>
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <TextField
                                multiline
                                fullWidth
                                id="toRsaPubKey"
                                label="接收公钥"
                                onChange={this.updateTransactionDetails}
                                value={this.state.transaction.toRsaPubKey}
                                required/>
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <br/> <Chip label="随机接收" onClick={this.handleRandomRecvClick}/>
                            <span>  </span>
                            <Button variant="raised" color="primary" type="submit">
                                Transfer Ownership
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        );
    }


    leftbox() {
        return (
            <div>
                <h2>设备控制</h2>
                {this.carForm()}
                {this.lasttipForm()}
                {this.monitinfoForm()}
                {this.carinfoForm()}


            </div>
        );
    }

    rightbox() {
        return (
            <div>
                <h2>设备链上数据资产管理</h2>

                {this.addressListForm()}
                {this.tokenListForm()}
                {this.grantListForm()}
            </div>
        );
    }

    rightbox2() {
        return (
            <div>
                <h2>资产详情</h2>
                {this.tokenDetailForm()}
                <h2>授权详情</h2>
                {this.ownershipForm()}
            </div>
        );
    }


    render() {
        return (
            <Grid container spacing={16}>
                <Grid item xs={12} sm={4}>
                    <Paper>{this.leftbox()}</Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper>{this.rightbox()}</Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper>{this.rightbox2()}</Paper>
                </Grid>
            </Grid>
        );
    }
}


SetupCar.propTypes = {
    classes: PropTypes.object.isRequired,
};


// export default SetupCar;
export default withStyles(styles)(SetupCar);