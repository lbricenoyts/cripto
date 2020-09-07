'use strict'

const TTR = (x) => { 
    let s = []; 
    for (let i = 0; i < x.length; i++) {
        let j = x.charCodeAt(i);
        s[i] = (j >= 33) && (j <= 126) ? String.fromCharCode(33 + ((j + 14) % 94)):String.fromCharCode(j); 
    }
    return s.join('');
}

const coder = base => {
    return ({
        encode(data) {
            let buff = new Buffer(TTR(data))
            return buff.toString(base)
        },
        decode(data) {
            let buff = new Buffer(`${data}`, base)
            return TTR(buff.toString('ascii'))
        }
    })
}

const BGA = coder("base64")
const DIG = coder("hex")
const toEval = (arg) => eval(`${arg}`)
const unary = fn =>  (...args) => fn(args[0]);


const _pipe = (a, b) => (arg) => a(b(arg));
const pipe = (...ops) => ops.reduce(_pipe)


const cripto = {
    toCode: pipe(BGA.encode,DIG.encode),
    toText: pipe(DIG.decode,BGA.decode),

    toCodeObj: pipe(DIG.encode,BGA.encode,unary(JSON.stringify)),
    toObj: pipe(unary(JSON.parse),BGA.decode,DIG.decode),

    toFun: pipe(toEval,DIG.decode,BGA.decode)
}


module.exports = { 
    cripto,
    coder,
    pipe,
    unary,
    TTR
}