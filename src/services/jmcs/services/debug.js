const utils = require("utils");
const nasToken = require("nas-token");

module.exports = {

    name: `Debug`,
    description: `Provides back-office data required for admin panels, tools etc.`,
    version: `1.0.0`,

    async init(app, router) {

        router.post("/decryptToken", (req, res) => {
            let token = req.body.token;
            let payload = nasToken.decrypt(token);
            global.logger.info(`Decrypted token ${token}`);

            return res.send({ payload });
        });

        router.get("/testToken", (req, res) => {
            let token = nasToken.encrypt({
                exp: Date.now(),
                gid: "SE3E",
                env: global.ENV,
                uid: "0",
                sid: "0",
                loc: "01",
                rgn: "01"
            });
            global.logger.info(`Generated test token ${token}`);
            
            return res.send({ token: encodeURIComponent(token) });
        });

    }
}