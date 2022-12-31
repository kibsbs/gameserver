class Utils {
    constructor() {}

    /**
     * Health check middleware
     * @param {*} req 
     * @param {*} res 
     * @returns {any}
     */
    healthCheck(req, res) {
        return res.end(process.uptime().toString());
    }

    /**
     * Checks if server's enviroment is a dev enviroment
     * @returns {Boolean}
     */
    isDev() {
        return ["dev", "local", "uat", "docker"].includes(global.ENV.toLowerCase());
    }

    /**
     * Current server time
     * @returns {Number}
     */
    serverTime() {
        return (Date.now() / 1000);
    }
}

module.exports = new Utils();