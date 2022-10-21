const moment = require("moment")

class Utils {
    constructor() {}

    healthCheck(req, res) {
        return res.end(process.uptime().toString());
    }

    isDev() {
        return ["dev", "local", "uat"].includes(global.ENV.toLowerCase())
    }

    fixTime(time) {
        return Math.round(time * 1000) / 1000
    }

    getServerTime(epoch = Date.now()) {
        epoch = epoch / 1000
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
}

module.exports = new Utils();