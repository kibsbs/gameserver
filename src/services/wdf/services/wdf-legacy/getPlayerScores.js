const Joi = require("joi")

const uenc = require("uenc")
const utils = require("utils")

const session = require("jd-session")
const scores = require("jd-scores")
const lobby = require("jd-lobby")

module.exports = {

    name: `getMyRank`,
    description: ``,
    version: `1.0.0`,

    async init(req, res, next) {

        let send_score = req.body.send_score === "1" ? true : false
        let sids = 
                req.body.sid_list.split(';')
                .filter(function (a) { return a }) // remove emtpy elements
                .map(sid => parseInt(sid)) // string to number
                .filter(sid => parseInt(sid) !== parseInt(req.sessionId)) // exclude client sessionid from list

        if (sids.length > global.config.lobby.maxSessions) {
            return next({
                status: 400,
                message: `SID list cannot exceed max sessions allowed!`
            })
        }

        let response = {
            num: 1,
            t: utils.getServerTime(),
            count: await session.count(req.version)
        }

        // Client sends a score entry so register it to DB
        // and send lobby players scores excluding requester
        if (send_score) {

            // When send_score is true some required body keys must be provided
            const schema = Joi.object().keys({
                coachindex: Joi.number()
                    .min(0)
                    .max(3)
                    .required(),
                event: Joi.string()
                    .allow("")
                    .required(),
                lastmove: Joi.number()
                    .required(),
                score: Joi.number()
                    .required(),
                song_id: Joi.number()
                    .required(),
                stars: Joi.number()
                    .min(0)
                    .max(7)
                    .required(),
                themeindex: Joi.number()
                    .min(0)
                    .max(5)
                    .required(),
                total_score: Joi.number()
                    .min(0)
                    .max(global.config.maxScore)
                    .required(),
            }).unknown(true)
            
            const { error, value } = schema.validate(req.body)

            if (error || !value) {
                return next({
                    status: 400,
                    service: "getPlayerScores",
                    message: "Error occured while trying to verify schema.",
                    error: [error.details]
                })
            }

            Object.assign(req.body, value)

            const { coachindex, event, lastmove, score, stars, themeindex, total_score } = req.body

            // Upsert score of client to db (creates if doesnt exist, updates if exists)
            await scores.db.updateOne({
                sessionId: req.sessionId,
                version: req.version
            }, {
                sessionId: req.sessionId,
                version: req.version,
                coachIndex: coachindex,
                event,
                lastMove: lastmove,
                score, 
                stars, 
                themeIndex: themeindex, 
                totalScore: total_score,
                player: req.player
            }, {  upsert: true  })

            response = {
                ...response,

                score: total_score, // client score
                rank: 0, // client rank

                total: 0, // unknown?

                // theme and coach star counts
                theme0: 0,
                theme1: 0,
                coach0: 0,
                coach1: 0,
                coach2: 0,
                coach3: 0
            }
        }

        // We get all ranks after client sends their score so that it's accurate

        let ranks = await scores.getRanks(req.version) // Get all scores by version

        // Finds rank of given sessionId
        // basically index of given sessionid in ranks array is their rank
        // (there is probably a better way in mongo to do the rank system)
        function getRank(sessionId) {
            let rank = ranks.findIndex(s => s.sessionId == sessionId) + 1

            if (rank == 0) return -1
            else return rank
        }

        // If any sid is given get each sids score and add them to response
        if (sids.length > 0) {
            // Scores of sesionIds from sidlist
            let lobbyScores = await scores.db.find({
                sessionId: sids
            });

            // Minify results of scores in lobby
            let minified = [];
            for (let s of lobbyScores) {
                minified.push({
                    s: s.sessionId,
                    sc: s.totalScore,
                    r: getRank(s.sessionId),
                    e: s.event,
                    c: s.coachIndex,
                    o: s.player.onlinescore
                })
            }

            // To make the game remove players who already left the lobby
            // 1. loop all sids and check if each sid is in lobby
            // 2. if one sid isnt in the lobby show its score as -1 and rank as 1
            // this makes the game remove the player from players
            sids.forEach(sid => {
                const sidIsInLobby = lobbyScores.some(s => s.sessionId === sid)
                if (!sidIsInLobby) {
                    minified.push({
                        s: sid,
                        sc: -1,
                        r: 1
                    })
                }
            })
            response = {
                ...uenc.setIndex(minified, 1, "_"), // score result
                ...response,
                num: minified.length + 1
            }
        }

        response.rank = getRank(req.sessionId)
        return res.uenc(response)
    }
}