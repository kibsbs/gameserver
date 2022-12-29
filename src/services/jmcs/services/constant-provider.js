module.exports = {

    name: `ConstantProvider`,
    description: `Provides all constant data needed for the game's online services.`,
    version: `1.0.0`,

    async init(app, router) {

        /**
         * getConstants is used by the game to set any online configuration
         */
        router.post("/getConstants", (req, res) => {
            global.logger.info("Checking the API status: Everything is OK");
            return res.json(global.config.CONSTANTS);
        });

    }
}