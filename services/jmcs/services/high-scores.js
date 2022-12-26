

const Joi = require("joi")
const parseMultiPart = require('express-parse-multipart');

const nasAuth = require("nas-auth-client");
const utils = require("utils");

module.exports = {

    name: `HighScores`,
    description: `Provides all Mash-Up data such as online maps and metadata.`,
    version: `1.0.0`,

    async init(app, router) {

        const scores = require("jd-scores")
        const dancerCardClient = require("jd-dancercard").client

        const scoreData = Joi.object().keys({
            coachId: Joi.number().default(1).min(1).max(4).required(),
            gameMode: Joi.number().default(0).min(0).max(5).required(),
            songId: Joi.number().required(),
            totalScore: Joi.number().min(0).max(1).default(0).required(),
            partialScores: Joi.binary().required()
        });

        function parseScoreData(req, res, next) {

            let body = {}
            // Parse the form-data body
            if (!req.formData)
                return next({
                    status: 400,
                    message: `Missing form data`
                })

            // Keep partialScores a buffer
            req.formData.map(a => {
                if (a.name !== "partialScores") body[a.name] = Buffer.from(body[a.name] = a.data).toString()
                else body[a.name] = a.data
            })

            req.body = body
            return next()
        };

        async function getChallengeScores(songId, minimalScore, gameMode = 0) {

            // Get all scores matching songId and gameMode
            // and with minimalScore higher than player's minimalScore.
            const query = {
                $and: [ { songId }, { gameMode } ],
                totalScore: { $gt: minimalScore }
            }
            const scores = await scores.getMany(query, 5)
            
            return scores
        };

        router.post("/uploadMyScore",
            parseMultiPart, 
            parseScoreData,
            nasAuth.require,
            dancerCardClient,
        async (req, res) => {
            
            const { coachId, gameMode, songId, totalScore, partialScores } = req.body
            
            const profile = req.profile
            const profileId = profile.profileId
            const gameId = req.gid

            // totalScore multiplied by maxScore will result in the actual score.
            const realScore = parseInt(totalScore * global.config.maxScore);

            // Create a new score.
            const newScore = await scores.new({
                profileId,
                coachId, 
                gameMode, 
                songId,
                gameId,
                score: realScore,
                totalScore, 
                partialScores,
                profile
            });

            if (utils.isDev())
                return res.status(201).json(newScore)

            return res.status(201).send()
        });

        router.post("/lookForOpponentHighScores", nasAuth.require, async (req, res, next) => {

            const { gameMode, minimalScore, songId } = req.body

            let scores = await getChallengeScores(songId, minimalScore, gameMode)
            let mappedScores = scores.map((p, i) => {
                return {
                    avatar: p.profile.avatar,
                    name: p.profile.name,
                    country: p.profile.country,
                    score: p.totalScore
                }
            });
            mappedScores = serialize.setIndexes(mappedScores);

            return res.send(
                serialize({
                    ...mappedScores,
                    count: scores.length
                })
            )

        });


        router.post("/lookForSpecificHighScore", (req, res, next) => {
            res.sendStatus(502)
        });

    }
}