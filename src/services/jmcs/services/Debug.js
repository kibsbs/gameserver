const utils = require("utils");
const nasToken = require("nas-token");

module.exports = {

    name: `Debug`,
    description: `Provides back-office data required for admin panels, tools etc.`,
    version: `1.0.0`,

    async init(app, router) {

        router.use((req, res, next) => {
            if (utils.isDev() || req.headers.hasOwnProperty("x-show-resp")) return next();
            else return res.sendStatus(403);
        });

        router.get("/getConfig", (req, res) => {
            return res.send(utils.getConfig())
        });

        router.post("/decryptToken", (req, res) => {
            let token = req.body.token;
            let payload = nasToken.decrypt(token);
            global.logger.info(`Decrypted token ${token}`);

            return res.send({ payload });
        });

        router.get("/testToken", (req, res) => {
            let token = nasToken.encrypt({
                exp: Date.now(),
                gid: req.query.gid || "SE3E",
                uid: "0",
                sid: "0",
            });
            global.logger.info(`Generated test token ${token}`);
            
            return res.send({ token: encodeURIComponent(token) });
        });

    }
}