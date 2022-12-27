const moment = require("moment")

class Utils {
    constructor() {}

    healthCheck(req, res) {
        return res.end(process.uptime().toString());
    }

    isDev() {
        return ["dev", "local", "uat"].includes(global.ENV.toLowerCase())
    }

    getServerTime(epoch = Date.now(), divide = true) {
        epoch = divide ? epoch / 1000 : epoch
        return epoch.toString().substring(1)
        // return moment().local().valueOf() / 1000
        // return Date.now() / 1000

        // To make the server time exactly accurate along with the sniffs we use montreal's timezone
        // as base since original wdf servers were located in montreal
        // const date = e;
        // const regionalTime = new Date(date).toLocaleString("en-US", { timeZone: "America/Montreal", });
        // const epoch = new Date(regionalTime).getTime() / 1000 + new Date(date).getMilliseconds().toString()

        // // console.log(date, " +++ ", regionalTime, " +++ ", epoch)

        // return Number(Number(epoch / 1000).toString().substring(1));
    }

    highPrecisionAdd(...args) {
        const add = (a, b) => a + b;
        const input = args.map(v => v.toString().split("."));
        
        let integerPart = input.map(v => BigInt(v[0])).reduce(add);
        
        const fractionalPartString = input.map(v => v[1] ?? "0");
        const precision = Math.max(...fractionalPartString.map(s => s.length));
        let fractionalPart = fractionalPartString.map(s => BigInt(s.padEnd(precision, "0"))).reduce(add);
        
        const overflowConstant = 10n ** BigInt(precision);
        if (fractionalPart >= overflowConstant) {
            fractionalPart -= overflowConstant;
            integerPart++;
        }
        
        return fractionalPart === 0n ? String(integerPart) : `${integerPart}.${fractionalPart}`;
    }
}

module.exports = new Utils();