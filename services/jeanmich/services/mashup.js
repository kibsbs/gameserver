

const nasAuth = require("nas-auth-client")

module.exports = {

    name: `Mashup`,
    description: `Provides all Mash-Up data such as online maps and metadata.`,
    version: `1.0.0`,

    async init(app, router) {


        router.post("/getCurrentMap", nasAuth.require, (req, res) => {
            return res.uenc({
                mapName: "test",
                version: 1,
                url: "test"
            })
        });

        router.post("/getMetadata", nasAuth.require, (req, res) => {
            return res.uenc({})
        });
    }
    
}