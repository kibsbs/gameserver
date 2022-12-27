
module.exports = {

    name: `BackOffice`,
    description: `Provides back-office data required for admin panels, tools etc.`,
    version: `1.0.0`,

    async init(app, router) {

        router.get("/getConfig", (req, res) => {
            // Remove any secret key
            let config = gs.config;
            delete config.SECRETS;
            delete config.DATABASE;
            
            return res.json({
                gs: config,
                jmcs: global.config
            });
        });

    }
}