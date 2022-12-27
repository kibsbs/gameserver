const nasAuth = require("nas-auth-client")
const utils = require("utils")

module.exports = {

    name: `DancerCard`,
    description: `Keeps data of dancer profiles.`,
    version: `1.0.0`,

    async init(app, router) {

        const dancerCard = require("jd-dancercard")

        /**
         * Cleans given client body from any malicious data
         * For example, if client hijacks and puts userId or profileId in body
         * this middleware will clean them out.
         */
        function cleanClientBody(req, res, next) {
            ["userId", "profileId"].forEach(key => { if (req.body[key]) delete req.body[key] })
            return next();
        }
        
        router.post("/RequestDancerProfile", async (req, res) => {
            res.sendStatus(502)
        });

        router.post("/RequestDancerProfiles", async (req, res, next) => {
            res.sendStatus(502)
        });

        /**
         * UploadDancerProfile upserts given profile data in body to database.
         */
        router.post("/UploadDancerProfile", 
            nasAuth.require,
            cleanClientBody,
        async (req, res, next) => {
            
            // First step is to check whether client's account exists.
            const {
                avatar, country, name, 
                songsPlayed, stars, unlocks, wdfRank
            } = req.body;

            const userId = req.uid

            // Check if client's userId already has a profile,
            // If they do, create a new one, if they don't update it (basically upsert)
            const profileAlreadyExists = await dancerCard.exists({ userId })

            // Profile doesn't exist, create one
            if (!profileAlreadyExists) {

                try {

                    const newProfile = await dancerCard.new({
                        userId, avatar, country, name,
                        songsPlayed, stars, unlocks, wdfRank
                    })

                    global.logger.info(`Created a new user for ${userId} : ${name}`)
                    
                    if (utils.isDev())
                        return res.send(newProfile)
                
                    return res.status(201).send()
                }
                catch(err) {
                    console.log(err)
                    return next({
                        status: 500,
                        message: `Error while trying to create a profile.`,
                        error: [err]
                    })
                }
            }

            // Profile exists, update profile by client's body.
            else {

                try {
                    const updatedProfile = await dancerCard.update({ userId }, req.body)

                    global.logger.info(`Updated profile of ${userId} : ${name}`)
                    
                    if (utils.isDev())
                        return res.send(updatedProfile)
                    
                    return res.status(200).send();
                }
                catch(err) {
                    return next({
                        status: 500,
                        message: `Error while trying to update profile.`,
                        error: [err]
                    })
                }

            }

        });
    }
}