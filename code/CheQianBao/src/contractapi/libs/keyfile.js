var aes=require( 'aes256')

const VERSION = '0.1'

function parse(str) {
    try {
        let res = JSON.parse(str)
        if (res.version != VERSION) {
            return null
        }
        return res.content
    }
    catch (e) {
        return null
    }
}

function decode(content, password) {
    return aes.decrypt(password + VERSION, content)
}

function build(content) {
    let res = {
        version: VERSION,
        content: content
    }
    return JSON.stringify(res)
}

function encode(content, password) {
    return aes.encrypt(password + VERSION, content)
}

module.exports =  {
    parse,
    decode,
    build,
    encode
}