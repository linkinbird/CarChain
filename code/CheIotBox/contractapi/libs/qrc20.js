var tokens=require('./token.json')
var config=require('./config')
var abi=require('./ethjs-abi')
var qtum=require('./qtumjs-lib')

let tokenList = tokens[config.getNetwork()]

module.exports =  {
  getTokenList() {
    return tokenList
  },

  checkSymbol(symbol) {
    return tokenList.filter((token) => {return token.symbol == symbol}).length > 0
  },

  getTokenBySymbol(symbol) {
    return tokenList.filter((token) => {return token.symbol == symbol})[0]
  },

  encodeSendData(token, address, amount) {
    return 'a9059cbb' + abi.encodeParams(['address', 'uint256'], ['0x'+qtum.address.fromBase58Check(address)['hash'].toString('hex'), amount * Math.pow(10, token.decimals)]).substr(2)
  }
}
