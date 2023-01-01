const uuid = require("uuid");
const utils = require("utils");
const nas = require("nas-token-client");

module.exports = {

    name: `DancerCard`,
    description: `Keeps data of dancer profiles.`,
    version: `1.0.0`,

    async init(app, router) {

        const dancercard = require("dancercard");
        
        router.post("/RequestDancerProfile", nas.dev, async (req, res) => {
            let id = req.query.profileId;
            let profile = await dancercard.get({ profileId: id });

            res.send({ profile });
        });

        router.post("/RequestDancerProfiles", nas.dev, async (req, res, next) => {
            let ids = req.query.profileIds || "";
            let profiles = await dancercard.getMany({ profileId: (ids.split(",") || []) });

            res.send({ profiles });
        });

        /**
         * UploadDancerProfile upserts given profile data in body to database.
         */
        router.post("/UploadDancerProfile", nas.require, async (req, res, next) => {
            
            // First step is to check whether client's account exists.
            const {
                avatar, country, name, 
                songsPlayed, stars, unlocks, wdfRank
            } = req.body;

            const userId = req.uid;

            // If client doesn't have a profile entry, create a new profile
            // but if client has a profile, update it with data from body
            const profileExists = await dancercard.exists({ userId });

            // Profile doesn't exist, create one
            if (!profileExists) {
                try {
                    const profileId = uuid.v4();
                    const newProfile = await dancercard.new({
                        profileId, userId, 
                        avatar, country, name,
                        songsPlayed, stars, unlocks, wdfRank
                    });
                    global.logger.info(`Created Dancercard of '${name}' from '${country}' / UserId: ${userId}`);
                    
                    if (utils.isDev())
                        return res.send(newProfile);
                
                    return res.status(200).send();
                }
                catch(err) {
                    return next({
                        status: 500,
                        message: `Error while trying to create a profile.`,
                        error: err.message
                    });
                }
            }

            // Profile exists, update profile by client's body.
            else if (profileExists) {

                // We must remove any sensitive data that shouldn't be modified from body
                ["_id", "userId", "profileId"].forEach(k => { delete req.body[k]; });

                try {
                    const updatedProfile = await dancercard.update({ userId }, req.body);
                    global.logger.info(`Updated Dancercard of '${name}' from '${country}' / UserId: ${userId}`);
                    
                    if (utils.isDev())
                        return res.send(updatedProfile);
                    
                    return res.status(200).send();
                }
                catch(err) {
                    return next({
                        status: 500,
                        message: `Error while trying to update profile.`,
                        error: err.message
                    });
                }
            }

        });
    }
}