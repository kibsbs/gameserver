const utils = require("utils");
const nasToken = require("nas-token");

module.exports = {

    name: `Debug`,
    description: `Provides back-office data required for admin panels, tools etc.`,
    version: `1.0.0`,

    async init(app, router) {

        router.post("/decryptToken", (req, res) => {
            let token = req.body.token;
            console.log(token);
            let payload = nasToken.decrypt("jd5CUcAsJt2Gzn1xWysGTVLpiFnu91K3T1+i4X59T3WqKmzVqL9DUnRGKS52VHCaeHfGOhmTFwUlqLtwz+4X9ygNmX7Gycib9MLkdPH2b6TpiHnsSNXXVJwg1yZndMmQ");
            return res.send(payload);
        });

        router.get("/testToken", (req, res) => {
            let token = nasToken.encrypt({
                gid: "SE3E",
                env: global.ENV,
                uid: "0",
                sid: "0",
                loc: 01,
                rgn: 01
            })
            console.log(token)
            return res.send((token))
        });

    }
}