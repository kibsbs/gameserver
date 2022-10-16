

const uenc = require("uenc")
const nasAuth = require("nas-auth-client")

module.exports = {

    name: `Mashup`,
    description: `Provides all Mash-Up data such as online maps and metadata.`,
    version: `1.0.0`,

    async init(app, router) {


        router.post("/getCurrentMap", nasAuth.require, (req, res) => {
            return res.uenc({
                mapName: "test",
                version: 1665915017795,
                url: "https://cdn.glitch.global/1746847d-0cc8-4fee-99fe-3cef0920128d/test.rar?v=1665915017795"
            })
        });

        router.post("/getMetadata", nasAuth.require, (req, res) => {

            let metadatas = [{
                name: "test",
                id: 1,
                version: 1665915017795,
                md5: "37c078e2731b4b273f126fa3baad9a44",
                url: "https://cdn.glitch.global/1746847d-0cc8-4fee-99fe-3cef0920128d/test.rar?v=1665915017795",
                zipStatus: 1,
                zipVersion: 1,
                coverflow: 1
            }]

            return res.uenc({
                ...uenc.setIndex(metadatas)
            })
        });
    }
    
}