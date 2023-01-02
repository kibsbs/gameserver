class Utils {
    constructor() {}

    getConfig() {
        let config = {
            gs: global.gs,
            service: global.config
        };

        config.gs.DATABASE = "PROTECTED";
        config.gs.SECRETS = "PROTECTED";

        return config;
    }

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
        let env = global.ENV || "local";
        return ["dev", "local", "uat", "docker", "test", "beta"].includes(env.toLowerCase());
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