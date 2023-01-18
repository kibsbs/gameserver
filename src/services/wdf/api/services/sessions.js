const fs = require("fs");
const express = require("express");
const router = express.Router();

const utils = require("utils");
const validate = require("../validator");

const Session = require("wdf-session");

const { uniqueNamesGenerator, adjectives, colors, animals, names } = require('unique-names-generator');
const nameConfig = {
    dictionaries: [names], // colors can be omitted here as not used
    separator: "",
    style: "upperCase"
};

router.post("/create-bots", validate("createBots"), async (req, res, next) => {

    const { amount, version } = req.body;

    const session = new Session(version);

    try {
        for (let i = 0; i < amount; i++) {
            
            const randomName = uniqueNamesGenerator(nameConfig);
            const randomCountry = Math.floor(Math.random() * 9000) + 1000;
            const randomAvatar = Math.floor(Math.random() * 400) + 1;
            const randomUserId = Math.floor(Math.random() * 1000000) + 9999999;
            const randomSessionId = Math.floor(Math.random() * 1000000) + 9999999;
            const randomRank = Math.floor(Math.random() * 5000) + 1;

            await session.newSession({
                userId: randomUserId.toString(),
                sessionId: randomSessionId.toString(),
                game: {
                    id: "FAKE",
                    version: version
                },
                profile: {
                    avatar: randomAvatar,
                    name: randomName,
                    country: randomCountry,
                    rank: randomRank
                },
                isBot: true
            });
        }

        global.logger.info(`Created ${amount} amount of bots in ${version} WDF!`);
        return res.json({
            message: `Created ${amount} amount of bots in ${version} WDF!`
        });
    }
    catch(err) {
        return next({
            status: 500,
            message: err.message
        });
    };
});


router.post("/delete-bots", validate("deleteBots"), async (req, res, next) => {

    const { amount, version } = req.body;

    const session = new Session(version);

    try {
        const { deletedCount } = await session.deleteManySessions({
            isBot: true
        });
        
        global.logger.info(`Deleted ${deletedCount} bots from ${version} WDF!`);

        return res.json({
            message: `Deleted ${deletedCount} bots from ${version} WDF!`
        });
    }
    catch(err) {
        return next({
            status: 500,
            message: err.message
        });
    };
});

module.exports = router;