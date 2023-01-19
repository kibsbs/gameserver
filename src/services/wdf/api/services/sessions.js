const fs = require("fs");
const express = require("express");
const router = express.Router();

const utils = require("utils");
const validate = require("../validator");

const Session = require("wdf-session");
const Playlist = require("wdf-playlist");
const Scores = require("wdf-score");

const { uniqueNamesGenerator, adjectives, colors, animals, names } = require('unique-names-generator');
const nameConfig = {
    dictionaries: [names], // colors can be omitted here as not used
    separator: "",
    style: "upperCase"
};

router.post("/status", validate("sessionsStatus"), async (req, res, next) => {

    const { version } = req.body;

    try {

        const session = new Session(version);
        const playlist = new Playlist(version);
        const scores = new Scores(version);

        const screens = await playlist.getScreens();
        const topScores = await scores.getRanks(10);
        const themeResults = await scores.getThemeAndCoachResult();
        const numberOfWinners = await scores.getNumberOfWinners(themeResults);

        let result = {
            count: await session.sessionCount(),
            playlist: {
                prev: {},
                cur: {},
                next: {}
            },
            themeResults,
            numberOfWinners,
            topScores: topScores.map(s => {
                return {
                    profile: s.profile,
                    coachIndex: s.coachIndex,
                    themeIndex: s.themeIndex,
                    totalScore: s.totalScore,
                    stars: s.stars,
                    rank: s.rank
                }
            })
        };

        for (const key in result.playlist) {
            if (Object.hasOwnProperty.call(result.playlist, key)) {
                const screen = screens[key];
                if (!screen) continue;

                const { mapName, title, artist, numCoach, difficulty } = screen.map;
    
                result.playlist[key] = {
                    theme: {
                        ...screen.theme,
                        isVote: playlist.isThemeVote(screen.theme.id),
                        isCommunity: playlist.isThemeCommunity(screen.theme.id),
                        isCoach: playlist.isThemeCoach(screen.theme.id)
                    },
                    map: { mapName, title, artist, numCoach, difficulty },
                    timing: {
                        songStart: screen.timing.start_song_time,
                        songEnd: screen.timing.stop_song_time,
                        recapStart: screen.timing.recap_start_time,
                        recapEnd: screen.timing.request_playlist_time,
                        preSongStart: screen.timing.base_time,
                        preSongEnd: screen.timing.start_song_time
                    }
                };
            };
        };

        return res.json(result);
    }
    catch(err) {
        console.log(err)
        return next({
            status: 500,
            message: "Can't fetch status",
            error: err.message
        });
    };
});

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