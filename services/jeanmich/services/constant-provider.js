
module.exports = {

    name: `ConstantProvider`,
    description: `Provides all constant data needed for the game's online services.`,
    version: `1.0.0`,

    async init(app, router) {

        router.post("/getConstants", nasAuth.require, (req, res) => {
            return res.json(global.config.constants)
        });

    }
}